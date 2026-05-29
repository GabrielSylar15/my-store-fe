<template>
  <header class="bg-primary text-white">
    <div class="container mx-auto flex justify-between items-center py-2 px-4 max-w-7xl">
      <div class="flex space-x-4">
        <a href="#" class="hover:underline">Kênh Người Bán</a>
        <span>|</span>
        <a href="#" class="hover:underline">Tải ứng dụng</a>
        <span>|</span>
        <a href="#" class="hover:underline">Kết nối</a>
        <i class="ml-1 fab fa-facebook"></i>
        <i class="ml-1 fab fa-instagram"></i>
      </div>
      <div class="flex space-x-4 items-center">
        <div class="flex items-center space-x-2 hover:cursor-pointer">
          <div class="relative">
            <span
                class="absolute -top-1 -right-1 bg-white text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center text-primary font-bold leading-none">3</span>
            <iconify-icon icon="line-md:bell-loop" width="24" height="24"></iconify-icon>
          </div>
          <span>Thông Báo</span>
        </div>

        <a href="#" class="hover:underline"><i class="fas fa-question-circle mr-1"></i> Hỗ Trợ</a>
        <a href="#" class="hover:underline"><i class="fas fa-globe mr-1"></i> Tiếng Việt</a>

        <div
            class="relative inline-block"
            @mouseenter="showDropdown = true"
            @mouseleave="showDropdown = false"
        >
          <div class="flex items-center space-x-2 hover:underline px-1 py-1 cursor-pointer">
            <img src="https://i.pravatar.cc/32" alt="Avatar" class="w-6 h-6 rounded-full"/>
            <span>sylar1505</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </div>

          <div
              v-if="showDropdown"
              class="absolute right-0 top-full pt-2 w-40 z-50"
          >
            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

            <div class="bg-white text-black rounded-md shadow-lg">
              <a class="block px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer" @click="router.push('/user/account/profile')">Tài Khoản Của Tôi</a>
              <a class="block px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer" @click="router.push('/user/orders')">Đơn Mua</a>
              <a class="block px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer">Đăng Xuất</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-7xl py-1 px-4">
      <div class="flex items-start justify-between gap-4 flex-wrap">

        <div class="flex items-center space-x-2 cursor-pointer" @click="router.push({path: '/'})">
          <iconify-icon icon="hugeicons:running-shoes" width="40" height="40" class="text-white"></iconify-icon>
          <h1 class="text-2xl font-bold text-white">GIADE</h1>
        </div>

        <div class="flex flex-col flex-1 max-w-[74%] min-w-[200px]">
          <div class="flex bg-white rounded border items-center">
            <input
                type="text"
                v-model="q"
                placeholder="HÈ RỰC SẮC XINH - 45%"
                class="flex-1 pl-[8px] focus:outline-none text-black bg-transparent"
                @keyup.enter="onSearch"
            />
            <button class="w-15 h-9 bg-primary flex items-center justify-center hover:active:bg-primary-100:5 rounded cursor-pointer"
                    @click="onSearch">
              <iconify-icon icon="material-symbols-light:search-rounded" width="20" height="20"
                            class="text-white"></iconify-icon>
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mt-1">
            <span class="text-white text-xs cursor-pointer transition">Giày chạy bộ</span>
            <span class="text-white px-2 text-xs cursor-pointer transition">Giày mùa hè</span>
            <span class="text-white px-2 text-xs cursor-pointer transition">Flash Sale</span>
          </div>
        </div>

        <!-- ===== Cart icon with mini-cart dropdown ===== -->
        <div
            class="relative flex items-center cursor-pointer group"
            title="Giỏ hàng"
            @mouseenter="onCartEnter"
            @mouseleave="onCartLeave"
            @click="router.push('/cart')"
        >
          <!-- Badge -->
          <span
              class="absolute -top-1 -right-2 bg-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center text-primary font-bold leading-none transition-all"
          >{{ cartStore.totalCount || 0 }}</span>
          <!-- opacity hover applied ONLY to the icon, not the dropdown child -->
          <iconify-icon icon="bx:cart" width="36" height="36" class="text-white group-hover:opacity-80 transition"></iconify-icon>

          <!-- Mini-cart dropdown -->
          <Transition name="cart-drop">
            <div
                v-if="showCartDropdown"
                class="cart-dropdown absolute right-0 bg-white text-gray-800 shadow-2xl rounded z-[200]"
                style="top: calc(100% + 10px); width: 360px;"
                @click.stop
                @mouseenter="onCartEnter"
                @mouseleave="onCartLeave"
            >
              <!-- Caret arrow -->
              <div class="absolute -top-2 right-4 w-0 h-0
                          border-l-[8px] border-r-[8px] border-b-[8px]
                          border-l-transparent border-r-transparent border-b-white
                          drop-shadow-sm">
              </div>

              <!-- Loading state -->
              <div v-if="cartStore.loading" class="flex justify-center items-center h-24">
                <a-spin :spinning="true" />
              </div>

              <!-- Empty state -->
              <div
                  v-else-if="cartStore.recentItems.length === 0"
                  class="flex flex-col items-center justify-center py-10 px-4 text-gray-400"
              >
                <iconify-icon icon="bx:cart" width="48" height="48" class="text-gray-200 mb-2"></iconify-icon>
                <span class="text-sm">Chưa có sản phẩm trong giỏ hàng</span>
              </div>

              <!-- Items list -->
              <template v-else>
                <p class="px-4 pt-4 pb-2 text-xs text-gray-400 font-medium tracking-wide uppercase">
                  Sản Phẩm Mới Thêm
                </p>

                <div class="max-h-[300px] overflow-y-auto">
                  <div
                      v-for="item in cartStore.recentItems"
                      :key="`${item.product_id}-${item.product_variant_id}`"
                      class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                      @click="router.push(`/product/${item.product_id}`)"
                  >
                    <img
                        :src="getItemImage(item)"
                        class="w-12 h-12 object-cover rounded border border-gray-100 flex-shrink-0 bg-gray-100"
                        @error="onImgError"
                        alt=""
                    />
                    <span class="flex-1 text-sm text-gray-700 line-clamp-2 leading-snug min-w-0">
                      {{ item.product?.name || `Sản phẩm #${item.product_id}` }}
                    </span>
                    <span class="text-primary text-sm font-medium flex-shrink-0 ml-2">
                      {{ currency(item.product?.price_info?.current_price ?? 0) }}
                    </span>
                  </div>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span class="text-sm text-gray-500">
                    {{ cartStore.totalCount }} Thêm Hàng Vào Giỏ
                  </span>
                  <button
                      class="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary-dark transition cursor-pointer"
                      @click.stop="router.push('/cart')"
                  >
                    Xem Giỏ Hàng
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>
        <!-- ===== end cart ===== -->

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {useSearchStore} from '@/stores/searchStore'
import {useCartStore} from '@/stores/cartStore'
import type {EnrichedCartItem} from '@/stores/cartStore'

