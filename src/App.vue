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
</script>
