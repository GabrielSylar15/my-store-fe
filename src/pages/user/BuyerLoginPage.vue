<template>
  <NoAuthHeader/>
  <div class="flex items-center justify-center bg-lime-100">
    <BuyerLogin/>
  </div>
  <Footer/>
</template>

<script setup>
import BuyerLogin from '@/components/users/BuyerLogin.vue'
import NoAuthHeader from '@/components/NoAuthHeader.vue'
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";

onMounted(() => {
  document.title = "Đăng nhập tài khoản - Mua sắm online | GIADE"
})
</script>