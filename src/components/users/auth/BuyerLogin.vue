<template>
  <div class="flex items-center justify-center bg-lime-100 w-full">
    <div class="w-full px-0 py-15 bg-lime-600">
      <div class="flex justify-center items-center">
        <div class="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg">
          <div class="md:w-1/2 bg-lime-600 p-8 flex flex-col justify-center items-center text-white">
            <img src="/src/assets/logo_branch_3.png" alt="Logo" class="w-80 h-80"/>
            <p class="text-center text-2xl">Giày dép giá rẻ chất lượng cao</p>
          </div>

          <div class="md:w-1/2 p-8 rounded-lg">
            <h2 class="text-2xl text-center black mb-6">Đăng nhập</h2>

            <form @submit.prevent="authService.login">
              <input
                  type="text"
                  placeholder="Số điện thoại"
                  class="w-full mb-4 px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                  type="password"
                  placeholder="Mật khẩu"
                  class="w-full mb-4 px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                  @click="authService.login"
                  type="submit"
                  class="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition"
              >
                ĐĂNG NHẬP
              </button>
            </form>

            <div class="flex justify-between mt-3 text-sm black">
              <a href="#">Quên mật khẩu</a>
              <a href="#">Đăng nhập với SMS</a>
            </div>

            <div class="flex items-center my-4">
              <div class="flex-grow border-t border-gray-300"></div>
              <span class="mx-4 text-gray-500 text-sm">HOẶC</span>
              <div class="flex-grow border-t border-gray-300"></div>
            </div>

            <div class="flex gap-4">
              <button
                  class="flex items-center justify-center gap-2 flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100 cursor-pointer">
                <iconify-icon icon="logos:facebook" width="20" height="20"></iconify-icon>
                Facebook
              </button>
              <button
                  @click="authService.redirectToGoogleOAuth"
                  class="flex items-center justify-center gap-2 flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100 cursor-pointer">
                <iconify-icon icon="logos:google-icon" width="20" height="20"></iconify-icon>
                Google
              </button>
            </div>

            <p class="mt-6 text-center text-sm text-gray-500">
              Bạn mới biết đến GIADE?
              <a href="#" class="text-lime-600 font-semibold">Đăng ký</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {authService} from '@/services'
import {onMounted} from "vue";

onMounted(() => {
  authService.loginWithGoogle()
})
</script>
