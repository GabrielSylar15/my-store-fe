# add-component

Generate a new Vue component following the project's conventions.

## Usage

```
/add-component <domain> <ComponentName> [brief description]
```

**Examples:**
- `/add-component inventory ProductReviews Hiển thị danh sách đánh giá sản phẩm`
- `/add-component order OrderSummary Tóm tắt đơn hàng trong giỏ hàng`
- `/add-component users AddressBook Danh sách địa chỉ giao hàng`

## What this skill does

Creates `src/components/{domain}/{ComponentName}.vue` following the Composition API pattern used throughout this project.

## Component conventions

- `<script setup lang="ts">` — always Composition API, never Options API
- Ant Design Vue (`a-xxx` components) for interactive UI elements
- Tailwind CSS utility classes for layout and spacing
- Vietnamese UI text (this is a Vietnamese-language ecommerce app)
- `<a-spin :spinning="loading" tip="Đang tải...">` for async loading state
- `message.error('...')` from `ant-design-vue` for error notifications
- Import services from `@/services/{domain}/{name}Service`
- Use `ref`, `computed`, `onMounted`, `watch` from `vue` as needed

## Standard structure

```vue
<template>
  <div>
    <a-spin :spinning="loading" tip="Đang tải...">
      <!-- main content -->
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
// import relevant service

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // load data
  } catch {
    message.error('Không tải được dữ liệu')
  } finally {
    loading.value = false
  }
})
</script>
```

## Style conventions

- Use `<style scoped>` only when Tailwind + Ant Design overrides are insufficient
- When overriding Ant Design styles, use `:deep(.ant-xxx)` inside `<style scoped>`
- Currency formatting: `n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })`
- Image from Google Drive: `` `https://drive.google.com/thumbnail?id=${id}` ``

## Step-by-step instructions

1. Parse `$ARGUMENTS` for `domain`, `ComponentName`, and optional description
2. Determine what data/props the component needs based on the name and description
3. Check if a relevant service already exists in `src/services/{domain}/` — import it if so
4. Create `src/components/{domain}/{ComponentName}.vue`
5. Implement a realistic, non-trivial template matching the description; avoid placeholder "dummy text"
6. Report the created file path

$ARGUMENTS
