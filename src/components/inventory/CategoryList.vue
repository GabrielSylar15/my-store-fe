<template>
  <div class="py-8">
    <h2 class="text-xl mb-4 font-semibold">Danh mục</h2>

    <div v-if="isLoading" class="text-gray-500">Đang tải danh mục...</div>
    <div v-else-if="error" class="text-red-500">Lỗi: {{ error.message }}</div>

    <div class="relative overflow-hidden">
      <div
          class="flex transition-transform ease-in-out"
          :class="`duration-${timeSlide}`"
          :style="{
          transform: `translateX(-${(currentPage - 1) * 100 / transformIndex}%)`
        }"
      >

        <div
            v-for="(page, index) in paginatedCategories"
            :key="index"
            class="shrink-0 max-w-7xl w-full flex flex-col"
        >
          <!-- Hàng trên: index chẵn -->
          <div class="grid grid-cols-10">
            <div
                v-for="category in page.filter((_, idx) => idx % 2 === 0)"
                :key="category.id"
                class="group bg-white shadow-sm hover:shadow-md overflow-hidden transition"
            >
              <img
                  v-if="category.image"
                  :src="getImageUrl(category.image)"
                  alt="Ảnh danh mục"
                  class="h-20 mx-auto"
              />
              <div class="p-2">
                <h3 class="text-sm text-gray-800 text-center truncate" :title="category.name">
                  {{ category.name }}
                </h3>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-10">
            <div
                v-for="category in page.filter((_, idx) => idx % 2 === 1)"
                :key="category.id"
                class="group bg-white shadow-sm hover:shadow-md overflow-hidden transition"
            >
              <img
                  v-if="category.image"
                  :src="getImageUrl(category.image)"
                  alt="Ảnh danh mục"
                  class="h-20 mx-auto"
              />
              <div class="p-2">
                <h3 class="text-sm text-gray-800 text-center truncate" :title="category.name">
                  {{ category.name }}
                </h3>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div v-if="!categories.length && !isLoading" class="text-center text-gray-500">
        Không có danh mục nào để hiển thị.
      </div>

      <button
          v-if="currentPage > 1"
          @click="prevPage"
          class="absolute top-1/2 -translate-y-1/2 left-[-12px] border-0 shadow p-2 z-10 flex items-center justify-center cursor-pointer"
      >
        <iconify-icon icon="carbon:chevron-left" width="20" height="20"/>
      </button>

      <button
          v-if="hasNext"
          @click="nextPage"
          class="absolute top-1/2 -translate-y-1/2 right-[-12px] border-0 shadow p-2 z-10 flex items-center justify-center cursor-pointer"
      >
        <iconify-icon icon="carbon:chevron-right" width="20" height="20"/>
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {Category, categoryService} from '@/services/product/categoryService'

const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

const timePerCol = 150
const pageSize = 20
const currentPage = ref(1)

const paginatedCategories = computed(() => {
  const pages: Category[][] = []
  for (let i = 0; i < categories.value.length; i += pageSize) {
    pages.push(categories.value.slice(i, i + pageSize))
  }
  return pages
})

const totalPages = computed(() => paginatedCategories.value.length)
const hasNext = computed(() => currentPage.value < totalPages.value)
const hasPrev = computed(() => currentPage.value > 1)
const transformIndex = computed(() => {
  const nextPageIndex = pageSize * currentPage.value;

  const nextPageItemsCount = nextPageIndex >= categories.value.length
      ? categories.value.length - pageSize * (currentPage.value - 1)
      : pageSize;

  return nextPageItemsCount > 0 ? 10 / Math.ceil(nextPageItemsCount / 2) : 0;
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

const loadCategories = async () => {
  isLoading.value = true
  try {
    categories.value = await categoryService.fetchAll()
  } catch (err: any) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCategories)
</script>
