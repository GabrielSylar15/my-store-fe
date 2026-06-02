<template>
  <a-modal
    v-model:open="visible"
    :footer="null"
    width="640px"
    centered
    :destroy-on-close="true"
    @cancel="close"
  >
    <template #title>
      <span class="text-base font-semibold">Đánh Giá Sản Phẩm</span>
    </template>

    <!-- Tip banner -->
    <div class="tip-banner">
      <iconify-icon icon="material-symbols:monetization-on-rounded" width="18" height="18" class="coin-icon"></iconify-icon>
      <span class="flex-1 text-sm">
        Đánh giá chuẩn để nhận đến <span class="text-amber-500 font-semibold">200 xu!</span>
      </span>
    </div>

    <!-- Loading reviewed status -->
    <div v-if="loadingReviewed" class="py-10 flex justify-center">
      <a-spin tip="Đang tải..." />
    </div>

    <!-- Product list -->
    <div v-else class="product-list">
      <div
        v-for="item in reviewItems"
        :key="item.product_id"
        class="product-card"
        :class="item.reviewed ? 'reviewed' : 'pending'"
      >
        <!-- Product info row -->
        <div class="flex items-start gap-3">
          <img
            :src="getImageUrl(item.image)"
            class="w-14 h-14 object-cover rounded border border-gray-200 flex-shrink-0"
            @error="onImgError"
            alt=""
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 line-clamp-2 m-0">{{ item.product_name }}</p>
            <p v-if="item.variantLabel" class="text-xs text-gray-400 mt-0.5 m-0">{{ item.variantLabel }}</p>
          </div>
          <!-- Already reviewed badge -->
          <div v-if="item.reviewed" class="flex items-center gap-1 text-green-600 text-xs font-medium flex-shrink-0 mt-0.5">
            <iconify-icon icon="material-symbols:check-circle-rounded" width="16" height="16"></iconify-icon>
            Đã đánh giá
          </div>
        </div>

        <!-- Review form — only for unreviewed -->
        <template v-if="!item.reviewed">
          <!-- Stars -->
          <div class="flex items-center gap-2 mt-4">
            <span class="text-sm text-gray-600 whitespace-nowrap">Chất lượng</span>
            <a-rate v-model:value="item.star" class="!text-amber-400" />
            <span class="text-amber-500 text-sm font-medium">{{ STAR_LABELS[(item.star || 1) - 1] }}</span>
          </div>

          <!-- Comment -->
          <a-textarea
            v-model:value="item.comment"
            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
            :rows="3"
            :maxlength="500"
            class="!rounded mt-3"
          />

          <!-- Count + submit on same row, both flush with textarea edges -->
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-gray-400">{{ item.comment.length }} / 500</span>
            <a-button
              type="primary"
              :loading="item.submitting"
              :disabled="item.star === 0"
              @click="submit(item)"
            >Gửi đánh giá</a-button>
          </div>
        </template>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-end mt-5 pt-4 border-t border-gray-100">
      <a-button size="large" class="!px-10" @click="close">Đóng</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { OrderApiDetail } from '@/services/order/orderService'
import { reviewService } from '@/services/product/reviewService'
import { getImageUrl, onImgError } from '@/helpers/format'

const STAR_LABELS = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời']

const props = defineProps<{ order: OrderApiDetail | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'done'): void }>()

const visible = ref(false)
const loadingReviewed = ref(false)

interface ReviewItem {
  product_id: number
  product_variant_id: number
  product_name: string
  image: string
  variantLabel: string
  star: number
  comment: string
  reviewed: boolean
  submitting: boolean
}

const reviewItems = ref<ReviewItem[]>([])

watch(
  () => props.order,
  async (o) => {
    if (!o) return

    const seen = new Set<number>()
    reviewItems.value = o.items
      .filter(item => {
        if (seen.has(item.product_id)) return false
        seen.add(item.product_id)
        return true
      })
      .map(item => ({
        product_id: item.product_id,
        product_variant_id: item.product_variant_id,
        product_name: item.product_name,
        image: item.image,
        variantLabel: item.variants.map(v => v.value).join(', '),
        star: 5,
        comment: '',
        reviewed: false,
        submitting: false,
      }))

    visible.value = true
    loadingReviewed.value = true

    try {
      const reviewed = await reviewService.reviewedInOrder(o.alias)
      const reviewedIds = new Set(reviewed.map(r => r.product_id))
      reviewItems.value.forEach(item => {
        item.reviewed = reviewedIds.has(item.product_id)
      })
    } finally {
      loadingReviewed.value = false
    }
  }
)

const close = () => {
  visible.value = false
  emit('close')
}

const submit = async (item: ReviewItem) => {
  if (!props.order) return
  item.submitting = true
  try {
    await reviewService.create({
      product_id: item.product_id,
      product_variant_id: item.product_variant_id,
      order_id: props.order.id,
      star_rating: item.star,
      comment: item.comment,
    })
    item.reviewed = true
    message.success('Đánh giá đã được gửi!')
    if (reviewItems.value.every(i => i.reviewed)) {
      emit('done')
    }
  } catch (err: any) {
    message.error(err?.message ?? 'Gửi đánh giá thất bại')
  } finally {
    item.submitting = false
  }
}
</script>

<style scoped>
.tip-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 16px;
}
.coin-icon { color: #f59e0b; flex-shrink: 0; }

.product-list {
  max-height: 65vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 2px;
}
.product-card {
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}
.product-card.pending {
  background: #fff;
}
.product-card.reviewed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

</style>
