<template>
  <div class="flex items-center justify-center min-h-screen bg-lime-100">
    <div class="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Left section -->
      <div class="md:w-1/2 bg-lime-600 p-8 flex flex-col justify-center items-center text-white">
        <img src="/src/assets/logo.svg" alt="Logo" class="w-20 h-20 mb-4" />
        <h1 class="text-2xl font-bold">GIADE</h1>
        <p class="text-center mt-2">Giày dép giá rẻ chất lượng cao</p>
      </div>

      <!-- Right section -->
      <div class="md:w-1/2 p-8">
        <h2 class="text-2xl font-semibold text-center text-lime-600 mb-6">Đăng nhập</h2>

        <form @submit.prevent="login">
          <input
              type="text"
              placeholder="Số điện thoại"
              class="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <input
              type="password"
              placeholder="Mật khẩu"
              class="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <button
              type="submit"
              class="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div class="flex justify-between mt-3 text-sm text-lime-600">
          <a href="#">Quên mật khẩu</a>
          <a href="#">Đăng nhập với SMS</a>
        </div>

        <div class="flex items-center my-4">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-500 text-sm">HOẶC</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div class="flex gap-4">
          <button class="flex items-center justify-center gap-2 flex-1 border py-2 rounded hover:bg-gray-100">
            <iconify-icon icon="logos:facebook" width="20" height="20"></iconify-icon>
            Facebook
          </button>
          <button class="flex items-center justify-center gap-2 flex-1 border py-2 rounded hover:bg-gray-100">
            <iconify-icon icon="logos:google-icon" width="20" height="20"></iconify-icon>
            Google
          </button>
        </div>

        <p class="mt-6 text-center text-sm">
          Bạn mới biết đến GIADE?
          <a href="#" class="text-lime-600 font-semibold">Đăng ký</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const login = () => {
  alert("Đăng nhập thành công");
};
</script>
