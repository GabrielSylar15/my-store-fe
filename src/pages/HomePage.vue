<template>
  <AuthHeader/>
  <div class="flex items-center justify-center bg-lime-100">

  </div>
  <Footer/>
</template>

<script setup>
import BuyerLogin from '@/components/users/auth/BuyerLogin.vue'
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";
import AuthHeader from "@/components/AuthHeader.vue";

onMounted(() => {
  document.title = "Đăng nhập tài khoản - Mua sắm online | GIADE"
})
</script>