<!-- src/components/inventory/ProductCardSkeleton.vue -->
<template>
  <div class="group bg-white hover:shadow-md transition cursor-pointer overflow-hidden animate-pulse">
    <!-- Ảnh vuông -->
    <div class="relative">
      <div class="w-full aspect-square bg-gray-200"></div>
    </div>

    <!-- Nội dung -->
    <div class="p-3">
      <!-- Tên: 2 dòng -->
      <div class="min-h-[44px] space-y-2">
        <div class="h-3.5 bg-gray-200 rounded"></div>
        <div class="h-3.5 bg-gray-200 rounded w-5/6"></div>
      </div>

      <!-- Giá -->
      <div class="mt-2 flex items-baseline gap-2">
        <div class="h-4 bg-gray-200 rounded w-24"></div>
        <div class="h-3 bg-gray-200 rounded w-16"></div>
      </div>

      <!-- Rating -->
      <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <div class="h-3 bg-gray-200 rounded w-10"></div>
        <span class="mx-1 text-gray-300">|</span>
        <div class="h-3 bg-gray-200 rounded w-20"></div>
      </div>

      <!-- Mall / Yêu thích + địa điểm -->
      <div class="mt-1 flex items-center justify-between">
        <div class="flex items-center gap-1">
          <div class="h-4 w-10 bg-gray-200 rounded"></div>
          <div class="h-4 w-14 bg-gray-200 rounded"></div>
        </div>
        <div class="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// no script
</script>
