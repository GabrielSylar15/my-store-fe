<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-2">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

      <aside class="lg:col-span-2 hidden lg:block">
        <div class="">
          <div class="px-1 py-3 font-semibold">
            <iconify-icon icon="charm:filter" width="12" height="12"></iconify-icon>
            BỘ LỌC TÌM KIẾM
          </div>

          <div class="px-1 py-3 space-y-3">
            <div class="pt-1">
              <div class="mb-2 text-sm">Theo danh mục</div>

              <div class="space-y-2">
                <a-checkbox
                    v-for="cat in visibleCats"
                    :key="cat.id"
                    @change="(e) => toggleCategory(cat.id, e.target.checked)"
                    :checked="selectedCats.includes(cat.id)"
                    class="ant-topalign mt-[40px]">
                  {{ cat.name }}
                </a-checkbox>
              </div>

              <button
                  v-if="categories.length > categoryLimit"
                  @click="openCats = !openCats"
                  class="mt-2 text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
                  type="button"
              >
                <span class="cursor-pointer">{{ openCats ? 'Thu gọn' : 'Thêm' }}</span>
                <svg class="w-3 h-3 transition-transform" :class="openCats ? 'rotate-180' : ''"
                     viewBox="0 0 20 20">
                  <path d="M5.25 7.5h9.5L10 13 5.25 7.5z"/>
                </svg>
              </button>
            </div>

            <div class="pt-3 border-t border-gray-200 ">
              <div class="mb-2 text-sm">Khoảng giá</div>

              <div class="flex items-center gap-1">
                <input placeholder="₫ TỪ"
                       @pressEnter="applyPrice"
                       v-model="priceFromInput"
                       class="border border-gray-300 w-[45%] px-1 py-1 text-sm"/>
                <span class="text-gray-400 text-sm">—</span>
                <input placeholder="₫ ĐẾN"
                       @pressEnter="applyPrice"
                       v-model="priceToInput"
                       class="border border-gray-300 w-[45%] px-1 py-1 text-sm"/>
              </div>

              <button @click="applyPrice" class="mt-3 bg-primary w-full py-1 text-white cursor-pointer">ÁP DỤNG</button>

              <div v-if="priceMin!==null || priceMax!==null" class="mt-2">
                <a-tag closable @close="clearPrice">₫{{ fmt(priceMin) }} - ₫{{ fmt(priceMax) }}</a-tag>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-200 ">
              <div class="mb-2 text-sm">Đánh giá</div>
              <div class="space-y-2">
                <ul class="space-y-2">
                  <li
                      v-for="r in [5,4,3,2,1]"
                      :key="r"
                      class="flex items-center cursor-pointer rating-row"
                      :class="{'rating-active': ratingAtLeast===r}"
                      @click="toggleRating(r)"
                  >
                    <!-- Render 5 sao -->
                    <template v-for="i in 5" :key="i">
                      <iconify-icon
                          v-if="i <= r"
                          icon="material-symbols:star"
                          width="18"
                          height="18"
                          class="text-yellow-400"
                      />
                      <iconify-icon
                          v-else
                          icon="material-symbols:star-outline"
                          width="18"
                          height="18"
                          class="text-yellow-400"
                      />
                    </template>
                    <span class="ml-2 text-sm text-gray-600">trở lên</span>
                  </li>
                </ul>

                <div v-if="ratingAtLeast" class="mt-2">
                  <a-tag closable @close="clearRating">{{ ratingAtLeast }}★ trở lên</a-tag>
                </div>
              </div>

            </div>
          </div>
        </div>
      </aside>

      <!-- MAIN -->
      <section class="lg:col-span-10">
        <!-- SORT BAR -->
        <div class="bg-[#ededed] mb-3">
          <div class="flex flex-col md:flex-row md:items-center gap-3 px-3 py-3">
            <div class="shrink-0 font-medium text-sm text-gray-500">Sắp xếp theo</div>
            <a-segmented @change="handleOrderProduct" v-model:value="sortKey" :options="['Liên Quan','Mới Nhất','Bán Chạy']"/>
            <a-dropdown>
              <a-button>
                Giá
                <svg class="h-4 w-4 ml-1 inline" viewBox="0 0 20 20">
                  <path d="M5.25 7.5h9.5L10 13 5.25 7.5z"/>
                </svg>
              </a-button>
              <template #overlay>
                <a-menu @click="onPriceSort">
                  <a-menu-item key="priceAsc">Giá: Thấp → Cao</a-menu-item>
                  <a-menu-item key="priceDesc">Giá: Cao → Thấp</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

            <div class="ml-auto">
              <a-pagination
                  size="small"
                  :total="filtered.length"
                  :pageSize="pageSize"
                  v-model:current="page"
                  show-less-items
              />
            </div>
          </div>
        </div>

        <!-- GRID -->
        <a-spin :spinning="loading" tip="Đang tải...">
          <!-- Khi loading: Skeleton lưới -->
          <div v-if="loading" class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <ProductCardSkeleton v-for="i in pageSize" :key="'sk-'+i"/>
          </div>

          <div v-else-if="paged.length" class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <ProductCard
                v-for="p in paged"
                :key="p.id"
                :product="p"
                @click="goDetail(p)"
            />
          </div>
        </a-spin>

        <!-- PAGINATION (BOTTOM) -->
        <div class="flex justify-end mt-5">
          <a-pagination
              :total="filtered.length"
              :pageSize="pageSize"
              v-model:current="page"
              show-less-items
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {message} from 'ant-design-vue'
import ProductCard from "@/components/inventory/ProductCard.vue";
import ProductCardSkeleton from "@/components/inventory/ProductCardSkeleton.vue";
import {Category, categoryService} from "@/services/product/categoryService";
import {FetchProductCondition, Product, productService} from "@/services/product/productService";
import {useSearchStore} from '@/stores/searchStore'
import {useRoute, useRouter} from "vue-router"; // <<-- THÊM useRouter

