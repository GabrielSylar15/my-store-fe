<template>
  <a-modal
      :open="open"
      :footer="null"
      :width="640"
      :closable="false"
      centered
      @cancel="emit('close')"
  >
    <template #title>
      <div class="flex items-center justify-between pr-6">
        <span class="text-base font-medium">Chọn GIADE Voucher</span>
        <span class="text-sm text-gray-500 cursor-pointer hover:text-primary flex items-center gap-1">
          Hỗ Trợ
          <iconify-icon icon="material-symbols:help-outline" width="14" height="14"></iconify-icon>
        </span>
      </div>
    </template>

    <!-- ===== Code input ===== -->
    <div class="flex items-center gap-3 bg-[#fafafa] border border-gray-100 rounded px-4 py-3 mb-5">
      <span class="text-sm text-gray-600 flex-shrink-0">Mã Voucher</span>
      <a-input v-model:value="code" placeholder="Mã GIADE Voucher" />
      <a-button
          type="primary"
          :disabled="!code.trim()"
          @click="onApplyCode"
      >
        ÁP DỤNG
      </a-button>
    </div>

    <!-- ===== Voucher group: free shipping ===== -->
    <p class="text-sm font-medium text-gray-800 m-0">Mã Miễn Phí Vận Chuyển</p>
    <p class="text-xs text-gray-500 mb-3 mt-1">Có thể chọn 1 Voucher</p>

    <div class="max-h-[360px] overflow-y-auto pr-1 space-y-3">
      <button
          v-for="v in vouchers"
          :key="v.id"
          class="voucher-card w-full text-left transition cursor-pointer"
          :class="{ disabled: v.disabled, selected: selectedId === v.id }"
          :disabled="v.disabled"
          @click="!v.disabled && (selectedId = v.id)"
      >
        <div class="flex">
          <!-- left tile -->
          <div
              class="voucher-tile flex flex-col items-center justify-center px-4 py-3 text-white relative flex-shrink-0"
              :class="v.kind === 'freeship' ? 'bg-[#26AAA4]' : 'bg-primary'"
          >
            <span v-if="v.city" class="city-tag">{{ v.city }}</span>
            <p v-if="v.kind === 'freeship'" class="m-0 font-bold text-lg leading-none">FREE</p>
            <p v-if="v.kind === 'freeship'" class="m-0 font-bold text-lg leading-none">SHIP</p>
            <p v-else class="m-0 font-bold text-lg leading-none">GIẢM<br/>GIÁ</p>
            <p class="m-0 text-[10px] mt-1 text-center leading-tight px-1">{{ v.tileNote }}</p>
          </div>

          <!-- body -->
          <div class="flex-1 px-4 py-3 min-w-0 relative">
            <p class="m-0 text-sm font-medium text-gray-800">{{ v.title }}</p>
            <p class="m-0 text-sm text-gray-600 mt-0.5">Đơn Tối Thiểu {{ currency(v.minOrder) }}</p>
            <a-tag class="!mt-1.5 !text-xs" color="orange">{{ v.tag }}</a-tag>
            <p class="m-0 text-xs text-gray-500 mt-1.5">
              <template v-if="v.usagePercent">Đã dùng {{ v.usagePercent }}%, </template>
              HSD: {{ v.expiry }}
              <a class="text-sky-500 ml-1">Điều Kiện</a>
            </p>
            <!-- usage bar -->
            <div v-if="v.usagePercent" class="usage-bar mt-1.5">
              <div class="usage-bar-fill" :style="{ width: v.usagePercent + '%' }"></div>
            </div>
            <span v-if="v.stockLabel" class="stock-pill">{{ v.stockLabel }}</span>
          </div>

          <!-- radio -->
          <div class="flex items-center justify-center px-4 flex-shrink-0">
            <a-radio :checked="selectedId === v.id" :disabled="v.disabled" />
          </div>
        </div>

        <p v-if="v.disabled && v.disabledReason" class="disabled-banner">
          <iconify-icon icon="material-symbols:info-outline" width="14" height="14"></iconify-icon>
          {{ v.disabledReason }}
        </p>
      </button>
    </div>

    <!-- ===== Footer ===== -->
    <div class="flex justify-end gap-2 mt-5">
      <a-button @click="emit('close')">TRỞ LẠI</a-button>
      <a-button type="primary" @click="onConfirm">ĐỒNG Ý</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { currency } from '@/helpers/format'