const showDropdown = ref(false)
const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const cartStore = useCartStore()

// ─── Mini-cart hover logic ─────────────────────────────────────────────────────
const showCartDropdown = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const onCartEnter = () => {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  showCartDropdown.value = true
  // Lazy-load cart data on first hover
  cartStore.loadCart()
}

const onCartLeave = () => {
  hideTimer = setTimeout(() => {
    showCartDropdown.value = false
    hideTimer = null
  }, 200) // small delay prevents flickering when moving to dropdown
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}`

const getItemImage = (item: EnrichedCartItem) => {
  const productImg = item.product?.images?.[0]?.url
  if (productImg && !productImg.includes('-')) return getImageUrl(productImg)
  if (item.image) return getImageUrl(item.image)
  return 'https://placehold.co/48x48?text=?'
}

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=?'
}

const currency = (n: number) =>
    n.toLocaleString('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 0})

// ─── Search ───────────────────────────────────────────────────────────────────
const q = computed({
  get: () => searchStore.text,
  set: (v: string) => searchStore.setText(v ?? '')
})

onMounted(() => {
  const fromUrl = (route.query.text as string) || ''
  if (fromUrl && fromUrl !== searchStore.text) {
    searchStore.setText(fromUrl)
  }
})

watch(
    () => route.query.text,
    (t) => {
      const next = (t as string) ?? ''
      if (next !== searchStore.text) searchStore.setText(next)
    },
    {immediate: true}
)

const onSearch = () => {
  const text = (searchStore.text ?? '').trim()
  searchStore.setText(text)

  if (route.path !== '/product') {
    router.push({path: '/product', query: text ? {text} : {}})
  } else {
    router.replace({path: '/product', query: text ? {text} : {}})
  }
}
</script>

<style scoped>
/* Dropdown slide-down transition */
.cart-drop-enter-active,
.cart-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.cart-drop-enter-from,
.cart-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Scrollbar styling inside item list */
.cart-dropdown ::-webkit-scrollbar {
  width: 4px;
}
.cart-dropdown ::-webkit-scrollbar-track {
  background: transparent;
}
.cart-dropdown ::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}
</style>
