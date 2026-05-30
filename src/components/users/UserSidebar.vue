<template>
  <aside class="user-sidebar">
    <!-- Profile header -->
    <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
      <img
          :src="avatar"
          class="w-12 h-12 rounded-full object-cover border border-gray-200"
          alt=""
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-800 truncate m-0">{{ displayName }}</p>
        <router-link
            to="/user/account/profile"
            class="text-xs text-gray-500 hover:text-primary flex items-center gap-1 mt-0.5"
        >
          <iconify-icon icon="material-symbols:edit-outline" width="12" height="12"></iconify-icon>
          Sửa Hồ Sơ
        </router-link>
      </div>
    </div>

    <!-- Menu groups -->
    <nav class="mt-4 space-y-5">
      <div v-for="group in groups" :key="group.label">
        <router-link
            v-if="group.to"
            :to="group.to"
            class="group-link"
            :class="{ active: isActive(group.to, group.exact) }"
        >
          <iconify-icon :icon="group.icon" width="22" height="22"></iconify-icon>
          <span>{{ group.label }}</span>
        </router-link>
        <div v-else class="flex items-center gap-2 mb-2 text-gray-800">
          <iconify-icon :icon="group.icon" width="22" height="22" :class="group.iconClass"></iconify-icon>
          <span class="text-sm font-medium">{{ group.label }}</span>
        </div>

        <div v-if="group.items" class="ml-8 mt-1 space-y-2">
          <router-link
              v-for="i in group.items"
              :key="i.label"
              :to="i.to"
              class="sub-link"
              :class="{ active: isActive(i.to, true) }"
          >
            {{ i.label }}
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const displayName = 'sylar1505'
const avatar = 'https://i.pravatar.cc/64?img=8'

const groups: {
  label: string
  icon: string
  iconClass?: string
  to?: string
  exact?: boolean
  items?: { label: string; to: string }[]
}[] = [
  {
    label: 'Tài Khoản Của Tôi',
    icon: 'material-symbols:person-outline',
    iconClass: 'text-sky-500',
    items: [
      { label: 'Hồ Sơ',         to: '/user/account/profile' },
      { label: 'Địa Chỉ',        to: '/user/account/addresses' },
      { label: 'Đổi Mật Khẩu',   to: '/user/account/password' },
    ],
  },
  { label: 'Đơn Mua',     icon: 'material-symbols:receipt-long-outline', iconClass: 'text-primary', to: '/user/orders' },
  { label: 'Thông Báo',   icon: 'material-symbols:notifications-outline', iconClass: 'text-orange-400', to: '/user/notifications' },
  { label: 'Kho Voucher', icon: 'material-symbols:confirmation-number-outline', iconClass: 'text-yellow-500', to: '/user/vouchers' },
]

const isActive = (to: string, exact = false) => {
  if (!to) return false
  return exact ? route.path === to : route.path.startsWith(to)
}
</script>

<style scoped>
.user-sidebar {
  background: #fff;
  border-radius: 4px;
  padding: 20px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: sticky;
  top: 156px; /* compensate for fixed AuthHeader */
}

.group-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  text-decoration: none;
}
.group-link.active {
  color: var(--color-primary);
}

.sub-link {
  display: block;
  font-size: 14px;
  color: #4b5563;
  text-decoration: none;
  padding: 2px 0;
}
.sub-link:hover {
  color: var(--color-primary);
}
.sub-link.active {
  color: var(--color-primary);
}
</style>
