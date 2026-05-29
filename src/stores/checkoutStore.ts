import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EnrichedCartItem } from '@/stores/cartStore'

export const useCheckoutStore = defineStore('checkout', () => {
  const selectedItems = ref<EnrichedCartItem[]>([])

  const setSelectedItems = (items: EnrichedCartItem[]) => {
    selectedItems.value = items
  }

  const clear = () => {
    selectedItems.value = []
  }

  return { selectedItems, setSelectedItems, clear }
})
