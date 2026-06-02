<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h2 class="text-base font-semibold text-gray-800 m-0">Địa Chỉ Của Tôi</h2>
        <p class="text-sm text-gray-500 mt-0.5 m-0">Quản lý danh sách địa chỉ nhận hàng</p>
      </div>
      <a-button type="primary" @click="openForm()">
        <template #icon>
          <iconify-icon icon="material-symbols:add" width="16" height="16"></iconify-icon>
        </template>
        Thêm Địa Chỉ Mới
      </a-button>
    </div>

    <!-- Loading -->
    <a-spin :spinning="loading" tip="Đang tải...">
      <!-- Empty -->
      <div v-if="!loading && addresses.length === 0"
           class="bg-white rounded shadow py-20 flex flex-col items-center text-center">
        <iconify-icon icon="material-symbols:location-off-outline" width="72" height="72"
                      class="text-gray-200 mb-4"></iconify-icon>
        <p class="text-gray-500 m-0">Bạn chưa có địa chỉ nào</p>
        <a-button type="primary" class="mt-4" @click="openForm()">Thêm Địa Chỉ Đầu Tiên</a-button>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="addr in addresses"
          :key="addr.id"
          class="bg-white rounded shadow px-6 py-5"
        >
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="font-semibold text-gray-800 text-sm">{{ addr.full_name }}</span>
                <span class="text-gray-400 text-sm">|</span>
                <span class="text-gray-600 text-sm">{{ formatPhone(addr.phone_number) }}</span>
                <a-tag v-if="addr.is_default" color="red"
                       class="!border-primary !text-primary !bg-primary/5 !m-0">
                  Mặc Định
                </a-tag>
              </div>
              <p class="text-sm text-gray-600 m-0">{{ addr.address }}</p>
              <p class="text-sm text-gray-500 m-0 mt-0.5">
                {{ [addr.ward, addr.district, addr.city].filter(Boolean).join(', ') }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <button
                class="text-primary hover:text-primary-dark text-sm cursor-pointer"
                @click="openForm(addr)"
              >Cập nhật</button>
              <span class="text-gray-200">|</span>
              <a-popconfirm
                title="Xóa địa chỉ này?"
                ok-text="Xóa"
                ok-type="danger"
                cancel-text="Hủy"
                :z-index="1010"
                @confirm="remove(addr.id)"
              >
                <button
                  class="text-gray-400 hover:text-red-500 text-sm cursor-pointer"
                  :class="{ 'opacity-40 cursor-not-allowed': addr.is_default }"
                  @click.stop
                >Xóa</button>
              </a-popconfirm>
            </div>
          </div>

          <!-- Set default link -->
          <div v-if="!addr.is_default" class="mt-3 pt-3 border-t border-gray-100">
            <button
              class="text-sm text-gray-500 hover:text-primary cursor-pointer"
              :disabled="settingDefault === addr.id"
              @click="setDefault(addr.id)"
            >
              <a-spin v-if="settingDefault === addr.id" :spinning="true" size="small" class="mr-1" />
              Thiết lập làm mặc định
            </button>
          </div>
        </div>
      </div>
    </a-spin>

    <!-- Add / Edit modal -->
    <AddressFormModal
      :open="formOpen"
      :initial="editing"
      :z-index="1010"
      @close="formOpen = false"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { addressService, type UserAddress } from '@/services/user/addressService'
import AddressFormModal from '@/components/order/AddressFormModal.vue'
import { formatPhone } from '@/helpers/format'

const loading = ref(false)
const addresses = ref<UserAddress[]>([])
const formOpen = ref(false)
const editing = ref<UserAddress | null>(null)
const settingDefault = ref<number | null>(null)

const load = async () => {
  loading.value = true
  try {
    addresses.value = await addressService.list()
  } catch {
    message.error('Không thể tải danh sách địa chỉ')
  } finally {
    loading.value = false
  }
}

const openForm = (addr?: UserAddress) => {
  editing.value = addr ?? null
  formOpen.value = true
}

const onSaved = async () => {
  formOpen.value = false
  await load()
}

const setDefault = async (id: number) => {
  settingDefault.value = id
  try {
    await addressService.setDefault(id)
    await load()
    message.success('Đã đặt địa chỉ mặc định')
  } catch (err: any) {
    message.error(err?.message ?? 'Không thể đặt mặc định')
  } finally {
    settingDefault.value = null
  }
}

const remove = async (id: number) => {
  try {
    await addressService.remove(id)
    message.success('Đã xóa địa chỉ')
    await load()
  } catch (err: any) {
    message.error(err?.message ?? 'Không thể xóa địa chỉ')
  }
}

onMounted(load)
</script>