const products = ref<Product[]>([])
const loading = ref(false)
const categories = ref<Category[]>([])
const priceFromInput = ref<string>('')
const priceToInput = ref<string>('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const selectedCats = ref<number[]>([]) // <<-- danh sách category chọn

const sortKey = ref<'Liên Quan' | 'Mới Nhất' | 'Bán Chạy' | 'Giá'>('Liên Quan')
const priceOrder = ref<'asc' | 'desc' | null>(null)
let reqSeq = 0

const route = useRoute()
const router = useRouter() // <<-- KHỞI TẠO
const store = useSearchStore()

const filtered = computed(() => products.value)

const ordered = computed(() => {
  const out = [...filtered.value]
  if (priceOrder.value) {
    out.sort((a, b) =>
        priceOrder.value === 'asc'
            ? a.price_info.current_price - b.price_info.current_price
            : b.price_info.current_price - a.price_info.current_price
    )
  }
  return out
})

const page = ref(1)
const pageSize = 12
const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return ordered.value.slice(start, start + pageSize)
})

function onPriceSort(e: any) {
  if (e.key === 'priceAsc') priceOrder.value = 'asc'
  if (e.key === 'priceDesc') priceOrder.value = 'desc'
  sortKey.value = 'Giá'
}

function goDetail(p: Product) {
  router.push({ name: 'ProductDetail', params: { productName: p.id } })
}

const loadCategories = async () => {
  try {
    categories.value = await categoryService.fetchAll()
  } catch {
  }
}

const loadProducts = async (condition: FetchProductCondition = {}) => {
  const seq = ++reqSeq
  loading.value = true
  products.value = [] // <<-- ẩn kết quả cũ để chỉ hiện skeleton
  try {
    const res = await productService.fetchByCondition(condition)
    if (seq === reqSeq) products.value = res
  } catch {
    if (seq === reqSeq) message.error('Không tải được danh sách sản phẩm')
  } finally {
    if (seq === reqSeq) loading.value = false
  }
}

const categoryLimit = 8
const openCats = ref(false)
const visibleCats = computed(() =>
    openCats.value ? categories.value : categories.value.slice(0, categoryLimit)
)

const ratingAtLeast = ref<number | null>(null)

