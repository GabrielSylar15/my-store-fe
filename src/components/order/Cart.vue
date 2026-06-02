<template>
  <a-spin :spinning="loading" tip="Đang tải...">
    <!-- Empty cart -->
    <div
        v-if="!loading && enrichedItems.length === 0"
        class="flex flex-col items-center py-24 bg-white rounded shadow"
    >
      <iconify-icon icon="bx:cart" width="100" height="100" class="text-gray-200"></iconify-icon>
      <p class="text-gray-400 mt-4 text-lg">Giỏ hàng của bạn còn trống</p>
      <a-button
          type="primary"
          size="large"
          class="mt-6"
          @click="router.push('/product')"
      >
        Mua Ngay
      </a-button>
    </div>

    <template v-else>
      <!-- ===== Column header ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-4 cart-header-row items-center text-gray-500 text-sm">
        <a-checkbox
            :checked="allSelected"
            :indeterminate="someSelected"
            @change="toggleAll"
        />
        <span class="ml-4">Sản Phẩm</span>
        <span class="text-center">Đơn Giá</span>
        <span class="text-center">Số Lượng</span>
        <span class="text-center">Số Tiền</span>
        <span class="text-center">Thao Tác</span>
      </div>

      <!-- ===== Active cart items ===== -->
      <div class="bg-white rounded shadow mb-3">
        <div
            v-for="item in enrichedItems"
            :key="itemKey(item)"
            class="cart-item-row items-center gap-4 px-6 py-5 border-b border-gray-100 last:border-0"
        >
          <!-- Checkbox -->
          <a-checkbox
              :checked="checkedSet.has(itemKey(item))"
              @change="(e) => toggleItem(item, e)"
          />

          <!-- Product info -->
          <div class="flex items-start gap-3 ml-4 min-w-0">
            <img
                :src="getImageUrl(item.image)"
                :alt="item.product?.name"
                class="w-20 h-20 object-cover rounded border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition"
                @error="onImgError"
                @click="router.push(`/product/${item.product_id}`)"
            />
            <div class="flex-1 min-w-0">
              <p
                  class="text-sm text-gray-800 line-clamp-2 font-medium cursor-pointer hover:text-primary transition"
                  @click="router.push(`/product/${item.product_id}`)"
              >
                {{ item.product?.name || `Sản phẩm #${item.product_id}` }}
              </p>
              <div v-if="item.product?.tier_variants?.length" class="mt-2 flex flex-wrap gap-1">
                <span
                    v-for="(label, i) in getVariantLabels(item)"
                    :key="i"
                    class="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5 inline-block"
                >
                  {{ label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Unit price -->
          <div class="text-center">
            <span class="text-gray-700 text-sm">
              {{ currency(item.product?.price_info?.current_price ?? 0) }}
            </span>
          </div>

          <!-- Quantity control -->
          <div class="flex items-center justify-center">
            <div class="flex items-center border border-gray-300 rounded overflow-hidden">
              <button
                  class="w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer text-lg leading-none"
                  @click="decreaseQty(item)"
              >−
              </button>
              <input
                  type="number"
                  :value="item.quantity"
                  :min="1"
                  :max="item.product?.stock_quantity ?? 99"
                  class="qty-input w-12 h-9 text-center text-sm border-x border-gray-300 focus:outline-none focus:bg-primary/10 transition"
                  @input="onQtyInput(item, $event)"
                  @blur="onQtyBlur(item, $event)"
              />
              <button
                  class="w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg leading-none"
                  :disabled="item.quantity >= getVariantStock(item)"
                  @click="increaseQty(item)"
              >+
              </button>
            </div>
          </div>

          <!-- Line total -->
          <div class="text-center">
            <span class="text-primary font-semibold text-sm">
              {{ currency((item.product?.price_info?.current_price ?? 0) * item.quantity) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="text-center flex flex-col items-center gap-1">
            <button
                class="text-gray-500 hover:text-primary text-sm transition cursor-pointer"
                @click="removeItem(item)"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- ===== Inactive items (greyed out) ===== -->
      <div v-if="inactiveItems.length > 0" class="bg-white rounded shadow mb-24 px-6 py-4">
        <p class="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
          <iconify-icon icon="material-symbols:info-outline" width="16" height="16"></iconify-icon>
          Sản phẩm không còn hoạt động
        </p>
        <div
            v-for="item in inactiveItems"
            :key="item.product_id"
            class="flex items-center gap-3 py-2 opacity-50"
        >
          <img
              :src="getImageUrl(item.image)"
              class="w-14 h-14 object-cover rounded border border-gray-200"
              @error="onImgError"
          />
          <div>
            <p class="text-sm text-gray-500">Sản phẩm #{{ item.product_id }}</p>
            <p class="text-xs text-gray-400">Sản phẩm này hiện không còn kinh doanh</p>
          </div>
        </div>
      </div>

      <!-- spacer for fixed bottom bar -->
      <div class="h-20"></div>
    </template>
  </a-spin>

  <!-- ===== Fixed bottom checkout bar ===== -->
  <Teleport to="body">
    <div
        v-if="!loading && enrichedItems.length > 0"
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[60] py-3 px-6"
    >
      <div class="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
        <!-- Left actions -->
        <div class="flex items-center gap-4 flex-shrink-0">
          <a-checkbox
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="toggleAll"
          >
            <span class="text-sm ml-1">Chọn Tất Cả ({{ enrichedItems.length }})</span>
          </a-checkbox>
          <button
              class="text-sm text-gray-600 hover:text-primary transition cursor-pointer"
              @click="removeSelected"
          >
            Xóa
          </button>
          <button class="text-sm text-gray-600 hover:text-primary transition cursor-pointer hidden sm:block">
            Lưu vào mục Đã Thích
          </button>
        </div>

        <div class="flex-1"></div>

        <!-- Right: total + checkout -->
        <div class="flex items-center gap-6">
          <div class="text-right leading-tight">
            <p class="text-sm text-gray-600">
              Tổng cộng
              <span class="text-gray-800">({{ selectedCount }} sản phẩm)</span>:
            </p>
            <p class="text-2xl font-bold text-primary">{{ currency(selectedTotal) }}</p>
          </div>
          <a-button
              type="primary"
              size="large"
              class="!h-12 !px-10 !text-base !font-medium"
              :disabled="selectedCount === 0"
              @click="checkout"
          >
            Mua Hàng
          </a-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import type { EnrichedCartItem } from '@/stores/cartStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { cartService } from '@/services/cart/cartService'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

// ─── Selection state (UI-only, not part of cart data) ─────────────────────────
const checkedSet = ref(new Set<string>())

const itemKey = (i: { product_id: number; product_variant_id: number }) =>
  `${i.product_id}-${i.product_variant_id}`

const enrichedItems = computed(() => cartStore.enrichedItems)
const inactiveItems = computed(() => cartStore.inactiveItems)
const loading       = computed(() => cartStore.loading)

// ─── Computed selection ────────────────────────────────────────────────────────
const allSelected = computed(
  () => enrichedItems.value.length > 0 && enrichedItems.value.every(i => checkedSet.value.has(itemKey(i)))
)
const someSelected = computed(
  () => enrichedItems.value.some(i => checkedSet.value.has(itemKey(i))) && !allSelected.value
)
const selectedCount = computed(
  () => enrichedItems.value.filter(i => checkedSet.value.has(itemKey(i))).length
)
const selectedTotal = computed(() =>
  enrichedItems.value
    .filter(i => checkedSet.value.has(itemKey(i)))
    .reduce((sum, i) => sum + (i.product?.price_info?.current_price ?? 0) * i.quantity, 0)
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}`

/** Returns "TierName: OptionValue" labels for the specific variant selected in this cart item. */
const getVariantLabels = (item: EnrichedCartItem): string[] => {
  const product = item.product
  if (!product?.tier_variants?.length) return []
  const variant = product.product_variants?.find(v => v.id === item.product_variant_id)
  if (!variant?.tier_index?.length) return product.tier_variants.map(tv => `${tv.name}: ${tv.options[0]}`)
  return variant.tier_index.map((optIdx, tierIdx) => {
    const tier = product.tier_variants[tierIdx]
    return tier ? `${tier.name}: ${tier.options[optIdx - 1] ?? ''}` : ''
  }).filter(Boolean)
}

const currency = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

const onImgError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=No+Image'
}

/** Variant stock takes priority over product-level stock. */
const getVariantStock = (item: EnrichedCartItem): number => {
  const variant = item.product?.product_variants?.find(v => v.id === item.product_variant_id)
  return variant?.stock_quantity ?? item.product?.stock_quantity ?? 99
}

const clampQty = (item: EnrichedCartItem, val: number): number => {
  const max = getVariantStock(item)
  return Math.max(1, Math.min(max, isNaN(val) ? 1 : val))
}

// ─── Debounced API sync (keyed by product_id + variant_id) ────────────────────
// Local store quantity is updated immediately; the API call is debounced for UX.
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()
onUnmounted(() => debounceTimers.forEach(t => clearTimeout(t)))

const cancelTimer = (key: string) => {
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key)!)
    debounceTimers.delete(key)
  }
}

const scheduleSync = (productId: number, variantId: number, qty: number) => {
  const key = `${productId}-${variantId}`
  cancelTimer(key)
  debounceTimers.set(key, setTimeout(async () => {
    debounceTimers.delete(key)
    try {
      // Call API directly — local state is already updated optimistically by the caller.
      // Using setQuantity here would double-apply the local mutation.
      await cartService.updateCart([{ product_id: productId, product_variant_id: variantId, quantity: qty }])
    } catch {
      message.error('Cập nhật giỏ hàng thất bại')
    }
  }, 500))
}

const flushSync = (productId: number, variantId: number, qty: number) => {
  cancelTimer(`${productId}-${variantId}`)
  cartService.updateCart([{ product_id: productId, product_variant_id: variantId, quantity: qty }]).catch(() =>
    message.error('Cập nhật giỏ hàng thất bại')
  )
}

// ─── Quantity actions ─────────────────────────────────────────────────────────
const increaseQty = (item: EnrichedCartItem) => {
  const next = clampQty(item, item.quantity + 1)
  if (next === item.quantity) return
  // optimistic local update so the UI is instant
  const raw = cartStore.rawItems.find(
    i => i.product_id === item.product_id && i.product_variant_id === item.product_variant_id
  )
  if (raw) raw.quantity = next
  scheduleSync(item.product_id, item.product_variant_id, next)
}

const decreaseQty = (item: EnrichedCartItem) => {
  if (item.quantity === 1) {
    // Decreasing below 1 means removal — ask the user first
    const name = item.product?.name ?? 'sản phẩm này'
    const label = name.length > 60 ? name.slice(0, 57) + '…' : name
    Modal.confirm({
      title: 'Xóa sản phẩm khỏi giỏ hàng?',
      content: `"${label}" sẽ bị xóa khỏi giỏ hàng của bạn.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Giữ lại',
      centered: true,
      onOk: () => removeItem(item),
    })
    return
  }
  const next = Math.max(1, item.quantity - 1)
  const raw = cartStore.rawItems.find(
    i => i.product_id === item.product_id && i.product_variant_id === item.product_variant_id
  )
  if (raw) raw.quantity = next
  scheduleSync(item.product_id, item.product_variant_id, next)
}

