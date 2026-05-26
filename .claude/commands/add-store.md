# add-store

Create a new Pinia store following the project's store conventions.

## Usage

```
/add-store <storeName> [description]
```

**Examples:**
- `/add-store cart Quản lý giỏ hàng (thêm/xóa/cập nhật số lượng)`
- `/add-store user Thông tin user đăng nhập và trạng thái auth`
- `/add-store wishlist Danh sách sản phẩm yêu thích`

## What this skill does

Creates `src/stores/{storeName}Store.ts` using Pinia's **Setup Store** (function-style) pattern, matching the existing `searchStore.ts`.

## Store conventions

- Always use the **Setup Store** pattern (`defineStore('name', () => { ... })`) — never the Options Store
- Store ID = camelCase store name (e.g. `'cart'`, `'user'`)
- Export name = `use{StoreName}Store` (e.g. `useCartStore`)
- File name = `{storeName}Store.ts`
- Use `ref()` for mutable state, `computed()` for derived values
- Keep actions as plain functions inside the setup function
- Return all state, computed, and actions explicitly

## Reference implementation (`src/stores/searchStore.ts`)

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const text = ref('')

  const setText = (t: string) => {
    text.value = t.trim()
  }

  return { text, setText }
})
```

## For a more complex store (e.g. cart)

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const addItem = (item: CartItem) => {
    const existing = items.value.find(i => i.productId === item.productId)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter(i => i.productId !== productId)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(i => i.productId === productId)
    if (item) item.quantity = Math.max(1, quantity)
  }

  const clear = () => {
    items.value = []
  }

  return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clear }
})
```

## Step-by-step instructions

1. Parse `$ARGUMENTS` for `storeName` and optional description
2. Design state shape appropriate for the store's purpose
3. Include relevant `computed` getters derived from the state
4. Include CRUD-style action functions as needed
5. Define TypeScript interfaces for any complex state objects
6. Create `src/stores/{storeName}Store.ts`
7. Report the created file path and a brief summary of the exported state/actions

$ARGUMENTS
