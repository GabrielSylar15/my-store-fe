import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService, type UserProfile } from '@/services/user/userService'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)

  async function loadProfile() {
    try {
      profile.value = await userService.getProfile()
    } catch { /* non-critical */ }
  }

  function setProfile(p: UserProfile) {
    profile.value = p
  }

  function clear() {
    profile.value = null
  }

  return { profile, loadProfile, setProfile, clear }
})