const onQtyInput = (item: EnrichedCartItem, e: Event) => {
  const input = e.target as HTMLInputElement
  const raw = parseInt(input.value, 10)
  if (isNaN(raw)) return
  const clamped = clampQty(item, raw)
  const storeItem = cartStore.rawItems.find(
    i => i.product_id === item.product_id && i.product_variant_id === item.product_variant_id
  )
  if (storeItem) storeItem.quantity = clamped
  if (clamped !== raw) input.value = String(clamped)
  scheduleSync(item.product_id, item.product_variant_id, clamped)
}

const onQtyBlur = (item: EnrichedCartItem, e: Event) => {
  const input = e.target as HTMLInputElement
  const clamped = clampQty(item, parseInt(input.value, 10))
  const storeItem = cartStore.rawItems.find(
    i => i.product_id === item.product_id && i.product_variant_id === item.product_variant_id
  )
  if (storeItem) storeItem.quantity = clamped
  input.value = String(clamped)
  flushSync(item.product_id, item.product_variant_id, clamped)
}

// ─── Selection actions ────────────────────────────────────────────────────────
const toggleAll = (e: any) => {
  if (e.target.checked) {
    checkedSet.value = new Set(enrichedItems.value.map(itemKey))
  } else {
    checkedSet.value = new Set()
  }
}

