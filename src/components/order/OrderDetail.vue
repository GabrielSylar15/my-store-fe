<template>
  <a-spin :spinning="loading" tip="Đang tải...">
    <div v-if="!loading && !order" class="bg-white rounded shadow py-24 text-center">
      <iconify-icon icon="material-symbols:search-off" width="80" height="80" class="text-gray-300"></iconify-icon>
      <p class="text-gray-400 mt-4">Không tìm thấy đơn hàng</p>
      <a-button type="primary" class="mt-4" @click="router.push('/user/orders')">Quay Lại Đơn Mua</a-button>
    </div>

    <template v-else-if="order">
      <!-- Back + order code + status -->
      <div class="mb-3 flex items-center justify-between flex-wrap gap-2">
        <button
            class="text-sm text-gray-600 hover:text-primary flex items-center gap-1 cursor-pointer"
            @click="router.push('/user/orders')"
        >
          <iconify-icon icon="material-symbols:arrow-back" width="16" height="16"></iconify-icon>
          Trở Lại
        </button>
        <div class="text-sm text-gray-500">
          MÃ ĐƠN HÀNG <span class="font-medium text-gray-800">{{ order.alias }}</span>
          <span class="ml-3">|</span>
          <span class="ml-3 font-medium uppercase" :style="{ color: ORDER_API_STATUS_COLOR[order.status] }">
            {{ ORDER_API_STATUS_LABEL[order.status] }}
          </span>
        </div>
      </div>

      <!-- ===== Status timeline ===== -->
      <div class="bg-white rounded shadow mb-3 px-8 py-8">
        <div class="flex items-start justify-between">
          <div
              v-for="(step, idx) in timeline"
              :key="step.key"
              class="flex-1 flex flex-col items-center text-center relative"
          >
            <!-- Circle -->
            <div
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 z-10 relative"
                :class="step.isFinal && step.reached
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.reached
                    ? 'bg-white border-green-500 text-green-500'
                    : 'bg-white border-gray-300 text-gray-300'"
            >
              <iconify-icon :icon="step.icon" width="22" height="22"></iconify-icon>
            </div>
            <!-- Label -->
            <p class="text-xs font-medium m-0 leading-tight"
               :class="step.reached ? 'text-gray-800' : 'text-gray-400'">
              {{ step.label }}
            </p>
            <!-- Timestamp -->
            <p v-if="step.reached && step.at" class="text-[10px] text-gray-400 mt-0.5 m-0">
              {{ step.at }}
            </p>
            <!-- Connector line — sits at circle vertical center (top-6 = half of h-12) -->
            <div
                v-if="idx < timeline.length - 1"
                class="absolute top-6 left-1/2 w-full h-0.5 z-0"
                :class="timeline[idx + 1].reached ? 'bg-green-500' : 'bg-gray-200'"
            ></div>
          </div>
        </div>
      </div>

      <!-- ===== Actions (two-column: text left, stacked buttons right) ===== -->
      <div class="bg-white rounded shadow mb-3">
        <!-- Review row — only when COMPLETED -->
        <div v-if="order.status === 'COMPLETED'"
             class="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <p class="text-sm text-gray-700 m-0">
            Đánh giá sản phẩm trước ngày
            <span class="underline text-gray-800 font-medium">{{ reviewDeadline }}</span>
            để nhận 200 điểm thưởng!
          </p>
          <a-button type="primary" class="!min-w-[220px] !h-10" @click="onReview">Đánh Giá</a-button>
        </div>

        <!-- Liên hệ người bán row -->
        <div v-if="order.status === 'COMPLETED'"
             class="flex items-center justify-end px-6 py-3 border-b border-gray-100">
          <a-button class="!min-w-[220px] !h-10" @click="onContactSeller">Liên Hệ Người Bán</a-button>
        </div>

        <!-- Mua lại row -->
        <div class="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100">
          <span></span>
          <div class="flex gap-2">
            <a-button v-if="canCancel" danger @click="onCancel">Hủy đơn</a-button>
            <a-button v-if="canConfirmReceived" type="primary" @click="onConfirmReceived">Đã nhận hàng</a-button>
            <a-button class="!min-w-[220px] !h-10" @click="onBuyAgain">Mua Lại</a-button>
          </div>
        </div>

        <!-- Invoice row -->
        <div class="flex items-center justify-between gap-4 px-6 py-4">
          <div class="flex items-center gap-1 text-sm text-gray-500">
            <span>Hóa đơn điện tử</span>
            <iconify-icon icon="material-symbols:help-outline" width="14" height="14"></iconify-icon>
          </div>
          <a-button class="!min-w-[220px] !h-10" @click="onRequestInvoice">Yêu Cầu Hóa Đơn Điện Tử</a-button>
        </div>

        <!-- Dashed colorful divider -->
        <div class="h-1.5 w-full" style="background: repeating-linear-gradient(90deg, var(--color-primary) 0px, var(--color-primary) 20px, transparent 20px, transparent 24px, var(--color-primary-light) 24px, var(--color-primary-light) 44px, transparent 44px, transparent 48px)"></div>
      </div>

      <!-- ===== Address ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-5">
        <div class="flex items-center gap-2 text-primary font-medium mb-3">
          <iconify-icon icon="material-symbols:location-on" width="20" height="20"></iconify-icon>
          <span>Địa Chỉ Nhận Hàng</span>
        </div>
        <p class="text-sm font-medium text-gray-800 m-0">{{ formatPhone(order.phone_number) }}</p>
        <p class="text-sm text-gray-600 mt-1 m-0">
          {{ order.address }}, {{ order.district }}, {{ order.city }}
        </p>
        <p v-if="order.note" class="text-sm text-gray-500 mt-2 m-0 italic">
          Lời nhắn: {{ order.note }}
        </p>
      </div>

      <!-- ===== Items ===== -->
      <div class="bg-white rounded shadow mb-3">
        <div class="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
          <span class="text-xs font-medium bg-primary text-white px-1.5 py-0.5 rounded">Mall</span>
          <span class="text-sm font-medium text-gray-800">GIADE Official Store</span>
        </div>

        <div
            v-for="item in order.items"
            :key="item.product_variant_id"
            class="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0"
        >
          <img
              :src="getImageUrl(item.image)"
              class="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
              @error="onImgError"
              alt=""
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-800 line-clamp-2 m-0">{{ item.product_name }}</p>
            <p v-if="item.variants.length" class="text-xs text-gray-500 mt-1 m-0">
              Phân loại: {{ item.variants.map(v => `${v.name}: ${v.value}`).join(', ') }}
            </p>
            <p class="text-xs text-gray-500 mt-1 m-0">x{{ item.quantity }}</p>
          </div>
          <div class="text-primary font-medium text-sm flex-shrink-0">
            {{ currency(item.current_price * item.quantity) }}
          </div>
        </div>
      </div>

      <!-- ===== Totals ===== -->
      <div class="bg-white rounded shadow mb-3 px-6 py-4">
        <div class="ml-auto max-w-sm space-y-1">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Tổng tiền hàng</span>
            <span>{{ currency(itemsSubtotal) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-gray-100">
            <span class="text-sm text-gray-600">Thành tiền</span>
            <span class="text-2xl font-bold text-primary">{{ currency(itemsSubtotal) }}</span>
          </div>
        </div>
      </div>

    </template>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  orderService,
  type OrderApiDetail,
  ORDER_API_STATUS_LABEL,
  ORDER_API_STATUS_COLOR,
} from '@/services/order/orderService'
import { currency, getImageUrl, onImgError } from './orderHelpers'
import { formatPhone } from '@/helpers/format'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const order = ref<OrderApiDetail | null>(null)

const statusRank: Record<string, number> = {
  ORDERED: 0, CONFIRMED: 1, SHIPPING: 2, DELIVERED: 3, COMPLETED: 4, CANCELLED: -1,
}

const timelineSteps = [
  { key: 'ORDERED',   label: 'Đơn Hàng Đã Đặt',       icon: 'material-symbols:list-alt-outline',    isFinal: false },
  { key: 'CONFIRMED', label: 'Đơn Hàng Đã Thanh Toán', icon: 'material-symbols:payments-outline',    isFinal: false },
  { key: 'SHIPPING',  label: 'Đã Giao Cho ĐVVC',       icon: 'mdi:truck-delivery-outline',           isFinal: false },
  { key: 'DELIVERED', label: 'Đã Nhận Được Hàng',      icon: 'material-symbols:inventory-2-outline', isFinal: false },
  { key: 'COMPLETED', label: 'Đánh Giá',               icon: 'material-symbols:star-outline',        isFinal: true  },
]

const timeline = computed(() => {
  if (!order.value) return []
  if (order.value.status === 'CANCELLED') {
    return [
      { key: 'ORDERED',   label: 'Đơn Hàng Đã Đặt', icon: 'material-symbols:list-alt-outline', isFinal: false, reached: true },
      { key: 'CANCELLED', label: 'Đã Hủy',           icon: 'material-symbols:cancel-outline',   isFinal: true,  reached: true },
    ]
  }
  const currentRank = statusRank[order.value.status] ?? 0
  return timelineSteps.map(s => ({ ...s, reached: statusRank[s.key] <= currentRank }))
})

const itemsSubtotal = computed(() =>
  (order.value?.items ?? []).reduce((sum, i) => sum + i.current_price * i.quantity, 0)
)

const canCancel = computed(
  () => order.value?.status === 'ORDERED' || order.value?.status === 'CONFIRMED'
)
const canConfirmReceived = computed(() => order.value?.status === 'DELIVERED')

const reviewDeadline = computed(() => {
  if (!order.value?.created_at) return ''
  const d = new Date(order.value.created_at)
  d.setDate(d.getDate() + 10)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
})

const load = async () => {
  loading.value = true
  const alias = route.params.alias as string
  if (alias) order.value = await orderService.getByAlias(alias)
  loading.value = false
}

const onCancel = () => {
  Modal.confirm({
    title: 'Xác nhận hủy đơn?',
    content: 'Đơn hàng sau khi hủy sẽ không thể khôi phục.',
    okText: 'Hủy đơn', okType: 'danger', cancelText: 'Quay lại', centered: true,
    onOk: () => { message.info('Tính năng đang được phát triển') },
  })
}

const onConfirmReceived = () => { message.info('Tính năng đang được phát triển') }
const onReview         = () => { message.info('Tính năng đang được phát triển') }
const onContactSeller  = () => { message.info('Tính năng đang được phát triển') }
const onBuyAgain       = () => { message.info('Tính năng đang được phát triển') }
const onRequestInvoice = () => { message.info('Tính năng đang được phát triển') }

onMounted(load)
</script>
