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
          <a-form-item label="Email">
            <span class="text-sm text-gray-700">{{ profile?.email || '—' }}</span>
          </a-form-item>

          <a-form-item label="Họ và tên" name="name">
            <a-input v-model:value="form.name" placeholder="Nhập tên hiển thị" :maxlength="80" />
          </a-form-item>

          <a-form-item label="Số điện thoại" name="phone_number">
            <a-input v-model:value="form.phone_number" placeholder="VD: 0989902069" :maxlength="15" />
          </a-form-item>

          <a-form-item label="Địa chỉ" name="address">
            <a-input v-model:value="form.address" placeholder="Số nhà, tên đường" :maxlength="200" />
          </a-form-item>

          <a-form-item label="Tỉnh / Thành phố" name="city">
            <a-input v-model:value="form.city" placeholder="VD: Hà Nội" :maxlength="100" />
          </a-form-item>

          <a-form-item label="Quận / Huyện" name="district">
            <a-input v-model:value="form.district" placeholder="VD: Hai Bà Trưng" :maxlength="100" />
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
              :src="avatarSrc"
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
import { userService, type UserProfile, type UserProfilePatch } from '@/services/user/userService'
import { fileService } from '@/services/file/fileService'
import { useUserStore } from '@/stores/userStore'
import { getImageUrl } from '@/helpers/format'

const DEFAULT_AVATAR = 'https://placehold.co/160x160?text=Avatar'
const MAX_AVATAR_BYTES = 1024 * 1024

const formRef = ref<any>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const loading = ref(true)
const saving = ref(false)
const userStore = useUserStore()
const profile = ref<UserProfile | null>(null)

const form = reactive<UserProfilePatch>({
  name: '',
  phone_number: null,
  address: null,
  city: null,
  district: null,
  avatar: null,
})

const avatarSrc = computed(() => form.avatar ? getImageUrl(form.avatar) : DEFAULT_AVATAR)

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập tên', trigger: 'blur' },
    { min: 2, max: 80, message: 'Tên phải từ 2 đến 80 ký tự', trigger: 'blur' },
  ],
}

const load = async () => {
  loading.value = true
  try {
    profile.value = await userService.getProfile()
    Object.assign(form, {
      name: profile.value.name,
      phone_number: profile.value.phone_number,
      address: profile.value.address,
      city: profile.value.city,
      district: profile.value.district,
      avatar: profile.value.avatar,
    })
  } catch {
    message.error('Không tải được thông tin hồ sơ')
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
    const updated = await userService.updateProfile({ ...form })
    userStore.setProfile(updated)
    if (profile.value) Object.assign(profile.value, updated)
    Object.assign(form, {
      name: updated.name,
      phone_number: updated.phone_number,
      address: updated.address,
      city: updated.city,
      district: updated.district,
      avatar: updated.avatar,
    })
    message.success('Cập nhật hồ sơ thành công')
  } catch {
    message.error('Cập nhật hồ sơ thất bại, vui lòng thử lại')
  } finally {
    saving.value = false
  }
}

const onPickAvatar = () => avatarInputRef.value?.click()

const onAvatarFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (file.size > MAX_AVATAR_BYTES) {
    message.error('Dung lượng ảnh tối đa 1 MB')
    return
  }
  saving.value = true
  try {
    const uploaded = await fileService.upload(file)
    form.avatar = uploaded.id
    const updated = await userService.updateProfile({ ...form, avatar: uploaded.id })
    userStore.setProfile(updated)
    message.success('Đã cập nhật ảnh đại diện')
  } catch {
    message.error('Tải ảnh thất bại, vui lòng thử lại')
  } finally {
    saving.value = false
  }
}

const onAvatarError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = DEFAULT_AVATAR
}

onMounted(load)
</script>

<style scoped>
:deep(.ant-form-item-label > label) {
  color: #6b7280;
  font-size: 13px;
}
:deep(.ant-form-item) {
  margin-bottom: 18px;
}

@media (max-width: 768px) {
  :deep(.ant-form-horizontal .ant-form-item-label) {
    flex: 0 0 100%;
    text-align: left;
  }
  :deep(.ant-form-horizontal .ant-form-item-control) {
    flex: 0 0 100%;
  }
}
</style>
