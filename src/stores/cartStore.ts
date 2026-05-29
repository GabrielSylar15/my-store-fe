import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService, type CartItem, type CartUpdateItem } from '@/services/cart/cartService'
import { productService, type Product } from '@/services/product/productService'

export interface EnrichedCartItem extends CartItem {
  product?: Product
}

export const useCartStore = defineStore('cart', () => {
  // ─── Raw state ──────────────────────────────────────────────────────────────
  const rawItems      = ref<CartItem[]>([])
  const inactiveItems = ref<CartItem[]>([])
  const productMap    = ref<Map<number, Product>>(new Map())
  const loading       = ref(false)
  const hasLoaded     = ref(false)

  // ─── Derived ────────────────────────────────────────────────────────────────
  const enrichedItems = computed<EnrichedCartItem[]>(() =>
    rawItems.value.map(item => ({
      ...item,
      product: productMap.value.get(item.product_id),
    }))
  )

  /** 5 newest items — prepend on add so first slot = most recently added */
  const recentItems = computed(() => enrichedItems.value.slice(0, 5))

  /** Total quantity across all active line-items */
  const totalCount = computed(() =>
    rawItems.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  // ─── Helpers ────────────────────────────────────────────────────────────────
  async function _fetchMissingProducts(ids: number[]) {
    const missing = [...new Set(ids)].filter(id => !productMap.value.has(id))
    if (!missing.length) return
    try {
      const products = await productService.fetchByCondition({ product_ids: missing, is_get_variant: true })
      const map = new Map(productMap.value)
      products.forEach(p => map.set(p.id, p))
      productMap.value = map
    } catch { /* non-critical */ }
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Load the full cart from the server (idempotent guard via hasLoaded). */
  async function loadCart(force = false) {
    if (loading.value) return
    if (hasLoaded.value && !force) return
    loading.value = true
    try {
      const cart = await cartService.getCart()
      rawItems.value = cart.active_items ?? []
      inactiveItems.value = cart.inactive_items ?? []
      await _fetchMissingProducts(rawItems.value.map(i => i.product_id))
      hasLoaded.value = true
    } catch { /* silently ignore — cart is non-critical for page render */ }
    finally { loading.value = false }
  }

  /**
   * Add qty of a product+variant to the cart (additive — reads current store quantity).
   * Merges with any existing quantity, calls the update API, then updates local state.
   */
  async function addItem(productId: number, productVariantId: number, qty: number): Promise<void> {
    const existing = rawItems.value.find(
      i => i.product_id === productId && i.product_variant_id === productVariantId
    )
    const newQty = (existing?.quantity ?? 0) + qty

    await cartService.updateCart([{
      product_id: productId,
      product_variant_id: productVariantId,
      quantity: newQty,
    }])

    if (existing) {
      existing.quantity = newQty
      rawItems.value = [existing, ...rawItems.value.filter(i => i !== existing)]
    } else {
      rawItems.value = [
        { product_id: productId, product_variant_id: productVariantId, quantity: newQty, image: '' },
        ...rawItems.value,
      ]
      await _fetchMissingProducts([productId])
    }
  }

  /**
   * Optimistically set the quantity for a specific product+variant.
   * quantity = 0 removes the item (API contract: qty 0 → delete).
   * Called by Cart.vue for direct quantity edits; does NOT debounce — callers are responsible.
   */
  async function setQuantity(productId: number, variantId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      rawItems.value = rawItems.value.filter(
        i => !(i.product_id === productId && i.product_variant_id === variantId)
      )
      await cartService.updateCart([{ product_id: productId, product_variant_id: variantId, quantity: 0 }])
      return
    }

    const existing = rawItems.value.find(
      i => i.product_id === productId && i.product_variant_id === variantId
    )
    if (existing) {
      existing.quantity = quantity
    } else {
      rawItems.value = [
        { product_id: productId, product_variant_id: variantId, quantity, image: '' },
        ...rawItems.value,
      ]
      await _fetchMissingProducts([productId])
    }
    await cartService.updateCart([{ product_id: productId, product_variant_id: variantId, quantity }])
  }

  /**
   * Remove one or more items from local state and call the API with quantity 0.
   */
  async function removeItems(items: CartUpdateItem[]) {
    const removeIds = new Set(items.map(i => `${i.product_id}-${i.product_variant_id}`))
    rawItems.value = rawItems.value.filter(
      i => !removeIds.has(`${i.product_id}-${i.product_variant_id}`)
    )
    await cartService.updateCart(items.map(i => ({ ...i, quantity: 0 })))
  }

  return {
    rawItems,
    inactiveItems,
    enrichedItems,
    recentItems,
    totalCount,
    loading,
    hasLoaded,
    loadCart,
    addItem,
    setQuantity,
    removeItems,
  }
})
