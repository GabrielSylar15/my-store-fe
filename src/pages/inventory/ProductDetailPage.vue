<template>
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader/>
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px]">
      <div class="pb-6">
        <ProductDetail/>
      </div>
    </div>

    <Footer/>
  </div>
</template>


<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";
import AuthHeader from "@/components/AuthHeader.vue";
import ProductDetail from "@/components/inventory/ProductDetail.vue";
import {useRoute} from 'vue-router'

onMounted(() => {
  document.title = "Tìm kiếm sản phẩm - Mua sắm online | GIADE"
})
const route = useRoute()
const productName = route.params.productName as string

console.log('Đang xem chi tiết:', productName)
</script>
