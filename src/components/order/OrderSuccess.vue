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
          Cảm ơn bạn đã mua hàng tại GIADE. Đơn hàng <span class="text-primary font-medium">#{{ order.alias }}</span> đang được xử lý.
        </p>

        <div class="flex justify-center gap-3 mt-6 flex-wrap">
          <a-button size="large" @click="router.push('/')">Tiếp Tục Mua Sắm</a-button>
          <a-button size="large" type="primary" @click="router.push(`/user/orders/${order.alias}`)">
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

        <div class="px-6 py-4">
          <p class="text-sm text-gray-500 mb-1 m-0">Địa chỉ nhận hàng</p>
          <p class="text-sm text-gray-800 font-medium m-0">{{ formatPhone(order.phone_number) }}</p>
          <p class="text-sm text-gray-600 mt-1 m-0">
            {{ order.address }}, {{ order.district }}, {{ order.city }}
          </p>
          <p v-if="order.note" class="text-sm text-gray-500 mt-2 m-0">Ghi chú: {{ order.note }}</p>
        </div>

        <!-- Items -->
        <div class="border-t border-gray-100">
          <div
              v-for="item in order.items"
              :key="item.product_variant_id"
              class="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0"
          >
            <img
                v-if="item.image"
                :src="getImageUrl(item.image)"
                class="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                @error="onImgError"
                alt=""
            />
            <div v-else class="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center">
              <iconify-icon icon="material-symbols:image-not-supported-outline" width="24" height="24" class="text-gray-300"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 line-clamp-2 m-0">{{ item.product_name || `Sản phẩm #${item.product_variant_id}` }}</p>
              <p class="text-xs text-gray-500 mt-1 m-0">
                Phân loại: {{ item.variants?.length ? item.variants.map(v => v.value).join(', ') : 'Mặc định' }}
              </p>
              <p class="text-xs text-gray-500 mt-1 m-0">x{{ item.quantity }}</p>
            </div>
            <div v-if="item.current_price" class="text-primary font-medium text-sm flex-shrink-0">
              {{ currency(item.current_price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="px-6 py-4 border-t border-dashed border-gray-200">
          <div class="ml-auto max-w-sm space-y-1">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Tổng tiền hàng</span><span>{{ currency(order.total_price) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
              <span class="text-sm text-gray-600">Tổng thanh toán</span>
              <span class="text-2xl font-bold text-primary">{{ currency(order.total_bill) }}</span>
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
import { orderService, type OrderApiDetail } from '@/services/order/orderService'
import { currency, getImageUrl, onImgError, formatDateTime, formatPhone } from '@/helpers/format'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const order = ref<OrderApiDetail | null>(null)

onMounted(async () => {
  const alias = route.params.alias as string
  if (alias) {
    order.value = await orderService.getByAlias(alias)
  }
  loading.value = false
})
</script>
