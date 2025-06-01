<template>
  <header class="bg-lime-600 text-white">
    <!-- Top bar -->
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

    <!-- Logo + Search -->
    <div class="container mx-auto flex justify-between items-center py-4 px-4 max-w-7xl">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <div class="flex items-center">
          <iconify-icon
              icon="hugeicons:running-shoes"
              width="40"
              height="40"
              class="text-white"
          ></iconify-icon>
          <h1 class="text-2xl font-bold text-white ml-4">GIADE</h1>
        </div>
      </div>

      <!-- Search -->
      <div class="flex flex-1 mx-[90px] bg-white rounded">
        <input
            type="text"
            placeholder="HÈ RỰC SẮC XINH - 45%"
            class="flex-1 p-2 rounded-l-md border border-gray-300 focus:outline-none text-black"
        />
        <button class="text-white backdrop-grayscale-25 px-3.5">
          <iconify-icon icon="material-symbols-light:search-rounded" width="28" height="28"></iconify-icon>
        </button>

      </div>

      <div class="flex items-center space-x-2">
        <iconify-icon icon="bx:cart" width="36" height="36"></iconify-icon>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const showDropdown = ref(false)
</script>
