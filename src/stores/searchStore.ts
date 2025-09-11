import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
    const text = ref('')

    const setText = (t: string) => {
        text.value = t.trim()
    }

    return { text, setText }
})
