<template>
  <header class="bg-primary text-white">
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
        <div class="flex items-center space-x-2 hover:cursor-pointer">
          <div class="relative">
            <span
                class="absolute -top-1 -right-1 bg-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-primary font-bold">3</span>
            <i class="fas fa-bell text-xl"></i>
            <iconify-icon icon="line-md:bell-loop" width="24" height="24"></iconify-icon>
          </div>
          <span>Thông Báo</span>
        </div>

        <a href="#" class="hover:underline"><i class="fas fa-question-circle mr-1"></i> Hỗ Trợ</a>
        <a href="#" class="hover:underline"><i class="fas fa-globe mr-1"></i> Tiếng Việt</a>

        <div
            class="relative inline-block"
            @mouseenter="showDropdown = true"
            @mouseleave="showDropdown = true"
        >
          <div class="flex items-center space-x-2 hover:underline px-1 py-1 cursor-pointer">
            <img src="https://i.pravatar.cc/32" alt="Avatar" class="w-6 h-6 rounded-full"/>
            <span>sylar1505</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </div>

          <div
              v-if="showDropdown"
              class="absolute right-0 top-full pt-2 w-40 z-50"
          >
            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

            <div class="bg-white text-black rounded-md shadow-lg">
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 rounded-md">Tài Khoản Của Tôi</a>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 rounded-md">Đơn Mua</a>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 rounded-md">Đăng Xuất</a>
            </div>
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
          <div class="flex bg-white rounded border items-center">
            <input
                type="text"
                placeholder="HÈ RỰC SẮC XINH - 45%"
                class="flex-1 p-[3px] focus:outline-none text-black bg-transparent"
            />
            <button class="w-15 h-9 bg-primary flex items-center justify-center hover:bg-lime-500 rounded">
              <iconify-icon icon="material-symbols-light:search-rounded" width="20" height="20"
                            class="text-white"></iconify-icon>
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mt-1">
            <span class="text-white text-xs cursor-pointer transition">Giày chạy bộ</span>
            <span class="text-white px-2 text-xs cursor-pointer transition">Giày mùa hè</span>
            <span class="text-white px-2 text-xs cursor-pointer transition">Flash Sale</span>
          </div>
        </div>

        <div class="relative flex items-center">
          <span
              class="absolute -top-1 -right-2 bg-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-primary font-bold">300</span>
          <iconify-icon icon="bx:cart" width="36" height="36" class="text-white"></iconify-icon>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import {ref} from 'vue'

const showDropdown = ref(false)
</script>
