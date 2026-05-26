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
          class="mt-6 !bg-primary !border-primary"
          size="large"
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
            :key="item.product_id"
            class="cart-item-row items-center gap-4 px-6 py-5 border-b border-gray-100 last:border-0"
        >
          <!-- Checkbox -->
          <a-checkbox v-model:checked="item.checked"/>

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
                    v-for="tv in item.product.tier_variants"
                    :key="tv.name"
                    class="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5 inline-block"
                >
                  {{ tv.name }}: {{ tv.options[0] }}
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
                  class="w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg leading-none"
                  :disabled="item.quantity <= 1"
                  @click="decreaseQty(item)"
              >−
              </button>
              <input
                  type="number"
                  :value="item.quantity"
                  :min="1"
                  :max="item.product?.stock_quantity ?? 99"
                  class="qty-input w-12 h-9 text-center text-sm border-x border-gray-300 focus:outline-none focus:bg-orange-50 transition"
                  @input="onQtyInput(item, $event)"
                  @blur="onQtyBlur(item, $event)"
              />
              <button
                  class="w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg leading-none"
                  :disabled="item.quantity >= (item.product?.stock_quantity ?? 99)"
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
              class="!bg-primary !border-primary !h-12 !px-10 !text-base !font-medium !rounded"
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
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {message} from 'ant-design-vue'
import {useRouter} from 'vue-router'
import {cartService, type CartItem} from '@/services/cart/cartService'
import {productService, type Product} from '@/services/product/productService'

const router = useRouter()

// ─── Types ────────────────────────────────────────────────────────────────────
interface EnrichedCartItem extends CartItem {
  product?: Product
  checked: boolean
}

// ─── State ────────────────────────────────────────────────────────────────────
const loading = ref(false)
const enrichedItems = ref<EnrichedCartItem[]>([])
const inactiveItems = ref<CartItem[]>([])

// Debounce timers keyed by product_id
const debounceTimers = new Map<number, ReturnType<typeof setTimeout>>()
onUnmounted(() => debounceTimers.forEach(t => clearTimeout(t)))

// ─── Computed ─────────────────────────────────────────────────────────────────
const allSelected = computed(
    () => enrichedItems.value.length > 0 && enrichedItems.value.every(i => i.checked)
)
const someSelected = computed(
    () => enrichedItems.value.some(i => i.checked) && !allSelected.value
)
const selectedCount = computed(
    () => enrichedItems.value.filter(i => i.checked).length
)
const selectedTotal = computed(() =>
    enrichedItems.value
        .filter(i => i.checked)
        .reduce((sum, i) => sum + (i.product?.price_info?.current_price ?? 0) * i.quantity, 0)
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}`

const currency = (n: number) =>
    n.toLocaleString('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 0})

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://placehold.co/80x80?text=No+Image'
}

const clampQty = (item: EnrichedCartItem, val: number): number => {
  const max = item.product?.stock_quantity ?? 99
  return Math.max(1, Math.min(max, isNaN(val) ? 1 : val))
}

// ─── API sync ─────────────────────────────────────────────────────────────────
const syncCartItem = async (item: EnrichedCartItem, quantity: number) => {
  try {
    await cartService.updateCart([{
      product_id: item.product_id,
      product_variant_id: item.product_variant_id,
      quantity,
    }])
  } catch {
    message.error('Cập nhật giỏ hàng thất bại')
  }
}

/** Schedule a debounced API sync (500 ms) — resets timer on each call */
const scheduleSync = (item: EnrichedCartItem) => {
  if (debounceTimers.has(item.product_id)) {
    clearTimeout(debounceTimers.get(item.product_id)!)
  }
  debounceTimers.set(
      item.product_id,
      setTimeout(() => {
        syncCartItem(item, item.quantity)
        debounceTimers.delete(item.product_id)
      }, 500)
  )
}

/** Flush any pending debounce for an item immediately */
const flushSync = (item: EnrichedCartItem) => {
  if (debounceTimers.has(item.product_id)) {
    clearTimeout(debounceTimers.get(item.product_id)!)
    debounceTimers.delete(item.product_id)
  }
  syncCartItem(item, item.quantity)
}

// ─── Actions ──────────────────────────────────────────────────────────────────
const toggleAll = (e: any) => {
  const checked = e.target.checked
  enrichedItems.value.forEach(i => (i.checked = checked))
}

const increaseQty = (item: EnrichedCartItem) => {
  const next = clampQty(item, item.quantity + 1)
  if (next !== item.quantity) {
    item.quantity = next
    scheduleSync(item)
  }
}

const decreaseQty = (item: EnrichedCartItem) => {
  const next = clampQty(item, item.quantity - 1)
  if (next !== item.quantity) {
    item.quantity = next
    scheduleSync(item)
  }
}

/** Called on every keystroke inside the qty input */
const onQtyInput = (item: EnrichedCartItem, e: Event) => {
  const input = e.target as HTMLInputElement
  const raw = parseInt(input.value, 10)
  if (!isNaN(raw)) {
    const clamped = clampQty(item, raw)
    item.quantity = clamped
    if (clamped !== raw) input.value = String(clamped)
    scheduleSync(item)
  }
}

/** On blur: correct empty/out-of-range values and flush immediately */
const onQtyBlur = (item: EnrichedCartItem, e: Event) => {
  const input = e.target as HTMLInputElement
  const raw = parseInt(input.value, 10)
  const clamped = clampQty(item, raw)
  item.quantity = clamped
  input.value = String(clamped)
  flushSync(item)
}

const removeItem = async (item: EnrichedCartItem) => {
  // cancel any pending debounce before removing
  if (debounceTimers.has(item.product_id)) {
    clearTimeout(debounceTimers.get(item.product_id)!)
    debounceTimers.delete(item.product_id)
  }
  enrichedItems.value = enrichedItems.value.filter(i => i.product_id !== item.product_id)
  message.success('Đã xóa sản phẩm khỏi giỏ hàng')
  await syncCartItem(item, 0) // quantity = 0 signals removal
}

const removeSelected = async () => {
  const toRemove = enrichedItems.value.filter(i => i.checked)
  if (toRemove.length === 0) {
    message.warning('Vui lòng chọn sản phẩm cần xóa')
    return
  }
  toRemove.forEach(item => {
    if (debounceTimers.has(item.product_id)) {
      clearTimeout(debounceTimers.get(item.product_id)!)
      debounceTimers.delete(item.product_id)
    }
  })
  enrichedItems.value = enrichedItems.value.filter(i => !i.checked)
  message.success(`Đã xóa ${toRemove.length} sản phẩm khỏi giỏ hàng`)
  try {
    await cartService.updateCart(
        toRemove.map(i => ({product_id: i.product_id, product_variant_id: i.product_variant_id, quantity: 0}))
    )
  } catch {
    message.error('Cập nhật giỏ hàng thất bại')
  }
}

const checkout = () => {
  if (selectedCount.value === 0) return
  router.push('/checkout')
}

// ─── Data loading ─────────────────────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  try {
    const cart = await cartService.getCart()
    inactiveItems.value = cart.inactive_items ?? []

    if (!cart.active_items?.length) return

    const productIds = [...new Set(cart.active_items.map(i => i.product_id))]
    const products = await productService.fetchByCondition({product_ids: productIds})

    const productMap = new Map<number, Product>()
    products.forEach(p => productMap.set(p.id, p))

    enrichedItems.value = cart.active_items.map(item => ({
      ...item,
      product: productMap.get(item.product_id),
      checked: false,
    }))
  } catch {
    message.error('Không tải được giỏ hàng. Vui lòng thử lại.')
  } finally {
    loading.value = false
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
