<template>
  <div>
    <!-- ===== Tab strip ===== -->
    <div class="bg-white rounded shadow mb-3 sticky top-[140px] z-10">
      <div class="tab-strip">
        <button
            v-for="t in tabs"
            :key="t.key"
            class="tab-item"
            :class="{ active: activeTab === t.key }"
            @click="switchTab(t.key)"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- ===== Search bar ===== -->
    <div class="search-bar mb-3">
      <iconify-icon icon="material-symbols-light:search-rounded" width="22" height="22" class="text-gray-400 flex-shrink-0"></iconify-icon>
      <input
          v-model="searchText"
          type="text"
          class="flex-1 focus:outline-none text-sm bg-transparent"
          placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc Tên Sản phẩm"
      />
      <button
          v-if="searchText"
          class="text-gray-400 hover:text-primary cursor-pointer"
          @click="searchText = ''"
      >
        <iconify-icon icon="material-symbols:close" width="18" height="18"></iconify-icon>
      </button>
    </div>

    <a-spin :spinning="loading" tip="Đang tải...">
      <!-- ===== Empty state ===== -->
      <div v-if="!loading && filtered.length === 0" class="empty-state">
        <iconify-icon icon="bx:package" width="120" height="120" class="text-gray-200"></iconify-icon>
        <p class="text-gray-500 mt-4 mb-0 text-base">Chưa có đơn hàng</p>
        <p class="text-gray-400 mt-1 mb-4 text-sm">Hãy bắt đầu mua sắm để có đơn hàng đầu tiên của bạn nhé!</p>
        <a-button type="primary" size="large" class="!px-10" @click="router.push('/product')">Mua Sắm Ngay</a-button>
      </div>

      <!-- ===== Order cards ===== -->
      <div v-for="o in filtered" :key="o.id" class="order-card mb-3">
        <!-- Header -->
        <div class="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium bg-primary text-white px-1.5 py-0.5 rounded">Mall</span>
            <span class="text-sm font-medium text-gray-800">GIADE Official Store</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <iconify-icon icon="material-symbols:local-shipping-outline" width="14" height="14" class="text-gray-400"></iconify-icon>
            <span class="text-gray-400 text-xs">{{ ORDER_API_STATUS_LABEL[o.status] }}</span>
            <span class="text-gray-300 text-xs">|</span>
            <span class="font-medium uppercase text-xs tracking-wide" :style="{ color: ORDER_API_STATUS_COLOR[o.status] }">
              {{ ORDER_API_STATUS_LABEL[o.status] }}
            </span>
          </div>
        </div>

        <!-- Items -->
        <div
            v-for="item in o.items"
            :key="item.product_variant_id"
            class="flex items-center gap-4 px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-[#fafafa] transition"
            @click="router.push(`/user/orders/${o.alias}`)"
        >
          <img
              :src="getImageUrl(item.image)"
              class="w-20 h-20 object-cover rounded border border-gray-200 flex-shrink-0"
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
          <div class="text-right flex-shrink-0">
            <p v-if="item.original_price && item.original_price !== item.current_price"
               class="text-xs text-gray-400 line-through m-0">
              {{ currency(item.original_price) }}
            </p>
            <p class="text-sm text-primary font-medium m-0">{{ currency(item.current_price) }}</p>
          </div>
        </div>

        <!-- Total -->
        <div class="flex items-center justify-end gap-2 px-6 py-3 border-b border-dashed border-gray-200 text-sm">
          <span class="text-gray-600">Thành tiền:</span>
          <span class="text-primary text-xl font-semibold">{{ currency(o.total_bill) }}</span>
        </div>

        <!-- Actions footer -->
        <div class="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <!-- Left: review hint for COMPLETED -->
          <div v-if="o.status === 'COMPLETED'" class="text-xs text-gray-500 leading-relaxed">
            <p class="m-0">Đánh giá sản phẩm trước <span class="underline">{{ reviewDeadline(o.created_at) }}</span></p>
            <p class="m-0 text-primary">Đánh giá ngay và nhận 200 Xu</p>
          </div>
          <div v-else class="flex-1">
            <span class="text-xs text-gray-400">{{ formatDateTime(o.created_at) }}</span>
          </div>

          <!-- Right: action buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <a-button
                v-if="o.status === 'ORDERED' || o.status === 'CONFIRMED'"
                danger
                size="small"
                @click.stop="onCancel(o)"
            >Hủy Đơn</a-button>
            <a-button
                v-if="o.status === 'DELIVERED'"
                type="primary"
                size="small"
                @click.stop="onConfirmReceived(o)"
            >Đã Nhận Hàng</a-button>
            <a-button
                v-if="o.status === 'COMPLETED'"
                type="primary"
                @click.stop="onReview"
            >Đánh Giá</a-button>
            <a-button @click.stop="onContactSeller">Liên Hệ Người Bán</a-button>
            <a-button @click.stop="onBuyAgain">Mua Lại</a-button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div v-if="!loading && hasMore" class="text-center py-4">
        <a-button :loading="loadingMore" @click="loadMore">Xem thêm</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  orderService,
  type OrderApiListItem,
  type OrderApiStatus,
  ORDER_API_STATUS_LABEL,
  ORDER_API_STATUS_COLOR,
} from '@/services/order/orderService'
import { currency, getImageUrl, onImgError, formatDateTime } from '@/helpers/format'

