<template>
  <div class="relative w-full h-[400px] overflow-hidden bg-black rounded-lg">
    <div v-if="thumbnails.length === 0" class="text-white text-center pt-20">Đang tải banner...</div>

    <!-- Carousel wrapper -->
    <div
        v-else
        class="w-full h-full"
    >
      <div
          class="flex w-full h-full transition-transform duration-700 ease-in-out"
          :style="`transform: translateX(-${currentIndex * 100}%)`"
      >
        <img
            v-for="(thumbId, index) in thumbnails"
            :key="index"
            :src="getImageUrl(thumbId)"
            alt="Banner"
            class="w-full h-full object-cover flex-shrink-0"
        />
      </div>

      <!-- Navigation buttons -->
      <button
          class="absolute top-1/2 left-4 transform -translate-y-1/2
         bg-white/20 hover:bg-white/40 transition
         px-2 py-4 shadow flex items-center justify-center
         cursor-pointer"
          @click="prevImage"
      >
        <iconify-icon icon="carbon:chevron-left" width="16" height="16"></iconify-icon>
      </button>

      <button
          class="absolute top-1/2 right-4 transform -translate-y-1/2
         bg-white/20 hover:bg-white/40 transition
         px-2 py-4 shadow flex items-center justify-center
         cursor-pointer"
          @click="nextImage"
      >
        <iconify-icon icon="carbon:chevron-right" width="16" height="16"></iconify-icon>
      </button>

      <!-- Dots -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <span
            v-for="(thumbId, index) in thumbnails"
            :key="index"
            class="w-3 h-3 rounded-full cursor-pointer transition-colors"
            :class="currentIndex === index ? 'bg-primary' : 'bg-white opacity-50'"
            @click="goToImage(index)"
        ></span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onBeforeUnmount, onMounted} from 'vue'
import {useBannerSlider} from '@/services/bannerService'

const {
  thumbnails,
  currentIndex,
  getImageUrl,
  fetchThumbnails,
  nextImage,
  prevImage,
  goToImage,
  startAutoSlide,
  stopAutoSlide,
  restartAutoSlide
} = useBannerSlider()

onMounted(() => {
  fetchThumbnails()
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>