function parseVnd(s: string): number | null {
  if (!s) return null
  const n = Number(s.replace(/\D/g, ''))
  return Number.isFinite(n) ? n : null
}

function fmt(n: number | null) {
  if (n == null) return ''
  return n.toLocaleString('vi-VN')
}

function applyPrice() {
  const min = parseVnd(priceFromInput.value)
  const max = parseVnd(priceToInput.value)
  if (min != null && max != null && min > max) {
    message.warning('Giá TỪ phải nhỏ hơn hoặc bằng ĐẾN')
    return
  }
  priceMin.value = min
  priceMax.value = max
  page.value = 1
  router.replace({
    path: '/product',
    query: {
      ...route.query,
      price_from: min,
      price_to: max,
    },
  })
}

function clearPrice() {
  priceMin.value = priceMax.value = null
  priceFromInput.value = priceToInput.value = ''
  page.value = 1
}

function toggleRating(r: number) {
  ratingAtLeast.value = ratingAtLeast.value === r ? null : r
  page.value = 1
}

function clearRating() {
  ratingAtLeast.value = null
  page.value = 1
}

function handleOrderProduct(_key: string) {
  // TODO: wire sort to API condition
}

// <<-- CẬP NHẬT URL khi tick/untick category
function toggleCategory(catId: number, checked: boolean) {
  if (checked) {
    if (!selectedCats.value.includes(catId)) selectedCats.value.push(catId)
  } else {
    selectedCats.value = selectedCats.value.filter(id => id !== catId)
  }
  router.replace({
    path: '/product',
    query: {
      ...route.query,
      category_ids: selectedCats.value.length ? selectedCats.value.join(',') : undefined,
    },
  })
}

// <<-- WATCH 1: đọc category_ids từ URL để đồng bộ checkbox
watch(
    () => route.query,
    (val) => {
      const cats = route.query.category_ids;
      if (typeof cats === 'string' && cats.length) {
        selectedCats.value = cats.split(',').map(Number).filter(Boolean)
      } else {
        selectedCats.value = []
      }
      const priceFrom = route.query.price_from
      const priceTo = route.query.price_to
      if (priceFrom) priceFromInput.value = priceFrom.toString()
      if (priceTo) priceToInput.value = priceTo.toString()
    },
    {immediate: true}
)

// <<-- WATCH 2: mỗi khi URL (text/category_ids/…) đổi thì gọi API
watch(
    () => route.query,
    (q) => {
      const text = (q.text as string) || ''
      const cats = typeof q.category_ids === 'string'
          ? q.category_ids.split(',').map(Number).filter(Boolean)
          : []
      const priceInputFrom = typeof q.price_from === 'string' ? Number(q.price_from) : null
      const priceInputTo = typeof q.price_to === 'string' ? Number(q.price_to) : null
      // đồng bộ về store nếu muốn dùng nơi khác
      if (text !== store.text) store.setText(text)

      // gọi API
      loadProducts({
        text: text || undefined,
        category_ids: cats.length ? cats : undefined,
        price_from: priceInputFrom,
        price_to: priceInputTo
      })

      page.value = 1 // reset trang khi filter đổi
    },
    {immediate: true}
)

onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped>
/*noinspection CssUnusedSymbol*/
:deep(.ant-topalign.ant-checkbox-wrapper) {
  display: flex !important; /* override inline-flex mặc định */
  align-items: flex-start !important;
  margin-top: 8px;
}

/*noinspection CssUnusedSymbol*/
:deep(.ant-topalign .ant-checkbox) {
  align-self: flex-start;
  margin-top: 2px; /* tuỳ font có thể 1–3px */
}

/*noinspection CssUnusedSymbol*/
:deep(.ant-topalign .ant-checkbox + span) {
  display: block; /* QUAN TRỌNG */
  white-space: normal; /* cho phép xuống dòng */
  line-height: 1.25rem; /* khớp với .text-sm (leading-5) */
}

/* Ant Design: fix tag alignment and close icon spacing */
:deep(.ant-tag) {
  display: inline-flex;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
}

:deep(.ant-tag .anticon-close) {
  margin-left: 5px;
}
</style>
