<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-2">
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item><a href="">GIADE</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">Quần áo</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">Áo polo</a></a-breadcrumb-item>
        <a-breadcrumb-item>Áo polo coolmate</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-5 mt-3 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Left: gallery -->
      <div class="mt-4 lg:col-span-4 md:grid-cols-2 gap-6">
        <div
            class="aspect-square w-full overflow-hidde bg-gray-50 flex items-center justify-center"
        >
          <img
              :src="activeImage"
              :alt="product.name"
              class="max-h-full max-w-full object-contain"
          />
        </div>
        <!-- Thumbnails carousel -->
        <div class="mt-3">
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
                <left-circle-outlined/>
              </div>
            </template>
            <template #nextArrow>
              <div class="custom-slick-arrow" style="right: -10px">
                <right-circle-outlined/>
              </div>
            </template>
            <div v-for="(img, idx) in product.images" :key="img" class="px-1 gap-2">
              <button
                  class="w-24 h-24 flex-shrink-0 border-2 border-gray-200 transition hover:border-primary hover:shadow"
                  :class="activeIndex === idx ? 'border-primary' : 'border-gray-200'"
                  @mouseenter="activeIndex = idx"
              >
                <img :src="img" class="h-full w-full object-cover rounded-lg" alt=""/>
              </button>
            </div>
          </a-carousel>
        </div>

      </div>
      <!-- Right: info + chọn biến thể -->
      <div class="flex lg:col-span-8 flex-col gap-5 ml-8">
        <div class="flex flex-col gap-2 mt-5">
          <h1 class="text-xl md:text-2xl">
            {{ product.name }}
          </h1>
          <div class="flex items-center gap-3 text-sm">
            <a-rate :value="product.rating" allow-half disabled/>
            <span class="text-gray-500">({{ product.reviewCount.toLocaleString() }} đánh giá)</span>
            <span class="h-4 w-px bg-gray-200"></span>
            <span class="text-gray-600">{{ product.sold.toLocaleString() }}+ đã bán</span>
          </div>
        </div>
        <!-- Giá -->
        <div class="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <div class="text-2xl md:text-3xl font-bold text-red-600">
            {{ formatCurrency(priceAfterDiscount) }}
          </div>
          <div class="text-gray-400 line-through" v-if="currentVariant?.price">
            {{ formatCurrency(currentVariant.price) }}
          </div>
          <a-tag v-if="discountPercent > 0" color="red">
            -{{ discountPercent }}%
          </a-tag>
        </div>

        <!-- Màu -->
        <div>
          <div class="grid grid-cols-12 items-start gap-4">
            <div class="col-span-2 text-md text-gray-500 mb-2 tracking-wide flex items-center">
              Màu
            </div>

            <div class="col-span-10 flex flex-wrap gap-2">
              <a-tooltip
                  v-for="c in product.colors"
                  :key="c.code"
                  :title="c.name"
              >
                <button
                    class="px-3 py-2 border text-sm flex items-center gap-2 hover:shadow transition"
                    :class="selectedColor === c.code ? 'border-primary ring-2 ring-primary/40' : 'border-gray-200'"
                    @click="selectColor(c.code)"
                >
                  <span class="inline-block h-4 w-4 border" :style="{ background: c.hex }"></span>
                  <span>{{ c.name }}</span>
                </button>
              </a-tooltip>
            </div>
          </div>

          <p v-if="!selectedColor" class="text-xs text-red-500 mt-1">
            Vui lòng chọn màu
          </p>
        </div>


        <div>
          <div class="grid grid-cols-12 items-start gap-4">
            <div class="col-span-2 text-md text-gray-500 mb-2 tracking-wide flex items-center">
              Kích cỡ
            </div>

            <div class="col-span-10 flex flex-wrap gap-2">

              <a-radio-group v-model:value="selectedSize" class="flex flex-wrap gap-2">
                <a-radio-button
                    v-for="s in sizeOptions"
                    :key="s"
                    :value="s"
                    :disabled="!isSizeAvailable(s)"
                >
                  {{ s }}
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>

          <p v-if="!selectedSize" class="text-xs text-red-500 mt-1">Vui lòng chọn size</p>
        </div>

        <!-- Tồn kho + số lượng -->
        <div>
          <div class="grid grid-cols-12 items-start gap-4">
            <div class="col-span-2 text-md text-gray-500 mb-2 tracking-wide flex items-center">
              Số lượng
            </div>

            <div class="col-span-10 flex flex-wrap gap-2">
              <a-input-number
                  size="large"
                  v-model:value="qty"
                  :min="1"
                  :max="currentVariant?.stock || 1"
              />
              <div class="text-gray-600 text-md">
                <span class="text-gray-500">Còn hàng </span>
                <b>{{ currentVariant?.stock ?? 0 }}</b>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
              :disabled="!canPurchase"
              @click="emitAddToCart"
              class="mt-3
         hover:bg-[#fff1f4]
         bg-[#fdebed]
         py-1
         cursor-pointer w-52 h-12 border
         border-primary text-primary
         flex items-center justify-center gap-2"
          >
            <iconify-icon icon="iconoir:add-to-cart" width="20" height="20"></iconify-icon>
            Thêm vào giỏ hàng
          </button>

          <a-button
              type="primary"
              class="h-11 px-7 rounded-xl"
              :disabled="!canPurchase"
              @click="emitBuyNow"
          >
            Mua ngay
          </a-button>
        </div>

        <!-- Cam kết / vận chuyển / voucher (demo) -->
        <div class="pt-3 border-t text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2">
            <span class="i-lucide-shield-check h-5 w-5"></span>
            Miễn phí trả hàng 15 ngày
          </div>
          <div class="flex items-center gap-2">
            <span class="i-lucide-truck h-5 w-5"></span>
            Miễn phí vận chuyển cho đơn từ 0đ
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {message} from 'ant-design-vue'
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons-vue';

/** ---------- Types ---------- */
type Size = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL'

interface ProductColor {
  code: string
  name: string
  hex: string
}

interface Variant {
  colorCode: string
  size: Size
  price: number        // giá gốc
  discount: number     // 0..1  (vd 0.11 = -11%)
  stock: number
  images?: string[]
}

interface ProductDetail {
  id: string
  name: string
  images: string[]
  rating: number
  reviewCount: number
  sold: number
  colors: ProductColor[]
  sizes: Size[]
  variants: Variant[]
}

/** ---------- Props & Emits ---------- */
const props = defineProps<{
  product?: ProductDetail
}>()

const emits = defineEmits<{
  (e: 'add-to-cart', payload: { productId: string; variant: Variant; qty: number }): void
  (e: 'buy-now', payload: { productId: string; variant: Variant; qty: number }): void
  (e: 'change-variant', payload: { color?: string; size?: Size; variant?: Variant | null }): void
}>()

/** ---------- Mock (fallback nếu chưa truyền props.product) ---------- */
const mockProduct: ProductDetail = {
  id: 'coolmate-tee-220gsm',
  name: 'Áo thun nam TShirt Basic Cotton 100% 220gsm dày dặn mềm mại',
  images: [
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX',
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX',
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX',
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX',
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX',
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX',
    'https://drive.google.com/thumbnail?id=1sV1Ztb0yrUFuLZxArRMLMcXK8BJ9n1EX'
  ],
  rating: 4.9,
  reviewCount: 9500,
  sold: 90000,
  colors: [
    {code: 'den', name: 'Đen', hex: '#111111'},
    {code: 'nau', name: 'Nâu', hex: '#8b5e3c'},
    {code: 'trang', name: 'Trắng', hex: '#f9f9f9'},
    {code: 'xanhmint', name: 'Xanh Mint', hex: '#c7f0e9'}
  ],
  sizes: ['S', 'M', 'L', 'XL', '2XL'],
  variants: [
    {colorCode: 'den', size: 'S', price: 179000, discount: 0.11, stock: 12},
    {colorCode: 'den', size: 'M', price: 179000, discount: 0.11, stock: 0},
    {colorCode: 'den', size: 'L', price: 179000, discount: 0.11, stock: 6},
    {colorCode: 'nau', size: 'M', price: 179000, discount: 0.11, stock: 14},
    {colorCode: 'trang', size: 'L', price: 179000, discount: 0.11, stock: 50},
    {colorCode: 'xanhmint', size: 'S', price: 179000, discount: 0.11, stock: 3},
    {colorCode: 'xanhmint', size: 'M', price: 179000, discount: 0.11, stock: 0},
    {colorCode: 'xanhmint', size: 'L', price: 179000, discount: 0.11, stock: 9}
  ]
}

const product = computed<ProductDetail>(() => props.product ?? mockProduct)

/** ---------- State ---------- */
const selectedColor = ref<string | null>(null)
const selectedSize = ref<Size | null>(null)
const qty = ref<number>(1)

const activeIndex = ref(0)
const activeImage = computed(() => {
  const imgs = currentVariant.value?.images?.length ? currentVariant.value.images : product.value.images
  return imgs[activeIndex.value] ?? imgs[0]
})

/** ---------- Helpers ---------- */
const sizeOptions = computed<Size[]>(() => product.value.sizes)

const currentVariant = computed<Variant | null>(() => {
  if (!selectedColor.value || !selectedSize.value) return null
  return product.value.variants.find(
      v => v.colorCode === selectedColor.value && v.size === selectedSize.value
  ) ?? null
})

const discountPercent = computed(() => {
  const d = currentVariant.value?.discount ?? 0
  return Math.round(d * 100)
})

const priceAfterDiscount = computed(() => {
  const v = currentVariant.value
  if (!v) return 0
  return Math.round(v.price * (1 - (v.discount ?? 0)))
})

function isSizeAvailable(size: Size) {
  if (!selectedColor.value) return false
  return product.value.variants.some(v => v.colorCode === selectedColor.value && v.size === size && v.stock > 0)
}

function selectColor(code: string) {
  selectedColor.value = code
  // reset size nếu size hiện tại không còn hợp lệ
  if (selectedSize.value && !isSizeAvailable(selectedSize.value)) {
    selectedSize.value = null
  }
  emits('change-variant', {color: code, size: selectedSize.value ?? undefined, variant: currentVariant.value})
}

const canPurchase = computed(() => !!currentVariant.value && (currentVariant.value!.stock > 0) && qty.value >= 1)

function emitAddToCart() {
  if (!canPurchase.value || !currentVariant.value) {
    return message.warning('Vui lòng chọn màu, size và số lượng hợp lệ')
  }
  emits('add-to-cart', {productId: product.value.id, variant: currentVariant.value, qty: qty.value})
  message.success('Đã thêm vào giỏ')
}

function emitBuyNow() {
  if (!canPurchase.value || !currentVariant.value) {
    return message.warning('Vui lòng chọn màu, size và số lượng hợp lệ')
  }
  emits('buy-now', {productId: product.value.id, variant: currentVariant.value, qty: qty.value})
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 0}).format(v)
}

/** ---------- Watch để cập nhật ảnh khi đổi biến thể ---------- */
watch(currentVariant, (nv) => {
  activeIndex.value = 0
  emits('change-variant', {color: selectedColor.value ?? undefined, size: selectedSize.value ?? undefined, variant: nv})
})
</script>

<style scoped>
/*noinspection CssUnusedSymbol*/
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

/*noinspection CssUnusedSymbol*/
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

.ant-input-number {
  border-radius: 0
}

.ant-input-number-input {
  border-radius: 0
}
</style>
