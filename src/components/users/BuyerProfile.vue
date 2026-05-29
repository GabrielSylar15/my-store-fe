<template>
  <div class="bg-white rounded shadow">
    <!-- Header -->
    <div class="px-7 py-5 border-b border-gray-100">
      <h2 class="text-lg font-medium text-gray-800 m-0">Hồ Sơ Của Tôi</h2>
      <p class="text-sm text-gray-500 mt-1 m-0">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
    </div>

    <a-spin :spinning="loading" tip="Đang tải...">
      <div class="px-7 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-8">
        <!-- ===== Left: form ===== -->
        <a-form
            ref="formRef"
            layout="horizontal"
            :model="form"
            :rules="rules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            :colon="false"
        >
          <a-form-item label="Tên đăng nhập">
            <span class="text-sm text-gray-700">{{ form.username }}</span>
          </a-form-item>

          <a-form-item label="Tên" name="full_name">
            <a-input v-model:value="form.full_name" placeholder="Nhập tên hiển thị" :maxlength="80" />
          </a-form-item>

          <a-form-item label="Email">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700">{{ form.email || 'Chưa cập nhật' }}</span>
              <button class="text-sm text-sky-500 hover:text-sky-600 cursor-pointer" @click.prevent="onChangeEmail">
                Thay Đổi
              </button>
            </div>
          </a-form-item>

          <a-form-item label="Số điện thoại">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700">{{ form.phone_number || 'Chưa cập nhật' }}</span>
              <button class="text-sm text-sky-500 hover:text-sky-600 cursor-pointer" @click.prevent="onChangePhone">
                Thay Đổi
              </button>
            </div>
          </a-form-item>

          <a-form-item label="Giới tính">
            <a-radio-group v-model:value="form.gender">
              <a-radio value="male">Nam</a-radio>
              <a-radio value="female">Nữ</a-radio>
              <a-radio value="other">Khác</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="Ngày sinh">
            <a-date-picker
                v-model:value="birthdayProxy"
                placeholder="Chọn ngày sinh"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                :disabled-date="isFutureDate"
                class="!w-full max-w-[260px]"
            />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
            <a-button
                type="primary"
                size="large"
                class="!px-10"
                :loading="saving"
                @click="onSave"
            >
              Lưu
            </a-button>
          </a-form-item>
        </a-form>

        <!-- ===== Right: avatar ===== -->
        <div class="flex flex-col items-center border-l border-gray-100 pl-8">
          <img
              :src="form.avatar_url || DEFAULT_AVATAR"
              class="w-28 h-28 rounded-full object-cover border border-gray-200 mb-4"
              alt="Ảnh đại diện"
              @error="onAvatarError"
          />
          <a-button @click="onPickAvatar">Chọn Ảnh</a-button>
          <input
              ref="avatarInputRef"
              type="file"
              accept=".jpg,.jpeg,.png"
              class="hidden"
              @change="onAvatarFile"
          />
          <div class="text-xs text-gray-500 mt-3 text-center leading-relaxed">
            <p class="m-0">Dung lượng tối đa 1 MB</p>
            <p class="m-0">Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import { userService, type UserProfile } from '@/services/user/userService'

const DEFAULT_AVATAR = 'https://placehold.co/160x160?text=Avatar'
const MAX_AVATAR_BYTES = 1024 * 1024 // 1 MB

const formRef = ref<any>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive<UserProfile>({
  username: '',
  full_name: '',
  email: '',
  phone_number: '',
  gender: null,
  birthday: '',
  avatar_url: '',
})

const rules = {
  full_name: [
    { required: true, message: 'Vui lòng nhập tên', trigger: 'blur' },
    { min: 2, max: 80, message: 'Tên phải từ 2 đến 80 ký tự', trigger: 'blur' },
  ],
}

// AntD DatePicker works with Dayjs; bridge it to the ISO string we store.
const birthdayProxy = computed<Dayjs | null>({
  get: () => (form.birthday ? dayjs(form.birthday) : null),
  set: (v: Dayjs | null) => { form.birthday = v ? v.format('YYYY-MM-DD') : '' },
})

const isFutureDate = (current: Dayjs) => current && current.isAfter(dayjs().endOf('day'))

const load = async () => {
  loading.value = true
  try {
    Object.assign(form, await userService.getProfile())
  } finally {
    loading.value = false
  }
}

const onSave = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    const { username: _u, ...patch } = form
    Object.assign(form, await userService.updateProfile(patch))
    message.success('Cập nhật hồ sơ thành công')
  } catch {
    message.error('Cập nhật hồ sơ thất bại, vui lòng thử lại')
  } finally {
    saving.value = false
  }
}

const onChangeEmail = () => message.info('Tính năng đổi email đang được phát triển')
const onChangePhone = () => message.info('Tính năng đổi số điện thoại đang được phát triển')

const onPickAvatar = () => avatarInputRef.value?.click()

const onAvatarFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // allow re-selecting the same file
  if (!file) return
  if (file.size > MAX_AVATAR_BYTES) {
    message.error('Dung lượng ảnh tối đa 1 MB')
    return
  }
  // Mock upload: read into a base64 data URL and persist.
  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = reader.result as string
    saving.value = true
    try {
      Object.assign(form, await userService.updateProfile({ avatar_url: dataUrl }))
      message.success('Đã cập nhật ảnh đại diện')
    } finally {
      saving.value = false
    }
  }
  reader.readAsDataURL(file)
}

const onAvatarError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = DEFAULT_AVATAR
}

onMounted(load)
</script>

<style scoped>
/* Match Shopee's profile form: keep labels grey and content tight on mobile. */
:deep(.ant-form-item-label > label) {
  color: #6b7280;
  font-size: 13px;
}
:deep(.ant-form-item) {
  margin-bottom: 18px;
}

@media (max-width: 768px) {
  /* Stack label above input on small screens */
  :deep(.ant-form-horizontal .ant-form-item-label) {
    flex: 0 0 100%;
    text-align: left;
  }
  :deep(.ant-form-horizontal .ant-form-item-control) {
    flex: 0 0 100%;
  }
}
</style>