const toggleItem = (item: EnrichedCartItem, e: any) => {
  const k = itemKey(item)
  const next = new Set(checkedSet.value)
  if (e.target.checked) next.add(k)
  else next.delete(k)
  checkedSet.value = next
}

// ─── Remove actions ───────────────────────────────────────────────────────────
const removeItem = async (item: EnrichedCartItem) => {
  cancelTimer(itemKey(item))
  checkedSet.value.delete(itemKey(item))
  try {
    await cartStore.removeItems([{
      product_id: item.product_id,
      product_variant_id: item.product_variant_id,
      quantity: 0,
    }])
    message.success('Đã xóa sản phẩm khỏi giỏ hàng')
  } catch {
    message.error('Xóa sản phẩm thất bại')
  }
}

const removeSelected = async () => {
  const toRemove = enrichedItems.value.filter(i => checkedSet.value.has(itemKey(i)))
  if (toRemove.length === 0) {
    message.warning('Vui lòng chọn sản phẩm cần xóa')
    return
  }
  toRemove.forEach(i => cancelTimer(itemKey(i)))
  const next = new Set(checkedSet.value)
  toRemove.forEach(i => next.delete(itemKey(i)))
  checkedSet.value = next
  try {
    await cartStore.removeItems(
      toRemove.map(i => ({ product_id: i.product_id, product_variant_id: i.product_variant_id, quantity: 0 }))
    )
    message.success(`Đã xóa ${toRemove.length} sản phẩm khỏi giỏ hàng`)
  } catch {
    message.error('Xóa sản phẩm thất bại')
  }
}

