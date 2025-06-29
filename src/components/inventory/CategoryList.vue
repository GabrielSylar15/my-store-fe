<template>
  <div class="py-8">
    <h2 class="text-xl mb-4">Danh mục</h2>

    <div v-if="isLoading" class="text-gray-500">Đang tải danh mục...</div>
    <div v-else-if="error" class="text-red-500">Lỗi: {{ error.message }}</div>

    <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10"
    >
      <div
          v-for="category in categories"
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
          <h3 class="text-xs font-medium text-gray-800 text-center break-words">
            {{ category.name }}
          </h3>
          <p class="relative text-[10px] text-gray-500 text-center line-clamp-1">
            {{ category.description }}
            <span
                class="absolute z-10 hidden group-hover:inline-block bg-black text-white text-xs rounded px-2 py-1
           whitespace-normal max-w-[200px] left-full top-1/2 -translate-y-1/2 ml-2 shadow-lg"
            >
    {{ category.description }}
  </span>
          </p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {Category, categoryService} from "@/services/product/categoryService";


const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

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

const getImageUrl = (id: string) =>
    `https://drive.google.com/thumbnail?id=${id}&sz=w400`

onMounted(loadCategories)
</script>
