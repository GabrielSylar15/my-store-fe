<template>
  <LoginHeader/>
  <div class="flex items-center justify-center bg-lime-100">
    <BuyerLogin/>
  </div>
  <Footer/>
</template>

<script setup>
import BuyerLogin from '@/components/users/auth/BuyerLogin.vue'
import LoginHeader from '@/components/LoginHeader.vue'
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";

onMounted(() => {
  document.title = "Đăng nhập tài khoản - Mua sắm online | GIADE"
})
</script>