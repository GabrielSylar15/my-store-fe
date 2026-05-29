<template>
  <a-spin :spinning="loading" tip="Đang tải...">
    <div v-if="!loading && !order" class="bg-white rounded shadow py-24 text-center">
      <iconify-icon icon="material-symbols:search-off" width="80" height="80" class="text-gray-300"></iconify-icon>
      <p class="text-gray-400 mt-4">Không tìm thấy đơn hàng</p>
      <a-button type="primary" class="mt-4" @click="router.push('/user/orders')">Xem Đơn Hàng</a-button>
    </div>

    <template v-else-if="order">
      <!-- ===== Success banner ===== -->
      <div class="bg-white rounded shadow px-6 py-10 text-center mb-3">
        <iconify-icon
            icon="material-symbols:check-circle"
            width="80"
            height="80"
            class="text-green-500"
        ></iconify-icon>
        <h2 class="text-2xl font-medium text-gray-800 mt-3 mb-1">Đặt hàng thành công!</h2>
        <p class="text-gray-500 m-0">
          Cảm ơn bạn đã mua hàng tại GIADE. Đơn hàng <span class="text-primary font-medium">#{{ order.code }}</span> đang được xử lý.
        </p>

        <div class="flex justify-center gap-3 mt-6 flex-wrap">
          <a-button size="large" @click="router.push('/')">Tiếp Tục Mua Sắm</a-button>
          <a-button size="large" type="primary" @click="router.push(`/user/orders/${order.id}`)">
            Xem Chi Tiết Đơn Hàng
          </a-button>
        </div>
      </div>

      <!-- ===== Order summary ===== -->
      <div class="bg-white rounded shadow mb-3">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base font-medium text-gray-800 m-0">Thông tin đơn hàng</h3>
          <span class="text-xs text-gray-500">{{ formatDateTime(order.created_at) }}</span>
        </div>

        <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Shipping -->
          <div>
            <p class="text-sm text-gray-500 mb-1 m-0">Địa chỉ nhận hàng</p>
            <p class="text-sm text-gray-800 font-medium m-0">
              {{ order.shipping_address.full_name }} ({{ order.shipping_address.phone_number }})
            </p>
            <p class="text-sm text-gray-600 mt-1 m-0">
              {{ order.shipping_address.address }}, {{ order.shipping_address.district }}, {{ order.shipping_address.city }}
            </p>
          </div>
          <!-- Payment + shipping method -->
          <div>
            <p class="text-sm text-gray-500 mb-1 m-0">Phương thức thanh toán</p>
            <p class="text-sm text-gray-800 m-0">{{ PAYMENT_LABEL[order.payment_method] }}</p>
            <p class="text-sm text-gray-500 mt-3 mb-1 m-0">Phương thức vận chuyển</p>
            <p class="text-sm text-gray-800 m-0">{{ order.shipping_method.label }} — {{ order.shipping_method.eta }}</p>
          </div>
        </div>

        <!-- Items -->
        <div class="border-t border-gray-100">
          <div
              v-for="item in order.items"
              :key="`${item.product_id}-${item.product_variant_id}`"
              class="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0"
          >
            <img
                :src="getImageUrl(item.image)"
                class="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                @error="onImgError"
                alt=""
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 line-clamp-2 m-0">{{ item.product?.name || `Sản phẩm #${item.product_id}` }}</p>
              <p class="text-xs text-gray-500 mt-1 m-0">Phân loại: {{ variantLabel(item) }}</p>
              <p class="text-xs text-gray-500 mt-1 m-0">x{{ item.quantity }}</p>
            </div>
            <div class="text-primary font-medium text-sm flex-shrink-0">
              {{ currency(item.unit_price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="px-6 py-4 border-t border-dashed border-gray-200">
          <div class="ml-auto max-w-sm space-y-1">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Tổng tiền hàng</span><span>{{ currency(order.totals.items_subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Phí vận chuyển</span><span>{{ currency(order.totals.shipping_fee) }}</span>
            </div>
            <div v-if="order.totals.voucher_discount" class="flex justify-between text-sm text-gray-600">
              <span>Voucher giảm giá</span><span>- {{ currency(order.totals.voucher_discount) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
              <span class="text-sm text-gray-600">Tổng thanh toán</span>
              <span class="text-2xl font-bold text-primary">{{ currency(order.totals.grand_total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService, type Order } from '@/services/order/orderService'
import { currency, getImageUrl, onImgError, variantLabel, formatDateTime, PAYMENT_LABEL } from './orderHelpers'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const order = ref<Order | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    order.value = await orderService.getById(id)
  }
  loading.value = false
})
</script>
