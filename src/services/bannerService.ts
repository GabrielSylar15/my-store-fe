import {ref, Ref} from 'vue'
import {httpClient} from "@/core";

const CACHE_KEY = 'banner_thumbnails'

export interface UseBannerSlider {
    thumbnails: Ref<string[]>
    getImageUrl: (id: string) => string
    fetchThumbnails: () => Promise<void>
}

export function useBannerSlider(): UseBannerSlider {
    const thumbnails = ref<string[]>([])

    const getImageUrl = (id: string): string =>
        `https://drive.google.com/thumbnail?id=${id}&sz=w1920-h1080`

    const fetchThumbnails = async (): Promise<void> => {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
            thumbnails.value = JSON.parse(cached)
        }

        try {
            const response = await httpClient.get('/api/v1/configs/thumbnails')
            if (Array.isArray(response.data)) {
                thumbnails.value = response.data
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
            }
        } catch (e) {
            console.error('Lỗi fetch banner:', e)
        }
    }

    return {
        thumbnails,
        getImageUrl,
        fetchThumbnails
    }
}
