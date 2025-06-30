<template>
  <div class="py-8">
    <h2 class="text-xl mb-4 font-semibold">Danh mục</h2>

    <div v-if="isLoading" class="text-gray-500">Đang tải danh mục...</div>
    <div v-else-if="error" class="text-red-500">Lỗi: {{ error.message }}</div>

    <div class="relative overflow-hidden">
      <!-- Slider wrapper -->
      <div
          class="flex transition-transform duration-1500 ease-in-out"
          :style="{
          transform: `translateX(-${(currentPage - 1) * 100}%)`

        }"
      >
        <!-- Mỗi page là 1 grid -->
        <div
            v-for="(page, index) in paginatedCategories"
            :key="index"
            class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 shrink-0"
        >
          <div
              v-for="category in page"
              :key="category.id"
              class="group bg-white shadow-sm hover:shadow-md cursor-pointer overflow-hidden transition"
          >
            <img
                v-if="category.image"
                :src="getImageUrl(category.image)"
                alt="Ảnh danh mục"
                class="w-full h-20 object-cover"
            />
            <div class="p-2">
              <h3 class="text-sm font-medium text-gray-800 text-center break-words">
                {{ category.name }}
              </h3>
              <p class="relative text-[10px] text-gray-500 text-center line-clamp-1">
                {{ category.description }}
                <span
                    class="absolute z-10 hidden group-hover:flex bg-black text-white text-xs rounded px-2 py-1
                    whitespace-normal max-w-[200px] left-full top-1/2 -translate-y-1/2 ml-2 shadow-lg"
                >
                  {{ category.description }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Không có danh mục -->
      <div v-if="!categories.length && !isLoading" class="text-center text-gray-500 py-4">
        Không có danh mục nào để hiển thị.
      </div>

      <!-- Nút trái -->
      <button
          v-if="currentPage > 1"
          @click="prevPage"
          class="absolute top-1/2 -translate-y-1/2 left-[-16px] bg-white shadow p-2 z-10"
      >
        <iconify-icon icon="carbon:chevron-left" width="20" height="20"/>
      </button>

      <!-- Nút phải -->
      <button
          v-if="hasNext"
          @click="nextPage"
          class="absolute top-1/2 -translate-y-1/2 right-[-16px] bg-white shadow p-2 z-10"
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

const pageSize = 20 // mỗi page có 20 danh mục
const currentPage = ref(1)

// Phân chia danh sách thành từng "trang"
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

const nextPage = () => {
  if (hasNext.value) currentPage.value++
}
const prevPage = () => {
  if (hasPrev.value) currentPage.value--
}

const getImageUrl = (id: string) =>
    `https://drive.google.com/thumbnail?id=${id}&sz=w400`

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
