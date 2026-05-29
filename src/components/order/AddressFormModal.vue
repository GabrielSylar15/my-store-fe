<template>
  <a-modal
      :open="open"
      :title="isEdit ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'"
      :confirm-loading="submitting"
      :ok-text="isEdit ? 'Cập nhật' : 'Hoàn thành'"
      cancel-text="Hủy"
      :width="600"
      centered
      @ok="onSubmit"
      @cancel="emit('close')"
  >
    <a-form layout="vertical" :model="form" :rules="rules" ref="formRef">
      <div class="grid grid-cols-2 gap-3">
        <a-form-item label="Họ và tên" name="full_name">
          <a-input v-model:value="form.full_name" placeholder="Họ và tên" />
        </a-form-item>
        <a-form-item label="Số điện thoại" name="phone_number">
          <a-input v-model:value="form.phone_number" placeholder="Số điện thoại" />
        </a-form-item>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <a-form-item label="Tỉnh / Thành phố" name="city">
          <a-select
              v-model:value="form.city"
              placeholder="Chọn Tỉnh / Thành phố"
              :options="cityOptions"
              show-search
          />
        </a-form-item>
        <a-form-item label="Quận / Huyện" name="district">
          <a-input v-model:value="form.district" placeholder="Quận / Huyện" />
        </a-form-item>
      </div>

      <a-form-item label="Địa chỉ cụ thể" name="address">
        <a-textarea
            v-model:value="form.address"
            placeholder="Số nhà, tên đường, phường/xã..."
            :rows="2"
        />
      </a-form-item>

      <a-form-item>
        <a-checkbox v-model:checked="form.is_default">Đặt làm địa chỉ mặc định</a-checkbox>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { addressService, type UserAddress } from '@/services/user/addressService'

const props = defineProps<{
  open: boolean
  initial?: UserAddress | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', address: UserAddress): void
}>()

const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<any>(null)

const form = reactive({
  full_name: '',
  phone_number: '',
  city: '',
  district: '',
  address: '',
  is_default: false,
})

const cityOptions = [
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
]

const rules = {
  full_name: [{ required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' }],
  phone_number: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
    {
      pattern: /^(0|84)\d{9,10}$/,
      message: 'Số điện thoại không hợp lệ',
      trigger: 'blur',
    },
  ],
  city: [{ required: true, message: 'Vui lòng chọn Tỉnh / Thành phố', trigger: 'change' }],
  district: [{ required: true, message: 'Vui lòng nhập Quận / Huyện', trigger: 'blur' }],
  address: [{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể', trigger: 'blur' }],
}

watch(
  () => props.open,
  open => {
    if (!open) return
    if (props.initial) {
      isEdit.value = true
      Object.assign(form, {
        full_name: props.initial.full_name,
        phone_number: props.initial.phone_number,
        city: props.initial.city,
        district: props.initial.district,
        address: props.initial.address,
        is_default: props.initial.is_default,
      })
    } else {
      isEdit.value = false
      Object.assign(form, {
        full_name: '',
        phone_number: '',
        city: '',
        district: '',
        address: '',
        is_default: false,
      })
    }
  },
  { immediate: true }
)

const onSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    let saved: UserAddress | null
    if (isEdit.value && props.initial) {
      saved = await addressService.update(props.initial.id, { ...form })
    } else {
      saved = await addressService.create({ ...form })
    }
    if (saved) {
      message.success(isEdit.value ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới')
      emit('saved', saved)
    }
  } finally {
    submitting.value = false
  }
}
</script>