const router = useRouter()

type TabKey = 'ALL' | OrderApiStatus
const tabs: { key: TabKey; label: string }[] = [
  { key: 'ALL',       label: 'Tất cả' },
  { key: 'ORDERED',   label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Chờ lấy hàng' },
  { key: 'SHIPPING',  label: 'Đang giao' },
  { key: 'DELIVERED', label: 'Đã giao' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
]
const activeTab = ref<TabKey>('ALL')

const loading = ref(false)
const loadingMore = ref(false)
const orders = ref<OrderApiListItem[]>([])
const hasMore = ref(false)
const searchText = ref('')

const filtered = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return orders.value
  return orders.value.filter(o =>
    o.alias.toLowerCase().includes(q) ||
    o.items.some(i => i.product_name.toLowerCase().includes(q))
  )
})

const reviewDeadline = (createdAt: string): string => {
  const d = new Date(createdAt)
  d.setDate(d.getDate() + 10)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}

const load = async () => {
  loading.value = true
  const status = activeTab.value === 'ALL' ? undefined : activeTab.value as OrderApiStatus
  const data = await orderService.listOrders(status)
  orders.value = data
  hasMore.value = data.length >= 20
  loading.value = false
}

const loadMore = async () => {
  if (!orders.value.length) return
  loadingMore.value = true
  const lastId = orders.value[orders.value.length - 1].id
  const status = activeTab.value === 'ALL' ? undefined : activeTab.value as OrderApiStatus
  const data = await orderService.listOrders(status, lastId)
  orders.value.push(...data)
  hasMore.value = data.length >= 20
  loadingMore.value = false
}

const switchTab = async (key: TabKey) => {
  if (activeTab.value === key) return
  activeTab.value = key
  searchText.value = ''
  await load()
}

const onCancel = (o: OrderApiListItem) => {
  Modal.confirm({
    title: 'Xác nhận hủy đơn?',
    content: 'Đơn hàng sau khi hủy sẽ không thể khôi phục.',
    okText: 'Hủy đơn', okType: 'danger', cancelText: 'Quay lại', centered: true,
    onOk: () => { message.info('Tính năng đang được phát triển') },
  })
}

const onConfirmReceived = (_o: OrderApiListItem) => {
  message.info('Tính năng đang được phát triển')
}

const onReview         = () => { message.info('Tính năng đang được phát triển') }
const onContactSeller  = () => { message.info('Tính năng đang được phát triển') }
const onBuyAgain       = () => { message.info('Tính năng đang được phát triển') }

load()
</script>

<style scoped>
.tab-strip {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.tab-item {
  background: transparent;
  border: 0;
  padding: 14px 8px;
  font-size: 13px;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color .15s, border-color .15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.tab-item:hover { color: #1f2937; }
.tab-item.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 500;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #eaeaea;
  border-radius: 4px;
  padding: 10px 14px;
}
.search-bar input::placeholder { color: #9ca3af; }

.order-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.empty-state {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@media (max-width: 900px) {
  .tab-strip { grid-template-columns: repeat(4, 1fr); }
}
</style>
