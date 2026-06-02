<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#0d9488',   /* mirrors --color-primary in tailwind.css */
        colorLink: '#0d9488',      /* mirrors --color-primary in tailwind.css */
        borderRadius: 4,
        fontFamily: '\'Be Vietnam Pro\', ui-sans-serif, system-ui, sans-serif',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { getAccessToken } from '@/core'

const cartStore = useCartStore()
const userStore = useUserStore()

onMounted(() => {
  if (getAccessToken()) {
    cartStore.loadCart()
    userStore.loadProfile()
  }
})
</script>
