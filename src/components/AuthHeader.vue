<template>
  <header class="bg-lime-600 text-white">
    <div class="container mx-auto flex justify-between items-center py-2 px-4 max-w-7xl">
      <div class="flex space-x-4">
        <a href="#" class="hover:underline">Kênh Người Bán</a>
        <span>|</span>
        <a href="#" class="hover:underline">Tải ứng dụng</a>
        <span>|</span>
        <a href="#" class="hover:underline">Kết nối</a>
        <i class="ml-1 fab fa-facebook"></i>
        <i class="ml-1 fab fa-instagram"></i>
      </div>
      <div class="flex space-x-4 items-center">
        <a href="#" class="hover:underline relative">
          <span class="absolute -top-1 -right-2 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          <i class="fas fa-bell mr-1"></i> Thông Báo
        </a>
        <a href="#" class="hover:underline"><i class="fas fa-question-circle mr-1"></i> Hỗ Trợ</a>
        <a href="#" class="hover:underline"><i class="fas fa-globe mr-1"></i> Tiếng Việt</a>

        <!-- Dropdown User -->
        <div class="relative" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <button class="flex items-center space-x-1 hover:underline">
            <i class="fas fa-user-circle"></i>
            <span>sylar1505</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </button>
          <div v-if="showDropdown" class="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-40 z-50">
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Tài Khoản Của Tôi</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Đơn Mua</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Đăng Xuất</a>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-7xl py-1 px-4">
      <div class="flex items-start justify-between gap-4 flex-wrap">

        <div class="flex items-center space-x-2">
          <iconify-icon icon="hugeicons:running-shoes" width="40" height="40" class="text-white"></iconify-icon>
          <h1 class="text-2xl font-bold text-white">GIADE</h1>
        </div>

        <div class="flex flex-col flex-1 max-w-[74%] min-w-[200px]">
          <!-- Ô SEARCH -->
          <div class="flex bg-white rounded border items-center">
            <input
                type="text"
                placeholder="HÈ RỰC SẮC XINH - 45%"
                class="flex-1 p-2 focus:outline-none text-black bg-transparent"
            />
            <button class="w-15 h-9 bg-lime-600 flex items-center justify-center hover:bg-lime-500 rounded">
              <iconify-icon icon="material-symbols-light:search-rounded" width="20" height="20" class="text-white"></iconify-icon>
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mt-1">
            <span class="text-white text-xs cursor-pointer transition">Giày chạy bộ</span>
            <span class="text-white px-2 text-xs cursor-pointer transition">Giày mùa hè</span>
            <span class="text-white px-2 text-xs cursor-pointer transition">Flash Sale</span>
          </div>
        </div>

        <!-- BÊN PHẢI (Cart) -->
        <div class="flex items-center">
          <iconify-icon icon="bx:cart" width="36" height="36" class="text-white"></iconify-icon>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const showDropdown = ref(false)
</script>
