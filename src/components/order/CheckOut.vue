<template>
  <a-spin :spinning="loading" tip="Đang tải...">
    <!-- Empty state: no items selected to checkout -->
    <div
        v-if="!loading && items.length === 0"
        class="flex flex-col items-center py-24 bg-white rounded shadow"
    >
      <iconify-icon icon="bx:cart" width="100" height="100" class="text-gray-200"></iconify-icon>
      <p class="text-gray-400 mt-4 text-lg">Không có sản phẩm nào để thanh toán</p>
      <a-button type="primary" size="large" class="mt-6" @click="router.push('/cart')">
        Quay Lại Giỏ Hàng
      </a-button>
    </div>

    <template v-else>
      <!-- ===== Striped header ===== -->
      <div class="checkout-stripe mb-3"></div>

      <!-- ===== Address Section ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-5">
        <div class="flex items-center gap-2 text-primary font-medium mb-3">
          <iconify-icon icon="material-symbols:location-on" width="20" height="20"></iconify-icon>
          <span>Địa Chỉ Nhận Hàng</span>
        </div>

        <div v-if="address" class="flex items-center gap-4 flex-wrap">
          <p class="font-semibold text-gray-800 m-0">
            {{ address.full_name }} ({{ formatPhone(address.phone_number) }})
          </p>
          <p class="text-gray-700 m-0 flex-1 min-w-0">
            {{ address.address }}, {{ address.district }}, {{ address.city }}
          </p>
          <a-tag v-if="address.is_default" color="red" class="!border-primary !text-primary !bg-transparent">
            Mặc Định
          </a-tag>
          <button
              class="text-sky-500 hover:text-sky-600 text-sm font-medium cursor-pointer"
              @click="openAddressPicker"
          >
            Thay Đổi
          </button>
        </div>

        <!-- First-time user: no address yet -->
        <div v-else class="flex items-center justify-between gap-4 py-2">
          <div class="flex items-center gap-3 text-gray-500">
            <iconify-icon icon="material-symbols:info-outline" width="20" height="20"></iconify-icon>
            <span class="text-sm">Bạn chưa có địa chỉ nhận hàng. Vui lòng thêm địa chỉ để tiếp tục.</span>
          </div>
          <a-button type="primary" @click="openAddressForm()">
            <template #icon><iconify-icon icon="material-symbols:add" width="16" height="16"></iconify-icon></template>
            Thêm Địa Chỉ Mới
          </a-button>
        </div>
      </div>

      <!-- ===== Products Section ===== -->
      <div class="bg-white rounded shadow mb-3">
        <!-- column headers -->
        <div class="checkout-row-header items-center px-6 py-4 text-gray-500 text-sm border-b border-gray-100">
          <span>Sản phẩm</span>
          <span class="text-center">Đơn giá</span>
          <span class="text-center">Số lượng</span>
          <span class="text-right">Thành tiền</span>
        </div>

        <!-- shop label (mock) -->
        <div class="px-6 py-3 flex items-center gap-2 border-b border-gray-100">
          <span class="text-xs font-medium bg-primary text-white px-1.5 py-0.5 rounded">Mall</span>
          <span class="text-sm font-medium text-gray-800">GIADE Official Store</span>
        </div>

        <!-- items -->
        <div
            v-for="item in items"
            :key="itemKey(item)"
            class="checkout-row items-center px-6 py-4 border-b border-gray-100 last:border-0"
        >
          <div class="flex items-start gap-3 min-w-0">
            <img
                :src="getImageUrl(item.image)"
                :alt="item.product?.name"
                class="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                @error="onImgError"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 line-clamp-2 m-0">
                {{ item.product?.name || `Sản phẩm #${item.product_id}` }}
              </p>
              <p class="text-xs text-gray-500 mt-1 m-0">
                Loại: {{ variantLabel(item) }}
              </p>
            </div>
          </div>

          <div class="text-center text-gray-700 text-sm">
            {{ currency(unitPrice(item)) }}
          </div>

          <div class="text-center text-gray-700 text-sm">
            {{ item.quantity }}
          </div>

          <div class="text-right text-primary font-semibold text-sm">
            {{ currency(unitPrice(item) * item.quantity) }}
          </div>
        </div>

        <!-- Note + shipping row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 border-t border-dashed border-gray-200 bg-[#fafdff]">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 flex-shrink-0">Lời nhắn:</span>
            <a-input
                v-model:value="note"
                placeholder="Lưu ý cho Người bán..."
                :maxlength="200"
            />
          </div>
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-gray-600 m-0">
                Phương thức vận chuyển:
                <span class="font-medium text-gray-800 ml-1">{{ shipping.label }}</span>
              </p>
              <p class="text-xs text-gray-500 mt-1 m-0">{{ shipping.eta }}</p>
            </div>
            <button class="text-sky-500 hover:text-sky-600 text-sm font-medium cursor-pointer" @click="shippingModalOpen = true">
              Thay Đổi
            </button>
            <div class="text-right text-sm text-gray-700">
              {{ currency(shipping.fee) }}
            </div>
          </div>
        </div>

        <!-- Sub-total -->
        <div class="px-6 py-3 text-right text-sm text-gray-600 border-t border-gray-100">
          Tổng số tiền ({{ totalQuantity }} sản phẩm):
          <span class="text-primary font-semibold text-lg ml-2">{{ currency(itemsSubtotal) }}</span>
        </div>
      </div>

      <!-- ===== Voucher Section (mock) ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2 text-gray-700">
          <iconify-icon icon="material-symbols:confirmation-number-outline" width="22" height="22" class="text-primary"></iconify-icon>
          <span class="font-medium">Voucher của Shop</span>
        </div>
        <button class="text-sky-500 hover:text-sky-600 text-sm font-medium cursor-pointer" @click="onPickVoucher">
          {{ voucher ? `Đã chọn: ${voucher.title}` : 'Chọn Voucher' }}
        </button>
      </div>

      <!-- ===== Payment Method (mock) ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-4">
        <div class="flex items-center justify-between mb-3">
          <span class="font-medium text-gray-800">Phương thức thanh toán</span>
          <span class="text-sm text-gray-500">{{ paymentLabel }}</span>
        </div>
        <a-radio-group v-model:value="paymentMethod" class="!flex flex-wrap gap-3">
          <a-radio-button value="cod">Thanh toán khi nhận hàng</a-radio-button>
          <a-radio-button value="bank" disabled>Thẻ ATM / Internet Banking</a-radio-button>
          <a-radio-button value="momo" disabled>Ví MoMo</a-radio-button>
        </a-radio-group>
      </div>

      <!-- ===== Summary ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-5">
        <div class="ml-auto max-w-md space-y-2">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Tổng tiền hàng</span>
            <span>{{ currency(itemsSubtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{{ currency(shipping.fee) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>Voucher giảm giá</span>
            <span>- {{ currency(voucherDiscount) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-gray-100">
            <span class="text-sm text-gray-600">Tổng thanh toán</span>
            <span class="text-2xl font-bold text-primary">{{ currency(grandTotal) }}</span>
          </div>
        </div>

        <div class="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between gap-4 flex-wrap">
          <p class="text-xs text-gray-500 m-0 max-w-2xl">
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
            <a class="text-sky-500">Điều khoản GIADE</a>.
          </p>
          <a-button
              type="primary"
              size="large"
              class="!h-12 !px-12 !text-base !font-medium"
              :loading="placing"
              :disabled="!canPlaceOrder"
              @click="placeOrder"
          >
            Đặt hàng
          </a-button>
        </div>
      </div>
    </template>
  </a-spin>

  <!-- Address picker + form modals -->
  <AddressPickerModal
      ref="pickerRef"
      :open="pickerOpen"
      :current-id="address?.id ?? null"
      @close="pickerOpen = false"
      @add="openAddressForm()"
      @edit="openAddressForm($event)"
      @select="onAddressSelect"
  />
  <AddressFormModal
      :open="formOpen"
      :initial="editingAddress"
      @close="formOpen = false"
      @saved="onAddressSaved"
  />
  <ShippingMethodModal
      :open="shippingModalOpen"
      :methods="shippingOptions"
      :selected-index="shippingIdx"
      @close="shippingModalOpen = false"
      @select="onShippingSelect"
  />
  <VoucherModal
      :open="voucherModalOpen"
      :selected-id="voucher?.id ?? null"
      @close="voucherModalOpen = false"
      @select="onVoucherSelect"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useCartStore } from '@/stores/cartStore'
import { addressService, type UserAddress } from '@/services/user/addressService'
import { orderService } from '@/services/order/orderService'
import type { EnrichedCartItem } from '@/stores/cartStore'
import AddressPickerModal from './AddressPickerModal.vue'
import AddressFormModal from './AddressFormModal.vue'
import ShippingMethodModal, { type ShippingMethod } from './ShippingMethodModal.vue'
import VoucherModal, { type Voucher } from './VoucherModal.vue'
import { currency, getImageUrl, onImgError, formatPhone, parsePhoneToServer } from '@/helpers/format'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()

const loading = ref(true)
const placing = ref(false)

// ─── Items being checked out ───────────────────────────────────────────────
const items = computed<EnrichedCartItem[]>(() => checkoutStore.selectedItems)

const itemKey = (i: EnrichedCartItem) => `${i.product_id}-${i.product_variant_id}`

const unitPrice = (i: EnrichedCartItem) => i.product?.price_info?.current_price ?? 0

const variantLabel = (i: EnrichedCartItem): string => {
  const p = i.product
  if (!p?.tier_variants?.length) return 'Mặc định'
  const variant = p.product_variants?.find(v => v.id === i.product_variant_id)
  if (!variant?.tier_index?.length) return 'Mặc định'
  return variant.tier_index
    .map((optIdx, tierIdx) => p.tier_variants?.[tierIdx]?.options?.[optIdx - 1] ?? '')
    .filter(Boolean)
    .join(', ')
}

const totalQuantity = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
const itemsSubtotal = computed(() => items.value.reduce((s, i) => s + unitPrice(i) * i.quantity, 0))

// ─── Address ────────────────────────────────────────────────────────────────
const address = ref<UserAddress | null>(null)
const pickerOpen = ref(false)
const formOpen = ref(false)
const editingAddress = ref<UserAddress | null>(null)
const pickerRef = ref<InstanceType<typeof AddressPickerModal> | null>(null)

const openAddressPicker = () => { pickerOpen.value = true }
const openAddressForm = (addr?: UserAddress) => {
  editingAddress.value = addr ?? null
  formOpen.value = true
}

const onAddressSelect = (a: UserAddress) => {
  address.value = a
  pickerOpen.value = false
}
const onAddressSaved = async (a: UserAddress) => {
  formOpen.value = false
  if (a.is_default || !address.value) address.value = a
  else address.value = (await addressService.getDefault()) ?? a
  await pickerRef.value?.reload?.()
}

// ─── Shipping (mock — backed by ShippingMethodModal) ───────────────────────
const shippingOptions: ShippingMethod[] = [
  { label: 'Nhanh',     fee: 30000, eta: 'Nhận hàng trong 2-3 ngày', note: 'Nhận hàng trong 2-3 ngày' },
  { label: 'Trong Ngày', fee: 50000, eta: 'Nhận hàng trong ngày',    note: 'Dưới giới hạn kích thước tối thiểu' },
  { label: 'Hỏa Tốc',   fee: 0,     eta: 'Nằm ngoài khu vực hỗ trợ', note: 'Nằm ngoài khu vực hỗ trợ giao hàng', disabled: true },
  { label: 'Tiết Kiệm', fee: 18000, eta: 'Nhận hàng trong 4-6 ngày', note: 'Nhận hàng trong 4-6 ngày' },
]
const shippingIdx = ref(0)
const shipping = computed(() => shippingOptions[shippingIdx.value])
const shippingModalOpen = ref(false)
const onShippingSelect = (idx: number) => {
  shippingIdx.value = idx
  shippingModalOpen.value = false
}

// ─── Voucher (mock — backed by VoucherModal) ──────────────────────────────
const voucher = ref<Voucher | null>(null)
const voucherDiscount = computed(() => voucher.value?.discount ?? 0)
const voucherModalOpen = ref(false)
const onPickVoucher = () => { voucherModalOpen.value = true }
const onVoucherSelect = (v: Voucher | null) => {
  voucher.value = v
  voucherModalOpen.value = false
  if (v) message.success(`Đã áp dụng voucher: ${v.title}`)
  else message.info('Đã bỏ voucher')
}

// ─── Payment (mock) ─────────────────────────────────────────────────────────
const paymentMethod = ref<'cod' | 'bank' | 'momo'>('cod')
const paymentLabel = computed(() =>
  paymentMethod.value === 'cod' ? 'Thanh toán khi nhận hàng' : paymentMethod.value
)

// ─── Total ──────────────────────────────────────────────────────────────────
const grandTotal = computed(() =>
  Math.max(0, itemsSubtotal.value + shipping.value.fee - voucherDiscount.value)
)

const canPlaceOrder = computed(() => !!address.value && items.value.length > 0 && !placing.value)

// ─── Place order ────────────────────────────────────────────────────────────
const placeOrder = async () => {
  if (!address.value) {
    message.warning('Vui lòng thêm địa chỉ nhận hàng')
    return
  }
  Modal.confirm({
    title: 'Xác nhận đặt hàng?',
    content: `Tổng thanh toán: ${currency(grandTotal.value)}`,
    okText: 'Đặt hàng',
    cancelText: 'Hủy',
    centered: true,
    onOk: doPlaceOrder,
  })
}

const doPlaceOrder = async () => {
  if (!address.value) return
  placing.value = true
  try {
    const phoneNumber = parsePhoneToServer(address.value.phone_number)
    const order = await orderService.createOrder(
      {
        items: items.value.map(i => ({
          product_variant_id: i.product_variant_id,
          quantity: i.quantity,
        })),
        note: note.value || undefined,
        address: address.value.address,
        city: address.value.city,
        district: address.value.district,
        phone_number: phoneNumber,
        is_from_cart: true,
      },
      {
        items: items.value.map(i => ({
          product_id: i.product_id,
          product_variant_id: i.product_variant_id,
          quantity: i.quantity,
          image: i.image,
          product: i.product,
          unit_price: unitPrice(i),
        })),
        totals: {
          items_subtotal: itemsSubtotal.value,
          shipping_fee: shipping.value.fee,
          voucher_discount: voucherDiscount.value,
          grand_total: grandTotal.value,
        },
        shipping_address: {
          full_name: address.value.full_name,
          phone_number: address.value.phone_number,
          address: address.value.address,
          district: address.value.district,
          city: address.value.city,
        },
        shipping_method: {
          label: shipping.value.label,
          fee: shipping.value.fee,
          eta: shipping.value.eta,
        },
        payment_method: paymentMethod.value,
        voucher_code: voucher.value?.id,
      },
    )
    message.success('Đặt hàng thành công!')
    checkoutStore.clear()
    cartStore.loadCart(true)
    router.push(`/order/success/${order?.id ?? ''}`)
  } catch {
    message.error('Đặt hàng thất bại, vui lòng thử lại')
  } finally {
    placing.value = false
  }
}

// ─── Misc ──────────────────────────────────────────────────────────────────
const note = ref('')


// ─── Init ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    address.value = await addressService.getDefault()
    if (items.value.length === 0) {
      // user navigated directly to /checkout — bounce back to cart
      message.info('Vui lòng chọn sản phẩm từ giỏ hàng')
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.checkout-row-header,
.checkout-row {
  display: grid;
  grid-template-columns: 1fr 160px 120px 160px;
  gap: 12px;
}

/* Striped top decoration (Shopee-style) */
.checkout-stripe {
  height: 4px;
  background: repeating-linear-gradient(
      45deg,
      var(--color-primary) 0,
      var(--color-primary) 20px,
      transparent 20px,
      transparent 30px,
      var(--color-primary-light) 30px,
      var(--color-primary-light) 50px,
      transparent 50px,
      transparent 60px
  );
}

@media (max-width: 768px) {
  .checkout-row-header { display: none; }
  .checkout-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
