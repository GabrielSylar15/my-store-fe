<template>
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page min-h-screen">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader />
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px] px-4">
      <div class="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-5">
        <UserSidebar />
        <div class="min-w-0">
          <BuyerProfile />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthHeader from '@/components/AuthHeader.vue'
import Footer from '@/components/Footer.vue'
import UserSidebar from '@/components/user/UserSidebar.vue'
import BuyerProfile from '@/components/user/BuyerProfile.vue'

onMounted(() => { document.title = 'Hồ Sơ Của Tôi | GIADE' })
</script>
