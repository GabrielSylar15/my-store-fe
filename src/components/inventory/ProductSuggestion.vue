<template>
  <div class="border-b-3 border-b-primary">
    <div class="flex justify-center items-center bg-background-component">
      <h2 class="text-lg font-500 pl-6 py-3 text-primary text-center">GỢI Ý HÔM NAY</h2>
    </div>
    <div v-if="isLoading" class="text-gray-500">Đang tải sản phẩm...</div>
    <div v-else-if="error" class="text-red-500">Lỗi: {{ error.message }}</div>

    <div class="relative overflow-hidden border-t-3 border-t-primary">
      <div class="mt-4">
        <div
            v-for="(row, rIdx) in chunkBy<Product>(products, 6)"
            :key="`row-${rIdx}`"
            class="grid grid-cols-6 gap-3 mb-4"
        >
          <!-- Mỗi CARD -->
          <div
              v-for="product in row"
              :key="product.id"
              class="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
          >
            <!-- góc % giảm (nếu cần) -->
            <div
                v-if="0"
                class="absolute right-0 top-0 z-10 text-[12px] font-semibold text-white bg-red-500 px-2 py-1 rounded-bl-lg"
            >
              -{{ 0 }}%
            </div>

            <div class="h-[180px] w-full flex items-center justify-center bg-white">
              <img
                  v-if="product.images?.[0]?.url"
                  :src="getImageUrl(product.images[0].url)"
                  alt="Ảnh sản phẩm"
                  class="max-h-[170px] object-contain"
                  loading="lazy"
              />
            </div>

            <div class="p-2">
              <h3 class="text-[14px] leading-5 text-gray-800 line-clamp-2" :title="product.name">
                {{ product.name }}
              </h3>

              <div class="mt-1 min-h-[20px] flex items-center">
<!--                <span v-if="product.price_info?.current_price"-->
<!--                      class="discount-badge">-->
<!--                  Giảm {{ product.price_info.current_price }}-->
<!--                </span>-->
                <span class="bg-[#ff9800] text-red-800 text-xs font-medium me-2 px-1 py-0.5 rounded-sm">
                  Giảm {{ product.price_info.current_price }}%

                </span>

              </div>

              <div class="mt-2 flex items-center justify-between">
                <span class="text-primary text-[16px] font-semibold">
                  {{ formatPrice({v: product.price_info.current_price}) }}
                </span>
                <span class="text-[12px] text-gray-500">
                  Đã bán {{ formatSold({v: product.total_sold}) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!products.length && !isLoading" class="text-center text-gray-500">
          Không có sản phẩm nào để hiển thị.
        </div>
      </div>
    </div>

    <div class="mt-5 flex justify-center mb-15">
      <button
          type="button"
          class="min-w-[360px] px-5 py-2.5 text-sm font-medium text-gray-700
           bg-background-component border border-gray-200 rounded
           hover:bg-gray-100">
        Xem thêm
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {Product, productService} from '@/services/product/productService'

const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)


const getImageUrl = (id: string) =>
    `https://drive.google.com/thumbnail?id=${id}`

const loadProducts = async () => {
  isLoading.value = true
  try {
    products.value = await productService.fetchByCondition({
      // "suggestion_type": "hot search",
      "limit": 36
    });
  } catch (err: any) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

const formatPrice = ({v}: { v: any }) => {
  if (v == null) return '';
  try {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 0}).format(v);
  } catch {
    return v;
  }
}

const formatSold = ({v}: { v: any }) => {
  if (v == null) return 0;
  if (v >= 10000) return (v / 1000).toFixed(0) + 'k+';
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  return v;
}

const chunkBy = <T>(arr: T[], size: number): T[][] => {
  if (!Array.isArray(arr) || size <= 0) return [arr ?? []] as T[][];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};
onMounted(loadProducts)
</script>
