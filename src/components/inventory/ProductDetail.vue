<template>
  <a-spin :spinning="loading" tip="Đang tải...">
    <div v-if="product" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-2">

      <!-- Breadcrumb -->
      <a-breadcrumb class="mb-3 text-sm">
        <a-breadcrumb-item>
          <span class="cursor-pointer hover:text-primary" @click="router.push('/')">GIADE</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span class="cursor-pointer hover:text-primary" @click="router.push('/product')">Sản Phẩm</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ product.name }}</a-breadcrumb-item>
      </a-breadcrumb>

      <!-- ===== Section 1: Gallery + Info ===== -->
      <div class="bg-white p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Gallery -->
        <div class="lg:col-span-5">
          <!-- Main image: hover → lens zoom, click → fullscreen modal -->
          <div
            class="aspect-square w-full bg-gray-50 overflow-hidden border border-gray-100 relative cursor-crosshair"
            ref="imageContainerRef"
            @mousemove="onImageHover"
            @mouseleave="isHovering = false"
            @mouseenter="isHovering = true"
            @click="zoomVisible = true"
          >
            <img :src="activeImage" :alt="product.name" class="w-full h-full object-cover select-none" />
            <!-- Lens rectangle -->
            <div
              v-show="isHovering"
              class="absolute pointer-events-none border border-white/80 bg-white/25"
              :style="lensStyle"
            />
          </div>

          <div class="mt-3 px-6">
            <a-carousel
              :dots="false"
              :arrows="true"
              :infinite="false"
              :slidesToShow="4"
              :slidesToScroll="4"
              class="thumbs-carousel"
            >
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: -10px; z-index: 1">
                  <left-circle-outlined />
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: -10px">
                  <right-circle-outlined />
                </div>
              </template>
              <div v-for="(img, idx) in product.images" :key="idx" class="px-1">
                <button
                  type="button"
                  class="w-full aspect-square border-2 transition overflow-hidden"
                  :class="activeIndex === idx ? 'border-primary' : 'border-gray-200 hover:border-primary'"
                  @mouseenter="activeIndex = idx"
                >
                  <img :src="getImageUrl(img.url)" class="h-full w-full object-cover" alt="" />
                </button>
              </div>
            </a-carousel>
          </div>
        </div>

        <!-- Info -->
        <div class="lg:col-span-7 flex flex-col gap-4 lg:pl-4">

          <h1 class="text-xl font-medium leading-snug">{{ product.name }}</h1>

          <!-- Stats row -->
          <div class="flex items-center gap-3 text-sm text-gray-500 pb-3 border-b border-gray-100 flex-wrap">
            <span class="text-primary font-semibold underline cursor-pointer">{{ reviewAvg }}</span>
            <a-rate :value="Number(reviewAvg)" allow-half disabled />
            <span class="text-gray-300">|</span>
            <span>{{ product.total_sold.toLocaleString('vi-VN') }} Đã Bán</span>
            <span class="text-gray-300">|</span>
            <span>
              <b class="text-gray-700">{{ product.stock_quantity }}</b>
              <span class="ml-1">trong kho</span>
            </span>
          </div>

          <!-- Price -->
          <div class="bg-gray-50 rounded px-5 py-4 flex items-center gap-4">
            <span class="text-3xl font-normal text-primary">{{ displayPriceText }}</span>
          </div>

          <!-- Shipping -->
          <div class="grid grid-cols-12 items-center gap-2 text-sm py-1">
            <span class="col-span-2 text-gray-500">Vận Chuyển</span>
            <div class="col-span-10 flex items-center gap-2 text-gray-700">
              <iconify-icon icon="material-symbols:local-shipping-outline" width="18" height="18"></iconify-icon>
              <span>Miễn phí vận chuyển</span>
            </div>
          </div>

          <!-- Tier variant rows (dynamic) -->
          <div v-for="(tier, tierIdx) in product.tier_variants" :key="tierIdx">
            <div class="grid grid-cols-12 items-start gap-2">
              <span class="col-span-2 text-sm text-gray-500 pt-2">{{ tier.name }}</span>
              <div class="col-span-10 flex flex-wrap gap-2">
                <button
                  v-for="(opt, optIdx) in tier.options"
                  :key="optIdx"
                  type="button"
                  class="px-3 py-1.5 border text-sm flex items-center gap-1.5 transition"
                  :class="selectedTiers[tierIdx] === optIdx
                    ? 'border-primary text-primary bg-primary/10'
                    : isOptionAvailable(tierIdx, optIdx)
                      ? 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'"
                  :disabled="!isOptionAvailable(tierIdx, optIdx)"
                  @click="selectTier(tierIdx, optIdx)"
                >
                  <img
                    v-if="isDriveId(tier.images?.[optIdx]?.url)"
                    :src="getImageUrl(tier.images![optIdx].url)"
                    class="w-5 h-5 object-cover rounded-sm flex-shrink-0"
                    alt=""
                  />
                  {{ opt }}
                </button>
              </div>
            </div>
            <p
              v-if="showTierError && selectedTiers[tierIdx] === null"
              class="text-xs text-red-500 mt-1 pl-[calc(100%/6)]"
            >
              Vui lòng chọn {{ tier.name.toLowerCase() }}
            </p>
          </div>

          <!-- Quantity -->
          <div class="grid grid-cols-12 items-center gap-2">
            <span class="col-span-2 text-sm text-gray-500">Số Lượng</span>
            <div class="col-span-10 flex items-center gap-4">
              <div class="flex items-center border border-gray-300">
                <button
                  type="button"
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-lg leading-none"
                  :disabled="qty <= 1"
                  @click="qty = Math.max(1, qty - 1)"
                >−</button>
                <span class="w-10 text-center text-sm border-x border-gray-300 h-8 flex items-center justify-center select-none">{{ qty }}</span>
                <button
                  type="button"
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-lg leading-none"
                  :disabled="qty >= maxAddable"
                  @click="qty = Math.min(maxAddable, qty + 1)"
                >+</button>
              </div>
              <span class="text-sm text-gray-500">
                Còn <b class="text-gray-700">{{ currentStock }}</b> sản phẩm
              </span>
            </div>
          </div>
          <!-- Max-qty warning -->
          <div v-if="showMaxQtyWarning" class="grid grid-cols-12">
            <span class="col-span-10 col-start-3 text-xs text-orange-500 mt-0.5">
              Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
            </span>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center gap-3 mt-1">
            <button
              type="button"
              :disabled="addingToCart"
              @click="addToCart"
              class="flex items-center justify-center gap-2 px-6 h-12 border border-primary text-primary bg-primary/10 hover:bg-primary/20 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <iconify-icon v-if="!addingToCart" icon="iconoir:add-to-cart" width="20" height="20"></iconify-icon>
              <a-spin v-else :spinning="true" size="small" />
              Thêm Vào Giỏ Hàng
            </button>
            <button
              type="button"
              :disabled="addingToCart"
              @click="buyNow"
              class="flex items-center justify-center px-8 h-12 bg-primary text-white hover:bg-primary-dark transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Mua Ngay
            </button>
          </div>

          <!-- Trust badges -->
          <div class="pt-3 border-t border-gray-100 flex flex-wrap gap-5 text-sm text-gray-600">
            <div class="flex items-center gap-1.5">
              <iconify-icon icon="material-symbols:verified-outline" width="18" height="18" class="text-primary"></iconify-icon>
              Hàng chính hãng 100%
            </div>
            <div class="flex items-center gap-1.5">
              <iconify-icon icon="material-symbols:replay" width="18" height="18" class="text-primary"></iconify-icon>
              Trả hàng miễn phí 15 ngày
            </div>
            <div v-if="product.pre_order?.is_pre_order" class="flex items-center gap-1.5">
              <iconify-icon icon="material-symbols:schedule-outline" width="18" height="18" class="text-primary"></iconify-icon>
              Giao trong {{ product.pre_order.days_to_ship }} ngày
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Section 2: Details + Desc + Reviews | Sidebar ===== -->
      <div class="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        <!-- Left column -->
        <div class="lg:col-span-9 flex flex-col gap-4">

          <!-- Combined: Chi Tiết + Mô Tả (one card) -->
          <div class="bg-white p-6 shadow-sm">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-4">Chi Tiết Sản Phẩm</h2>
            <div class="divide-y divide-gray-50 text-sm">
              <div class="grid grid-cols-12 py-2">
                <span class="col-span-3 text-gray-500">Danh Mục</span>
                <span class="col-span-9 text-primary cursor-pointer hover:underline" @click="router.push('/product')">GIADE</span>
              </div>
              <div class="grid grid-cols-12 py-2">
                <span class="col-span-3 text-gray-500">Tình Trạng</span>
                <span class="col-span-9 text-gray-800">{{ product.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán' }}</span>
              </div>
              <div v-if="product.pre_order?.is_pre_order" class="grid grid-cols-12 py-2">
                <span class="col-span-3 text-gray-500">Đặt Trước</span>
                <span class="col-span-9 text-gray-800">Giao trong {{ product.pre_order.days_to_ship }} ngày</span>
              </div>
              <div class="grid grid-cols-12 py-2">
                <span class="col-span-3 text-gray-500">Đã Bán</span>
                <span class="col-span-9 text-gray-800">{{ product.total_sold.toLocaleString('vi-VN') }}</span>
              </div>
              <div v-for="(tier, idx) in product.tier_variants" :key="idx" class="grid grid-cols-12 py-2">
                <span class="col-span-3 text-gray-500">{{ tier.name }}</span>
                <span class="col-span-9 text-gray-800">{{ tier.options.join(', ') }}</span>
              </div>
            </div>

            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-700 mt-8 mb-4">Mô Tả Sản Phẩm</h2>
            <div class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{{ product.description }}</div>
          </div>

          <!-- Đánh giá sản phẩm -->
          <div class="bg-white p-6 shadow-sm">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-5">Đánh Giá Sản Phẩm</h2>

            <!-- Rating summary + filter bar -->
            <div class="border border-orange-100 bg-orange-50/40 rounded p-4 flex flex-col md:flex-row items-start gap-6 mb-6">
              <!-- Overall score -->
              <div class="flex flex-col items-center min-w-[90px]">
                <span class="text-5xl font-light text-primary leading-none">{{ reviewAvg }}</span>
                <span class="text-gray-400 text-xs mt-1">trên 5</span>
                <a-rate :value="Number(reviewAvg)" allow-half disabled class="mt-1" />
              </div>

              <!-- Filter buttons -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="f in reviewFilters"
                  :key="String(f.key)"
                  type="button"
                  class="px-3 py-1 text-sm border transition"
                  :class="activeReviewFilter === f.key
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'"
                  @click="setReviewFilter(f.key)"
                >
                  {{ f.label }}
                </button>
              </div>
            </div>

            <!-- Loading state (initial load) -->
            <div v-if="reviewsLoading && !reviews.length" class="py-10 flex justify-center">
              <a-spin :spinning="true" tip="Đang tải đánh giá..." />
            </div>

            <!-- Empty state -->
            <div v-else-if="!reviews.length && !reviewsLoading" class="py-10 text-center text-gray-400 text-sm">
              Chưa có đánh giá nào
            </div>

            <!-- Review list -->
            <div v-else class="divide-y divide-gray-100">
              <div v-for="review in reviews" :key="review.id" class="py-5">
                <div class="flex gap-3">
                  <!-- Avatar with fallback initial -->
                  <img
                    v-if="review.user_info.avatar"
                    :src="getImageUrl(review.user_info.avatar)"
                    :alt="review.user_info.username"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-200"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full flex-shrink-0 bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm"
                  >
                    {{ review.user_info.username.charAt(0).toUpperCase() }}
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm text-gray-800">{{ review.user_info.username }}</div>
                    <a-rate :value="review.star_rating" disabled class="text-xs" />
                    <div class="text-xs text-gray-400 mt-0.5">
                      {{ formatReviewDate(review.created_at) }}
                      <span v-if="review.product_variant" class="ml-2">
                        Phân loại hàng: {{ getVariantLabel(review.product_variant) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700 mt-2 leading-relaxed">{{ review.comment }}</p>

                    <!-- Review images -->
                    <div v-if="review.images?.length" class="flex flex-wrap gap-2 mt-3">
                      <img
                        v-for="(img, i) in review.images"
                        :key="i"
                        :src="getImageUrl(img)"
                        class="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-90 bg-gray-100"
                        alt=""
                      />
                    </div>

                    <!-- Likes row -->
                    <div class="flex items-center justify-between mt-3">
                      <button
                        type="button"
                        class="flex items-center gap-1.5 text-xs transition cursor-pointer"
                        :class="review.liked_by_current_user ? 'text-primary' : 'text-gray-400 hover:text-gray-600'"
                        @click="toggleLike(review)"
                      >
                        <iconify-icon
                          :icon="review.liked_by_current_user ? 'material-symbols:thumb-up' : 'material-symbols:thumb-up-outline'"
                          width="16" height="16"
                        ></iconify-icon>
                        <span>{{ review.like_count }}</span>
                      </button>
                      <button type="button" class="text-gray-300 hover:text-gray-500 transition" aria-label="Thêm tùy chọn">
                        <iconify-icon icon="material-symbols:more-vert" width="18" height="18"></iconify-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load more -->
            <div v-if="hasMoreReviews" class="mt-4 flex justify-center">
              <button
                type="button"
                :disabled="reviewsLoading"
                class="px-8 py-2 border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition disabled:opacity-50"
                @click="loadMoreReviews"
              >
                <a-spin v-if="reviewsLoading" :spinning="true" size="small" class="mr-2" />
                <span>Xem thêm đánh giá</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-3 bg-white shadow-sm p-4 sticky top-[150px]">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3 pb-2 border-b-2 border-primary">
            Top Sản Phẩm Nổi Bật
          </h3>
          <div v-if="sidebarLoading" class="space-y-4">
            <a-skeleton v-for="i in 4" :key="i" active :title="false" :paragraph="{ rows: 2 }" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="p in sidebarProducts"
              :key="p.id"
              class="flex gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition"
              @click="router.push({ name: 'ProductDetail', params: { productName: p.id } })"
            >
              <img
                :src="getImageUrl(p.images?.[0]?.url)"
                :alt="p.name"
                class="w-16 h-16 object-cover flex-shrink-0 bg-gray-100"
              />
              <div class="flex flex-col gap-1 min-w-0">
                <p class="text-xs text-gray-700 line-clamp-2 leading-4">{{ p.name }}</p>
                <span class="text-sm font-semibold text-primary">{{ currency(p.price_info.current_price) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center py-20">
      <p class="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm</p>
      <a-button @click="router.push('/product')">Quay lại danh sách</a-button>
    </div>

    <!-- ===== Hover lens zoom preview (Shopee-style, teleported to body) ===== -->
    <Teleport to="body">
      <div
        v-show="isHovering && !!imageRect"
        class="fixed border border-gray-200 shadow-2xl overflow-hidden pointer-events-none bg-white"
        style="z-index: 9999;"
        :style="zoomPreviewStyle"
      />
    </Teleport>

    <!-- ===== Fullscreen Image Viewer (Shopee-style) ===== -->
    <Teleport to="body">
      <Transition name="viewer-fade">
        <div
          v-if="zoomVisible"
          class="fixed inset-0 flex items-center justify-center select-none"
          style="background: rgba(0,0,0,0.86); z-index: 10000;"
          @click.self="zoomVisible = false"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition"
            @click="zoomVisible = false"
          >
            <iconify-icon icon="material-symbols:close" width="30" height="30"></iconify-icon>
          </button>

          <!-- ── Grouped: image + thumbnails side-by-side ──── -->
          <div class="flex items-stretch" style="max-height: 92vh; max-width: 95vw;">

            <!-- Main image with edge arrows -->
            <div class="relative flex items-center justify-center" style="min-width: 0;">
              <!-- Prev arrow -->
              <button
                v-if="product && product.images.length > 1"
                type="button"
                class="absolute left-0 inset-y-0 w-11 z-10 flex items-center justify-center bg-black/25 hover:bg-black/50 text-white transition"
                @click="zoomIndex = (zoomIndex - 1 + product.images.length) % product.images.length"
              >
                <left-circle-outlined style="font-size: 22px;" />
              </button>

              <img
                :src="zoomImageUrl"
                :alt="product?.name"
                class="block object-contain"
                style="max-height: 92vh; max-width: 72vw;"
                draggable="false"
              />

              <!-- Next arrow -->
              <button
                v-if="product && product.images.length > 1"
                type="button"
                class="absolute right-0 inset-y-0 w-11 z-10 flex items-center justify-center bg-black/25 hover:bg-black/50 text-white transition"
                @click="zoomIndex = (zoomIndex + 1) % product.images.length"
              >
                <right-circle-outlined style="font-size: 22px;" />
              </button>

              <!-- Counter -->
              <div
                v-if="product && product.images.length > 1"
                class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white/90 text-sm px-3 py-0.5 rounded-full tabular-nums"
              >
                {{ zoomIndex + 1 }} / {{ product.images.length }}
              </div>
            </div>

            <!-- ── Thumbnail panel – directly beside the image ── -->
            <div
              v-if="product && product.images.length > 1"
              class="w-[240px] flex-shrink-0 overflow-y-auto"
              style="max-height: 92vh; background: rgba(0,0,0,0.35); scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;"
            >
              <!-- Product name -->
              <p class="text-white/75 text-sm px-3 pt-3 pb-2 line-clamp-2 leading-snug border-b border-white/10">
                {{ product.name }}
              </p>
              <!-- Grid -->
              <div class="grid grid-cols-3 gap-1 p-2">
                <button
                  v-for="(img, idx) in product.images"
                  :key="idx"
                  type="button"
                  class="aspect-square overflow-hidden border-2 transition-all duration-150"
                  :class="zoomIndex === idx
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-55 hover:opacity-95 hover:border-white/40'"
                  @click="zoomIndex = idx"
                >
                  <img :src="getImageUrl(img.url)" class="w-full h-full object-cover" alt="" />
                </button>
              </div>
            </div>

          </div><!-- end grouped -->
        </div>
      </Transition>
    </Teleport>
  </a-spin>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue'
import { Product, productService } from '@/services/product/productService'
import { ProductReview, ReviewVariantInfo, reviewService } from '@/services/product/reviewService'
import { getAccessToken } from '@/core'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps<{ productId?: number | string }>()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(false)
const qty = ref(1)
const activeIndex = ref(0)
const selectedTiers = ref<(number | null)[]>([])
const showTierError = ref(false)

const sidebarProducts = ref<Product[]>([])
const sidebarLoading = ref(false)

// ── Image zoom state ──────────────────────────────────────────────────────────
// --- Fullscreen modal (click) ---
const zoomVisible = ref(false)
const zoomIndex = ref(0)

watch(zoomVisible, (open) => {
  if (open) zoomIndex.value = activeIndex.value
})

const zoomImageUrl = computed(() => {
  const imgs = product.value?.images
  if (!imgs?.length) return activeImage.value
  return `https://drive.google.com/thumbnail?id=${imgs[zoomIndex.value]?.url}&sz=w1200`
})

// Keyboard navigation for the fullscreen viewer
function onViewerKey(e: KeyboardEvent) {
  if (!zoomVisible.value || !product.value) return
  if (e.key === 'Escape') { zoomVisible.value = false; return }
  const len = product.value.images.length
  if (e.key === 'ArrowLeft')  zoomIndex.value = (zoomIndex.value - 1 + len) % len
  if (e.key === 'ArrowRight') zoomIndex.value = (zoomIndex.value + 1) % len
}
onMounted(()   => window.addEventListener('keydown', onViewerKey))
onUnmounted(() => window.removeEventListener('keydown', onViewerKey))

// --- Hover lens zoom (Shopee-style) ---
const LENS_SIZE = 150 // px — size of the lens square on the image

const isHovering = ref(false)
const lensX = ref(0)   // center of lens, relative to image container
const lensY = ref(0)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRect = ref<DOMRect | null>(null)

/** High-res URL for the zoom preview */
const activeImageHQ = computed(() => activeImage.value.replace('sz=w600', 'sz=w1200'))

function onImageHover(e: MouseEvent) {
  const el = imageContainerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  imageRect.value = rect
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const half = LENS_SIZE / 2
  lensX.value = Math.max(half, Math.min(rect.width - half, x))
  lensY.value = Math.max(half, Math.min(rect.height - half, y))
}

/** Position + size of the semi-transparent lens rectangle on the image */
const lensStyle = computed(() => ({
  width:  `${LENS_SIZE}px`,
  height: `${LENS_SIZE}px`,
  left:   `${lensX.value - LENS_SIZE / 2}px`,
  top:    `${lensY.value - LENS_SIZE / 2}px`,
}))

/** Position + background-* for the floating zoom preview panel (uses viewport coords) */
const zoomPreviewStyle = computed(() => {
  const rect = imageRect.value
  if (!rect) return {}
  const w = rect.width
  const h = rect.height
  const zf = w / LENS_SIZE   // zoom factor ≈ 3–4×

  // background-position: shift so the lens centre maps to the panel centre
  const bgX = -((lensX.value - LENS_SIZE / 2) * zf)
  const bgY = -((lensY.value - LENS_SIZE / 2) * zf)

  // Place the panel to the right of the image; fall back to left if off-screen
  const panelLeft = rect.right + 8 + w > window.innerWidth
    ? rect.left - w - 8
    : rect.right + 8

  return {
    left:               `${panelLeft}px`,
    top:                `${rect.top}px`,
    width:              `${w}px`,
    height:             `${h}px`,
    backgroundImage:    `url(${activeImageHQ.value})`,
    backgroundSize:     `${w * zf}px ${h * zf}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
    backgroundRepeat:   'no-repeat',
  }
})
// ─────────────────────────────────────────────────────────────────────────────

// ── Review state ─────────────────────────────────────────────────────────────
const REVIEW_PAGE_LIMIT = 5

const reviews = ref<ProductReview[]>([])
const reviewsLoading = ref(false)
const afterCursor = ref<string | null>(null)
const hasMoreReviews = ref(false)
const activeReviewFilter = ref<number | null>(null)

const reviewFilters = [
  { key: null,  label: 'Tất Cả' },
  { key: 5,     label: '5 Sao' },
  { key: 4,     label: '4 Sao' },
  { key: 3,     label: '3 Sao' },
  { key: 2,     label: '2 Sao' },
  { key: 1,     label: '1 Sao' },
]

const reviewAvg = computed(() => {
  if (!reviews.value.length) return '0'
  const sum = reviews.value.reduce((acc, r) => acc + r.star_rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

function getVariantLabel(variant: ReviewVariantInfo): string {
  if (!variant?.tierIndex?.length) return ''
  return variant.tierIndex
    .map((idx, i) => variant.tierVariations[i]?.options[idx - 1] ?? '')
    .filter(Boolean)
    .join(', ')
}

function formatReviewDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

async function loadReviews(reset = false) {
  if (!product.value) return
  if (reset) {
    reviews.value = []
    afterCursor.value = null
    hasMoreReviews.value = false
  }
  reviewsLoading.value = true
  try {
    const sentAfter = afterCursor.value
    const result = await reviewService.list(product.value.id, {
      limit: REVIEW_PAGE_LIMIT,
      ...(activeReviewFilter.value !== null && { star: activeReviewFilter.value }),
      ...(sentAfter ? { after: sentAfter } : {}),
    })
    reviews.value = reset ? result.reviews : [...reviews.value, ...result.reviews]
    if (result.after !== null && result.after !== sentAfter) {
      afterCursor.value = result.after
      hasMoreReviews.value = true
    } else {
      hasMoreReviews.value = false
    }
  } catch {
    // non-critical: reviews section failure shouldn't block the page
  } finally {
    reviewsLoading.value = false
  }
}

function loadMoreReviews() {
  loadReviews(false)
}

function setReviewFilter(key: number | null) {
  activeReviewFilter.value = key
  loadReviews(true)
}

async function toggleLike(review: ProductReview) {
  if (!getAccessToken()) {
    message.warning('Vui lòng đăng nhập để thích đánh giá')
    return
  }
  const wasLiked = review.liked_by_current_user
  review.liked_by_current_user = !wasLiked
  review.like_count += wasLiked ? -1 : 1
  try {
    if (wasLiked) {
      await reviewService.unlike(review.id)
    } else {
      await reviewService.like(review.id)
    }
  } catch {
    review.liked_by_current_user = wasLiked
    review.like_count += wasLiked ? 1 : -1
  }
}
// ─────────────────────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!props.productId) return

  // Ensure cart is loaded so cartQuantity is accurate from the start.
  // loadCart() is idempotent — skipped if already fetched.
  cartStore.loadCart()

  loading.value = true
  try {
    product.value = await productService.fetchById(Number(props.productId))
    loadReviews(true)
  } catch {
    message.error('Không tải được thông tin sản phẩm')
  } finally {
    loading.value = false
  }

  sidebarLoading.value = true
  try {
    const res = await productService.fetchByCondition({ limit: 5 })
    sidebarProducts.value = res.filter(p => p.id !== Number(props.productId))
  } catch {
    // sidebar failure is non-critical
  } finally {
    sidebarLoading.value = false
  }
})

watch(
  () => product.value,
  (p) => {
    if (p) {
      selectedTiers.value = p.tier_variants.map(() => null)
      qty.value = 1
      activeIndex.value = 0
      showTierError.value = false
    }
  },
  { immediate: true }
)

const getImageUrl = (id?: string) =>
  id ? `https://drive.google.com/thumbnail?id=${id}&sz=w600` : ''

// Google Drive IDs never contain hyphens; UUID strings from the API are not valid Drive IDs
const isDriveId = (url?: string) => !!url && !url.includes('-')

const activeImage = computed(() => {
  // When tier 0 is selected and its image is a valid Drive ID, show it as main image
  const tier0Sel = selectedTiers.value[0]
  if (tier0Sel !== null) {
    const tierImg = product.value?.tier_variants[0]?.images?.[tier0Sel]?.url
    if (isDriveId(tierImg)) return getImageUrl(tierImg)
  }
  const imgs = product.value?.images
  if (!imgs?.length) return ''
  return getImageUrl(imgs[activeIndex.value]?.url ?? imgs[0].url)
})

// API tier_index is 1-based: option at UI index 0 → tier_index value 1
const matchedVariant = computed(() => {
  const p = product.value
  if (!p?.product_variants?.length) return null
  if (selectedTiers.value.some(t => t === null)) return null
  return p.product_variants.find(v =>
    v.tier_index.every((apiIdx, pos) => apiIdx === (selectedTiers.value[pos]! + 1))
  ) ?? null
})

const priceRange = computed(() => {
  const variants = product.value?.product_variants
  if (!variants?.length) {
    const price = product.value?.price_info.current_price ?? 0
    return { min: price, max: price, isSingle: true }
  }
  const prices = variants.map(v => v.price_info.current_price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return { min, max, isSingle: min === max }
})

const displayPriceText = computed(() => {
  if (matchedVariant.value) return currency(matchedVariant.value.price_info.current_price)
  if (priceRange.value.isSingle) return currency(priceRange.value.min)
  return `${currency(priceRange.value.min)} – ${currency(priceRange.value.max)}`
})

/** Units of the selected variant (or product) already in the cart. */
const cartQuantity = computed(() => {
  const p = product.value
  if (!p) return 0
  if (matchedVariant.value) {
    const item = cartStore.rawItems.find(
      i => i.product_id === p.id && i.product_variant_id === matchedVariant.value!.id
    )
    return item?.quantity ?? 0
  }
  return cartStore.rawItems
    .filter(i => i.product_id === p.id)
    .reduce((sum, i) => sum + i.quantity, 0)
})

/** Raw stock — always shown as-is in "Còn X sản phẩm". */
const currentStock = computed(() =>
  matchedVariant.value
    ? matchedVariant.value.stock_quantity
    : (product.value?.stock_quantity ?? 0)
)

/** Maximum units the buyer can still add without exceeding stock. */
const maxAddable = computed(() => Math.max(0, currentStock.value - cartQuantity.value))

/** True when the qty selector has reached the addable ceiling. */
const showMaxQtyWarning = computed(() =>
  cartQuantity.value > 0 && qty.value + cartQuantity.value >= currentStock.value
)

const canPurchase = computed(() => {
  const hasTiers = (product.value?.tier_variants?.length ?? 0) > 0
  if (hasTiers) {
    return !!matchedVariant.value && currentStock.value > 0 && qty.value >= 1
  }
  return currentStock.value > 0 && qty.value >= 1
})

function isOptionAvailable(tierPos: number, optIdx: number): boolean {
  const p = product.value
  if (!p?.product_variants?.length) return true
  const apiIdx = optIdx + 1  // convert 0-based UI index to 1-based API tier_index
  return p.product_variants.some(v => {
    if (!v.tier_index?.length) return true
    if (v.tier_index[tierPos] !== apiIdx) return false
    for (let i = 0; i < selectedTiers.value.length; i++) {
      const sel = selectedTiers.value[i]
      if (i !== tierPos && sel !== null && v.tier_index[i] !== sel + 1) return false
    }
    return v.stock_quantity > 0
  })
}

function selectTier(tierPos: number, optIdx: number) {
  const updated = [...selectedTiers.value]
  updated[tierPos] = updated[tierPos] === optIdx ? null : optIdx
  selectedTiers.value = updated
  qty.value = 1
  // Reset thumbnail highlight when tier changes
  activeIndex.value = 0
}

function currency(n: number) {
  return n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
}

const addingToCart = ref(false)

function checkTierSelection(): boolean {
  const unselected = product.value?.tier_variants?.find((_, i) => selectedTiers.value[i] === null)
  if (unselected) {
    message.warning(`Vui lòng chọn ${unselected.name.toLowerCase()}`)
    return false
  }
  return true
}

function checkCartOverflow(): boolean {
  if (qty.value + cartQuantity.value > currentStock.value) {
    Modal.warning({
      title: 'Đã đạt giới hạn mua hàng',
      content: `Bạn đã có ${cartQuantity.value} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn tồn kho.`,
      okText: 'Đã hiểu',
      centered: true,
    })
    return false
  }
  return true
}

async function addToCart() {
  showTierError.value = true
  if (!canPurchase.value) {
    if (!checkTierSelection()) return
    message.warning('Sản phẩm hiện đã hết hàng')
    return
  }
  if (!checkCartOverflow() || !product.value) return
  addingToCart.value = true
  try {
    const variantId = matchedVariant.value?.id ?? 0
    await cartStore.addItem(product.value.id, variantId, qty.value)
    message.success('Đã thêm vào giỏ hàng')
  } catch {
    message.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
  } finally {
    addingToCart.value = false
  }
}

async function buyNow() {
  showTierError.value = true
  if (!canPurchase.value) {
    if (!checkTierSelection()) return
    message.warning('Sản phẩm hiện đã hết hàng')
    return
  }
  if (!checkCartOverflow() || !product.value) return
  addingToCart.value = true
  try {
    const variantId = matchedVariant.value?.id ?? 0
    await cartStore.addItem(product.value.id, variantId, qty.value)
    router.push('/cart')
  } catch {
    message.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
  } finally {
    addingToCart.value = false
  }
}
</script>

<style scoped>
:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: gray;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

/* Ant Design: smaller stars in stats and review rows */
:deep(.ant-rate) {
  font-size: 14px;
}

/* Fullscreen viewer fade transition */
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}
</style>
