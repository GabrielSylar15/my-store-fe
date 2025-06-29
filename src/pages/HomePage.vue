<template>
  <div class="overflow-x-auto w-full min-w-[800px]">
    <AuthHeader/>
    <div class="mx-auto py-6 max-w-7xl">
      <BannerComponent/>
      <CategoryList/>
    </div>
    <Footer/>
  </div>
</template>

<script setup>
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";
import AuthHeader from "@/components/AuthHeader.vue";
import BannerComponent from "@/components/BannerComponent.vue";
import CategoryList from "@/components/inventory/CategoryList.vue";

onMounted(() => {
  document.title = "Đăng nhập tài khoản - Mua sắm online | GIADE"
})
</script>
