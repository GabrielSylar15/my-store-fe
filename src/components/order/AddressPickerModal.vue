<template>
  <a-modal
      :open="open"
      title="Địa Chỉ Của Tôi"
      :footer="null"
      :width="640"
      centered
      @cancel="emit('close')"
  >
    <div v-if="addresses.length === 0" class="py-10 text-center text-gray-400">
      Bạn chưa có địa chỉ nào.
    </div>

    <a-radio-group :value="selectedId" class="w-full" @change="onPick">
      <div
          v-for="addr in addresses"
          :key="addr.id"
          class="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0"
      >
        <a-radio :value="addr.id" class="!flex !items-start">
          <div class="ml-1">
            <p class="text-sm font-medium text-gray-800">
              {{ addr.full_name }}
              <span class="text-gray-400 font-normal ml-2">({{ formatPhone(addr.phone_number) }})</span>
              <a-tag v-if="addr.is_default" color="red" class="ml-2">Mặc định</a-tag>
            </p>
            <p class="text-sm text-gray-600 mt-1">
              {{ addr.address }}, {{ addr.district }}, {{ addr.city }}
            </p>
          </div>
        </a-radio>
        <div class="flex flex-col items-end gap-2 flex-shrink-0">
          <button class="text-primary hover:text-primary-dark text-sm cursor-pointer" @click="emit('edit', addr)">
            Cập nhật
          </button>
          <button
              v-if="!addr.is_default"
              class="text-gray-500 hover:text-primary text-xs cursor-pointer"
              @click="onRemove(addr.id)"
          >
            Xóa
          </button>
        </div>
      </div>
    </a-radio-group>

    <div class="mt-4">
      <a-button block @click="emit('add')">
        <template #icon><iconify-icon icon="material-symbols:add" width="16" height="16"></iconify-icon></template>
        Thêm Địa Chỉ Mới
      </a-button>
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <a-button @click="emit('close')">Hủy</a-button>
      <a-button type="primary" :disabled="!selectedId" @click="onConfirm">Xác Nhận</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { addressService, type UserAddress } from '@/services/user/addressService'
import { formatPhone } from '@/helpers/format'

const props = defineProps<{
  open: boolean
  currentId: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add'): void
  (e: 'edit', address: UserAddress): void
  (e: 'select', address: UserAddress): void
}>()

const addresses = ref<UserAddress[]>([])
const selectedId = ref<number | null>(null)


const load = async () => {
  addresses.value = await addressService.list()
  selectedId.value = props.currentId ?? addresses.value.find(a => a.is_default)?.id ?? null
}

watch(() => props.open, open => { if (open) load() })

const onPick = (e: any) => { selectedId.value = e.target.value }

const onConfirm = () => {
  const found = addresses.value.find(a => a.id === selectedId.value)
  if (found) emit('select', found)
}

const onRemove = async (id: number) => {
  try {
    await addressService.remove(id)
    message.success('Đã xóa địa chỉ')
    await load()
  } catch (err: any) {
    message.info(err?.message ?? 'Tính năng đang được phát triển')
  }
}

defineExpose({ reload: load })
</script>
