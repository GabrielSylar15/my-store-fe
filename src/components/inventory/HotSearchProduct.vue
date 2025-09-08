<template>
  <div class="bg-background-component">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-500 pl-6 py-3 text-primary">TÌM KIẾM HÀNG ĐẦU</h2>
      <h2 class="text-sm font-500 pl-6 pr-3 text-primary">Xem Tất Cả ></h2>
    </div>
    <div v-if="isLoading" class="text-gray-500">Đang tải sản phẩm...</div>
    <div v-else-if="error" class="text-red-500">Lỗi: {{ error.message }}</div>

    <div class="relative overflow-hidden border-t-1 border-t-gray-200">
      <div
          class="flex transition-transform ease-in-out"
          :class="`duration-${timeSlide}`"
          :style="{
          transform: `translateX(-${(currentPage - 1) * 100 / transformIndex}%)`
        }"
      >
        <div class="shrink-0 max-w-7xl w-full flex flex-col"
               v-for="(page, index) in paginatedProducts"
               :key="index">
            <div :class="['grid', `grid-cols-6`]"
               v-for="i in colNum"
               :key="i">
            <div
                v-for="product in page.filter((_, idx) => idx % rowNum === i - 1)"
                :key="product.id"
                class="group bg-white hover:shadow-lg cursor-pointer overflow-hidden transition"
            >
              <img
                  v-if="product.images?.[0]?.url"
                  :src="getImageUrl(product.images[0].url)"
                  alt="Ảnh sản phẩm"
                  class="h-[180px] mx-auto"
              />
              <div class="p-2">
                <h3 class="text-[16px] text-gray-800" :title="product.name">
                  {{ product.name }}
                </h3>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-if="!products.length && !isLoading" class="text-center text-gray-500">
        Không có sản phẩm nào để hiển thị.
      </div>

      <button
          v-if="currentPage > 1"
          @click="prevPage"
          class="absolute top-1/2 -translate-y-1/2 left-[10px] border-2
          border-background-page
           shadow p-1 z-10 flex
           items-center justify-center
           cursor-pointer rounded-full"
      >
        <iconify-icon icon="carbon:chevron-left" width="13" height="13"/>
      </button>

      <button
          v-if="hasNext"
          @click="nextPage"
          class="absolute top-1/2 -translate-y-1/2 right-[10px] border-2
           border-background-page
           shadow
           p-1 z-10
           flex items-center
           justify-center
           cursor-pointer
           rounded-full"
      >
        <iconify-icon icon="carbon:chevron-right" width="13" height="13"/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {Product, productService} from '@/services/product/productService'

const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

const timePerCol = 150
const colNum = 6;
const rowNum = products.value.length > colNum ? 2 : 1;
const pageSize = colNum * rowNum;
const currentPage = ref(1)

const paginatedProducts = computed(() => {
  const pages: Product[][] = []
  for (let i = 0; i < products.value.length; i += pageSize) {
    pages.push(products.value.slice(i, i + pageSize))
  }
  return pages
})

const totalPages = computed(() => paginatedProducts.value.length)
const hasNext = computed(() => currentPage.value < totalPages.value)
const hasPrev = computed(() => currentPage.value > 1)
const transformIndex = computed(() => {
  const nextPageIndex = pageSize * currentPage.value;

  const nextPageItemsCount = nextPageIndex >= products.value.length
      ? products.value.length - pageSize * (currentPage.value - 1)
      : pageSize;

  return nextPageItemsCount > 0 ? colNum / Math.ceil(nextPageItemsCount / rowNum) : 0;
});

const timeSlide = computed(() => {
  return transformIndex.value * timePerCol;
});

const nextPage = () => {
  if (hasNext.value) currentPage.value++
}
const prevPage = () => {
  if (hasPrev.value) currentPage.value--
}

const getImageUrl = (id: string) =>
    `https://drive.google.com/thumbnail?id=${id}`

const loadProducts = async () => {
  isLoading.value = true
  try {
    products.value = await productService.fetchByCondition({
      // "suggestion_type": "hot search",
      "limit": 36
    });
  } catch (err: any) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

onMounted(loadProducts)
</script>