export interface Voucher {
  id: string
  kind: 'freeship' | 'discount'
  title: string         // e.g. "Giảm tối đa 100k"
  tileNote: string      // text below "FREE SHIP" on tile
  minOrder: number
  discount: number      // monetary discount applied
  tag: string           // small orange tag e.g. "Freeship hỏa tốc"
  expiry: string        // "31.05.2026"
  city?: string         // small left-top pill e.g. "Hà Nội"
  usagePercent?: number // e.g. 93
  stockLabel?: string   // e.g. "x5"
  disabled?: boolean
  disabledReason?: string
}

const props = defineProps<{
  open: boolean
  selectedId: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', v: Voucher | null): void
}>()

const code = ref('')
const selectedId = ref<string | null>(props.selectedId)

// Mock voucher list
const vouchers = ref<Voucher[]>([
  {
    id: 'fs-100',
    kind: 'freeship',
    title: 'Giảm tối đa 100k',
    tileNote: 'Tất cả hình thức thanh toán',
    minOrder: 100000,
    discount: 30000,
    tag: 'Freeship hỏa tốc',
    expiry: '31.05.2026',
    stockLabel: 'x5',
    disabled: true,
    disabledReason: 'Vui lòng mua hàng trên ứng dụng GIADE để sử dụng ưu đãi.',
  },
  {
    id: 'fs-101',
    kind: 'freeship',
    title: 'Giảm tối đa 101k',
    tileNote: 'Tất cả hình thức thanh toán',
    minOrder: 0,
    discount: 20000,
    tag: 'Freeship vận chuyển Trong Ngày',
    expiry: '31.05.2026',
    city: 'Hà Nội',
    usagePercent: 93,
    stockLabel: 'x10',
  },
  {
    id: 'gg-10',
    kind: 'discount',
    title: 'Giảm 10.000đ',
    tileNote: 'Cho đơn từ 50.000đ',
    minOrder: 50000,
    discount: 10000,
    tag: 'Toàn ngành hàng',
    expiry: '30.06.2026',
  },
])

watch(() => [props.open, props.selectedId] as const, ([open, id]) => {
  if (open) {
    selectedId.value = id
    code.value = ''
  }
})

const onApplyCode = () => {
  const c = code.value.trim().toUpperCase()
  if (!c) return
  // Mock: GIAM10K adds a discount voucher
  if (c === 'GIAM10K' && !vouchers.value.some(v => v.id === 'code-giam10k')) {
    vouchers.value.unshift({
      id: 'code-giam10k',
      kind: 'discount',
      title: 'Giảm 10.000đ (Mã của bạn)',
      tileNote: 'Áp dụng toàn shop',
      minOrder: 0,
      discount: 10000,
      tag: 'Mã đã nhập',
      expiry: '31.12.2026',
    })
    selectedId.value = 'code-giam10k'
    message.success('Áp dụng voucher thành công')
  } else {
    message.error('Mã không hợp lệ hoặc đã hết hạn')
  }
}

const onConfirm = () => {
  const found = vouchers.value.find(v => v.id === selectedId.value) ?? null
  emit('select', found)
}
</script>

<style scoped>
.voucher-card {
  display: block;
  width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  padding: 0;
}
.voucher-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}
.voucher-card.disabled {
  cursor: not-allowed;
}
.voucher-card.disabled .voucher-tile {
  filter: grayscale(0.4) opacity(0.85);
}

.voucher-tile {
  width: 120px;
  min-height: 96px;
  background-image:
      radial-gradient(circle at right top, transparent 6px, currentColor 6px) 0 0/14px 14px,
      radial-gradient(circle at right bottom, transparent 6px, currentColor 6px) 0 100%/14px 14px;
}

.city-tag {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.35);
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-bottom-right-radius: 4px;
}

.stock-pill {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #fdecec;
  color: var(--color-primary);
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
}

.usage-bar {
  height: 3px;
  background: #fde7c5;
  border-radius: 999px;
  overflow: hidden;
  max-width: 220px;
}
.usage-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f7c067, #f59e0b);
}

.disabled-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fffbe8;
  color: #b45309;
  font-size: 12px;
  padding: 6px 10px;
  margin: 0;
  border-top: 1px solid #fde68a;
}
</style>
