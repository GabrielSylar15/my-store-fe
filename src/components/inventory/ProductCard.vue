<template>
  <div
      class="group bg-white hover:shadow-md transition cursor-pointer overflow-hidden"
      @click="$emit('click', product)"
  >
    <div class="relative">
      <img
          class="w-full aspect-square object-cover"
          :src="getImageUrl(product.images?.[0]?.url) || '/placeholder.png'"
          alt="thumb"
      />

    </div>

    <!-- Nội dung -->
    <div class="p-3">
      <div class="min-h-[44px]">
        <h3 class="text-sm text-gray-800 line-clamp-2" :title="product.name">
          {{ product.name }}
        </h3>
      </div>

      <!-- Giá -->
      <div class="mt-2 flex items-baseline gap-2">
        <div class="text-red-600 font-semibold">{{ currency(product.price_info.current_price) }}</div>
        <div
            v-if="product.price_info.current_price"
            class="text-gray-400 line-through text-xs"
        >
          {{ currency(product.price_info.current_price) }}
        </div>
      </div>

      <!-- Rating -->
      <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span class="text-gray-600">{{ product.total_sold.toFixed(1) }}</span>
        <span class="mx-1">|</span>
        <span>dummy text</span>
      </div>

      <!-- Mall / Yêu thích + địa điểm -->
      <div class="mt-1 flex items-center justify-between">
        <div class="flex items-center gap-1">
          <a-tag color="magenta" class="!m-0 !text-[10px]">Mall</a-tag>
          <a-tag color="red" class="!m-0 !text-[10px]">Yêu thích</a-tag>
        </div>
        <div class="text-xs text-gray-500">dummy text</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {Product} from "@/services/product/productService";


const props = defineProps<{ product: Product }>();

const currency = (n: number) =>
    n.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });

const getImageUrl = (id: string) =>
    `https://drive.google.com/thumbnail?id=${id}`
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