const checkout = () => {
  if (selectedCount.value === 0) return
  const selected = enrichedItems.value.filter(i => checkedSet.value.has(itemKey(i)))
  checkoutStore.setSelectedItems(selected)
  router.push('/checkout')
}

// ─── Data loading ─────────────────────────────────────────────────────────────
onMounted(() => {
  cartStore.loadCart(true)

  const raw = sessionStorage.getItem('cart_preselect')
  if (raw) {
    sessionStorage.removeItem('cart_preselect')
    const keys: string[] = JSON.parse(raw)
    // Apply pre-selection once loading finishes
    const stop = watch(loading, (isLoading) => {
      if (!isLoading) {
        checkedSet.value = new Set(keys.filter(k => enrichedItems.value.some(i => itemKey(i) === k)))
        stop()
      }
    }, { immediate: true })
  }
})
</script>

<style scoped>
/* 6-column grid: checkbox | product info | unit price | qty | total | action */
.cart-header-row,
.cart-item-row {
  display: grid;
  grid-template-columns: 20px 1fr 160px 160px 130px 100px;
  align-items: center;
  gap: 0; /* columns are fixed-width; no extra gap needed */
}

/* Hide native number-input spinner arrows */
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.qty-input {
  -moz-appearance: textfield;
}

@media (max-width: 768px) {
  .cart-header-row {
    display: none;
  }

  .cart-item-row {
    grid-template-columns: 20px 1fr;
    gap: 12px;
  }

  .cart-item-row > *:nth-child(n+3) {
    grid-column: 2;
  }
}
</style>
