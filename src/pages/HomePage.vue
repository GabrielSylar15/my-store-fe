<template>
  <div class="overflow-x-auto min-w-[800px]">
    <AuthHeader/>
    <div class="flex items-center justify-center bg-lime-100">

    </div>
    <Footer/>
  </div>
</template>

<script setup>
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";
import AuthHeader from "@/components/AuthHeader.vue";

onMounted(() => {
  document.title = "Đăng nhập tài khoản - Mua sắm online | GIADE"
})
</script>