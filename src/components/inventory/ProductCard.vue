<template>
  <div
      class="group bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden border border-transparent hover:border-primary/10"
      @click="$emit('click', product)"
  >
    <!-- Ảnh sản phẩm -->
    <div class="relative overflow-hidden bg-gray-50">
      <img
          class="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          :src="getImageUrl(product.images?.[0]?.url) || '/placeholder.png'"
          :alt="product.name"
      />
      <!-- Badge giảm giá nếu có -->
      <div
          v-if="discountPct > 0"
          class="absolute top-1.5 left-0 bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 leading-tight"
      >
        -{{ discountPct }}%
      </div>
    </div>

    <!-- Thông tin sản phẩm -->
    <div class="p-2.5">
      <h3 class="text-[13px] leading-[1.4] text-gray-800 line-clamp-2 min-h-[36px]" :title="product.name">
        {{ product.name }}
      </h3>

      <!-- Giá -->
      <div class="mt-2 flex items-baseline gap-1.5 flex-wrap">
        <span class="text-primary font-semibold text-[15px]">
          {{ currency(product.price_info.current_price) }}
        </span>
        <span
            v-if="product.price_info.original_price && product.price_info.original_price > product.price_info.current_price"
            class="text-gray-400 text-xs line-through"
        >
          {{ currency(product.price_info.original_price) }}
        </span>
      </div>

      <!-- Đánh giá + Đã bán -->
      <div class="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
        <div class="flex items-center gap-0.5">
          <iconify-icon icon="material-symbols:star" width="12" height="12" class="text-yellow-400"></iconify-icon>
          <span>4.8</span>
        </div>
        <span>Đã bán {{ formatSold(product.total_sold) }}</span>
      </div>

      <!-- Địa điểm -->
      <div class="mt-1 text-[11px] text-gray-400 truncate">TP. Hồ Chí Minh</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Product } from "@/services/product/productService"

const props = defineProps<{ product: Product }>()

const discountPct = computed(() => {
  const { current_price, original_price } = props.product.price_info
  if (!original_price || original_price <= current_price) return 0
  return Math.round((1 - current_price / original_price) * 100)
})

const currency = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

const formatSold = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return n.toLocaleString('vi-VN')
}

const getImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}`
</script>

