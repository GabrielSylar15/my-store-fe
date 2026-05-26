<template>
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader />
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px]">
      <ProductDetail :product-id="productId" />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthHeader from '@/components/AuthHeader.vue'
import Footer from '@/components/Footer.vue'
import ProductDetail from '@/components/inventory/ProductDetail.vue'

const route = useRoute()
const productId = route.params.productName as string

onMounted(() => {
  document.title = 'Chi Tiết Sản Phẩm | GIADE'
})
</script>
