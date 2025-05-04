<script setup lang="ts">
import {onMounted} from 'vue'
import {authService} from "@/services";

onMounted(() => {
  authService.handleOAuthCallback()
})
</script>

<template>
  <div class="text-center mt-10">
    <p>Đang xử lý đăng nhập Google, vui lòng đợi...</p>
  </div>
</template>
