<template>
  <a-modal
      :open="open"
      :footer="null"
      :width="720"
      :closable="false"
      centered
      @cancel="emit('close')"
  >
    <template #title>
      <span class="text-base font-medium">Chọn phương thức vận chuyển</span>
    </template>

    <!-- ===== Delivery type tiles ===== -->
    <div class="grid grid-cols-2 gap-3 mb-5">
      <button
          v-for="t in deliveryTypes"
          :key="t.value"
          class="delivery-tile"
          :class="{ active: deliveryType === t.value }"
          @click="deliveryType = t.value"
      >
        <iconify-icon :icon="t.icon" width="32" height="32"></iconify-icon>
        <div class="text-left">
          <p class="m-0 text-sm font-medium text-gray-800">{{ t.label }}</p>
          <p class="m-0 text-xs text-gray-500">Miễn phí</p>
        </div>
      </button>
    </div>

    <!-- ===== Method list ===== -->
    <p class="text-xs text-gray-500 font-medium tracking-wide mb-2 flex items-center gap-1">
      PHƯƠNG THỨC VẬN CHUYỂN LIÊN KẾT VỚI GIADE
      <iconify-icon icon="material-symbols:verified" width="14" height="14" class="text-primary"></iconify-icon>
    </p>

    <div class="border border-gray-100 rounded overflow-hidden">
      <button
          v-for="(m, i) in methods"
          :key="m.label"
          class="method-row w-full text-left px-4 py-4 flex items-start justify-between gap-4 transition cursor-pointer"
          :class="[
            selectedIdx === i ? 'bg-orange-50' : 'bg-[#fafafa] hover:bg-gray-100',
            m.disabled && 'opacity-60 cursor-not-allowed'
          ]"
          :disabled="m.disabled"
          @click="!m.disabled && (selectedIdx = i)"
      >
        <div class="flex-1 min-w-0">
          <p class="m-0 text-sm font-medium text-gray-800">{{ m.label }}</p>
          <p class="m-0 text-xs mt-1" :class="m.disabled ? 'text-primary' : 'text-gray-500'">
            {{ m.note }}
          </p>
        </div>
        <div class="text-right flex flex-col items-end gap-1 flex-shrink-0">
          <span class="text-sm text-gray-700">{{ currency(m.fee) }}</span>
          <iconify-icon
              v-if="selectedIdx === i && !m.disabled"
              icon="material-symbols:check-circle"
              width="20"
              height="20"
              class="text-primary"
          ></iconify-icon>
        </div>
      </button>
    </div>

    <!-- ===== Footer buttons ===== -->
    <div class="flex justify-end gap-2 mt-5">
      <a-button @click="emit('close')">Trở Lại</a-button>
      <a-button type="primary" :disabled="!canConfirm" @click="onConfirm">Xác Nhận</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface ShippingMethod {
  label: string
  fee: number
  eta: string
  note: string
  disabled?: boolean
}

const props = defineProps<{
  open: boolean
  methods: ShippingMethod[]
  selectedIndex: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', index: number): void
}>()

type DeliveryType = 'door' | 'pickup'
const deliveryTypes: { value: DeliveryType; label: string; icon: string }[] = [
  { value: 'door',   label: 'Giao hàng tận nơi', icon: 'mdi:truck-delivery-outline' },
  { value: 'pickup', label: 'Lấy hàng chủ động',  icon: 'mdi:package-variant-closed' },
]
const deliveryType = ref<DeliveryType>('door')

const selectedIdx = ref(props.selectedIndex)

watch(
  () => [props.open, props.selectedIndex] as const,
  ([open, idx]) => { if (open) selectedIdx.value = idx }
)

const canConfirm = () => {
  const m = props.methods[selectedIdx.value]
  return !!m && !m.disabled
}

const onConfirm = () => {
  if (!canConfirm()) return
  emit('select', selectedIdx.value)
}

const currency = (n: number) =>
  n === 0 ? 'Miễn phí'
    : n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
</script>

<style scoped>
.delivery-tile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all .15s;
  color: #6b7280;
}
.delivery-tile:hover {
  border-color: #d1d5db;
}
.delivery-tile.active {
  border-color: var(--color-primary, #e30707);
  color: var(--color-primary, #e30707);
  background: #fff;
}
.delivery-tile.active :deep(iconify-icon) {
  color: var(--color-primary, #e30707);
}

.method-row + .method-row {
  border-top: 1px solid #f3f4f6;
}
</style>
