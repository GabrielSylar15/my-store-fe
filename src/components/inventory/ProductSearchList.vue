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
                       class="border border-gray-300 w-[45%] px-1 py-1 text-sm"/>
                <span class="text-gray-400 text-sm">—</span>
                <input placeholder="₫ ĐẾN"
                       @pressEnter="applyPrice"
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
            <a-segmented v-model:value="sortKey" :options="['Liên Quan','Mới Nhất','Bán Chạy']"/>
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
import {Category, categoryService} from "@/services/product/categoryService";
import {FetchProductCondition, Product, productService} from "@/services/product/productService";
import {useSearchStore} from '@/stores/searchStore'
import {useRoute} from "vue-router";
import ProductCardSkeleton from "@/components/inventory/ProductCardSkeleton.vue";

const products = ref<Product[]>([])
const loading = ref(false)            // <<-- NEW
const categories = ref<Category[]>([])
const priceFromInput = ref<string>('')   // text ở ô input
const priceToInput = ref<string>('')   // text ở ô input
const priceMin = ref<number | null>(null)  // giá trị đã apply
const priceMax = ref<number | null>(null)

const sortKey = ref<'Liên Quan' | 'Mới Nhất' | 'Bán Chạy' | 'Giá'>('Liên Quan')
const priceOrder = ref<'asc' | 'desc' | null>(null)
let reqSeq = 0

const filtered = computed(() => {
  // chỗ này bạn cắm điều kiện filter thực sự (theo sidebar)
  return products.value
})

const ordered = computed(() => {
  let out = [...filtered.value]
  if (priceOrder.value) {
    out.sort((a, b) => priceOrder.value === 'asc' ? a.price_info.current_price - b.price_info.current_price : b.price_info.current_price - a.price_info.current_price)
    return out
  }
  return out
})

const route = useRoute()
const store = useSearchStore()
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
  message.info(`Xem chi tiết: ${p.name}`)
}

const loadCategories = async () => {
  try {
    categories.value = await categoryService.fetchAll()
  } catch (err: any) {
  }
}

const loadProducts = async (condition: FetchProductCondition = {}) => {
  const seq = ++reqSeq                 // đánh dấu request hiện tại
  loading.value = true
  try {
    const res = await productService.fetchByCondition(condition)
    if (seq === reqSeq) {              // chỉ nhận kết quả mới nhất
      products.value = res
    }
  } catch (err: any) {
    if (seq === reqSeq) {
      message.error('Không tải được danh sách sản phẩm')
    }
  } finally {
    if (seq === reqSeq) {
      loading.value = false
    }
  }
}

const categoryLimit = 8
const openCats = ref(false)
const visibleCats = computed(() =>
    openCats.value ? categories.value : categories.value.slice(0, categoryLimit)
)

const ratingAtLeast = ref<number | null>(null)

// Parse số từ chuỗi "₫", dấu chấm,… -> số nguyên VND
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

watch(
    () => route.query.text,
    (t) => {
      const q = (t as string) || ''
      loadProducts({text: q || undefined})
      // đồng bộ về store nếu bạn muốn
      if (q !== store.text) store.setText(q)
    },
    {immediate: true}
)

onMounted(async () => {
  const qp = route.query.text
  const fromUrl = Array.isArray(qp) ? qp[0] : (qp as string) || ''

  if (fromUrl && fromUrl !== store.text) {
    store.setText(fromUrl)
  }

  await Promise.all([
    loadCategories(),
    loadProducts({text: fromUrl || store.text || undefined}) // truyền STRING, không phải ref
  ])
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
</style>
