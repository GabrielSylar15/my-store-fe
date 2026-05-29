<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#ee4d2d',
        colorLink: '#ee4d2d',
        borderRadius: 4,
        fontFamily: '\'Be Vietnam Pro\', ui-sans-serif, system-ui, sans-serif',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup>
</script>
