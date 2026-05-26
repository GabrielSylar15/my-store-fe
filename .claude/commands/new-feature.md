# new-feature

Scaffold a complete new feature for this Vue 3 ecommerce project following the established conventions.

## Usage

```
/new-feature <domain> <FeatureName> [description]
```

**Examples:**
- `/new-feature order OrderHistory Lịch sử đơn hàng`
- `/new-feature inventory ProductReview Đánh giá sản phẩm`
- `/new-feature user WishList Danh sách yêu thích`

## What this skill does

Given `domain` and `FeatureName`, scaffold all necessary files:

1. **Service** — `src/services/{domain}/{featureName}Service.ts`
2. **Component** — `src/components/{domain}/{FeatureName}.vue`
3. **Page** — `src/pages/{domain}/{FeatureName}Page.vue`
4. **Route** — register in `src/routes/{domain}.routes.ts` (create file if missing)

## Project conventions to follow

### Service pattern (`src/services/{domain}/{featureName}Service.ts`)

```ts
import { httpClient } from '@/core'

export interface {FeatureName}Item {
  id: number
  // add relevant fields
}

export interface Fetch{FeatureName}Condition {
  // query params
}

class {FeatureName}Service {
  async fetchByCondition(condition: Fetch{FeatureName}Condition = {}): Promise<{FeatureName}Item[]> {
    const res = await httpClient.post('/api/v1/{route}', condition)
    return res.data
  }
}

export const {featureName}Service = new {FeatureName}Service()
```

- Use `httpClient` from `@/core` — never raw axios
- Return `res.data` (already unwrapped by the interceptor — `ApiResponse.data`)
- Name the exported singleton `{camelCase}Service`
- Add TypeScript interfaces for the resource and fetch condition

### Component pattern (`src/components/{domain}/{FeatureName}.vue`)

```vue
<template>
  <div>
    <!-- UI using Ant Design Vue (a-xxx) + Tailwind classes -->
    <!-- Vietnamese labels (this is a Vietnamese ecommerce app) -->
    <a-spin :spinning="loading" tip="Đang tải...">
      <!-- content -->
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { {featureName}Service } from '@/services/{domain}/{featureName}Service'

const items = ref([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    items.value = await {featureName}Service.fetchByCondition()
  } catch {
    message.error('Không tải được dữ liệu')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
```

- All UI text in Vietnamese
- Use `<a-spin>` for loading state with `tip="Đang tải..."`
- Use `message.error(...)` for errors (from `ant-design-vue`)
- `<script setup lang="ts">` — Composition API, no Options API
- Tailwind for layout/spacing; Ant Design Vue (`a-xxx`) for interactive components

### Page pattern (`src/pages/{domain}/{FeatureName}Page.vue`)

```vue
<template>
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader />
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px]">
      <div class="pb-6">
        <{FeatureName} />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthHeader from '@/components/AuthHeader.vue'
import Footer from '@/components/Footer.vue'
import {FeatureName} from '@/components/{domain}/{FeatureName}.vue'

onMounted(() => {
  document.title = '{Page title} | GIADE'
})
</script>
```

- Always wrap with `AuthHeader` (fixed top bar) + `Footer`
- `pt-[140px]` on the main content wrapper to account for the fixed header
- Set `document.title` in `onMounted`

### Route pattern (`src/routes/{domain}.routes.ts`)

```ts
import {FeatureName}Page from '@/pages/{domain}/{FeatureName}Page.vue'

const {domain}Routes = [
  // existing routes...
  {
    path: '/{domain}/{kebab-name}',
    name: '{FeatureName}',
    component: {FeatureName}Page
  }
]

export default {domain}Routes
```

- If `src/routes/{domain}.routes.ts` does not exist, create it and also import+spread it in `src/routes/index.ts`
- If it already exists, append the new route to the array

## Step-by-step instructions

1. Parse `$ARGUMENTS` to extract `domain`, `FeatureName`, and optional `description`
2. Derive:
   - `featureName` = camelCase of FeatureName (e.g. `orderHistory`)
   - `kebab-name` = kebab-case of FeatureName (e.g. `order-history`)
3. Read existing route file for the domain if it exists, so you can append without overwriting
4. Create all four files following the patterns above
5. If route file was newly created, read `src/routes/index.ts` and add the import + spread
6. Report the created files and the route path

$ARGUMENTS
