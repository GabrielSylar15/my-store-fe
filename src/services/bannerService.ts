import {ref, Ref} from 'vue'
import {httpClient} from "@/core";

const CACHE_KEY = 'banner_thumbnails'

export interface UseBannerSlider {
    thumbnails: Ref<string[]>
    currentIndex: Ref<number>
    getImageUrl: (id: string) => string
    fetchThumbnails: () => Promise<void>
    nextImage: () => void
    prevImage: () => void
    goToImage: (index: number) => void
    startAutoSlide: () => void
    stopAutoSlide: () => void
    restartAutoSlide: () => void
}

export function useBannerSlider(): UseBannerSlider {
    const thumbnails = ref<string[]>([])
    const currentIndex = ref<number>(0)
    let autoSlideInterval: ReturnType<typeof setInterval> | null = null

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

    const nextImage = (): void => {
        currentIndex.value = (currentIndex.value + 1) % thumbnails.value.length
        restartAutoSlide()
    }

    const prevImage = (): void => {
        currentIndex.value =
            (currentIndex.value - 1 + thumbnails.value.length) % thumbnails.value.length
        restartAutoSlide()
    }

    const goToImage = (index: number): void => {
        if (index >= 0 && index < thumbnails.value.length) {
            currentIndex.value = index
            restartAutoSlide()
        }
    }

    const startAutoSlide = (): void => {
        stopAutoSlide()
        autoSlideInterval = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % thumbnails.value.length
        }, 3000)
    }

    const stopAutoSlide = (): void => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval)
            autoSlideInterval = null
        }
    }

    const restartAutoSlide = (): void => {
        stopAutoSlide()
        startAutoSlide()
    }

    return {
        thumbnails,
        currentIndex,
        getImageUrl,
        fetchThumbnails,
        nextImage,
        prevImage,
        goToImage,
        startAutoSlide,
        stopAutoSlide,
        restartAutoSlide
    }
}
