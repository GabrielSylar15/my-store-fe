<template>
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader/>
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px]">
      <div class="pb-6">
        <BannerComponent/>
      </div>
      <div class="pb-6">
        <CategoryList/>
      </div>
      <div class="pb-6">
        <HotSearchProduct/>
      </div>
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
import HotSearchProduct from "@/components/inventory/HotSearchProduct.vue";

onMounted(() => {
  document.title = "Đăng nhập tài khoản - Mua sắm online | GIADE"
})
</script>
