import { httpClient } from '@/core'
import { formatPhone, parsePhoneToServer } from '@/helpers/format'

export interface UserProfile {
  id: number
  email: string
  name: string
  phone_number: string | null  // always display format: "0xxxxxxxxx"
  address: string | null
  city: string | null
  district: string | null
  avatar: string | null
}

export type UserProfilePatch = Partial<Omit<UserProfile, 'id' | 'email'>>

function normalizeProfile(raw: any): UserProfile {
  return {
    ...raw,
    phone_number: raw.phone_number ? formatPhone(raw.phone_number) : null,
  }
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    const res = await httpClient.get('/api/v1/users')
    return normalizeProfile(res.data)
  }

  async updateProfile(patch: UserProfilePatch): Promise<UserProfile> {
    const { phone_number, ...rest } = patch
    const body: Record<string, unknown> = { ...rest }
    if (phone_number != null) body.phone_number = parsePhoneToServer(phone_number)
    const res = await httpClient.put('/api/v1/users', body)
    return normalizeProfile(res.data)
  }
}

export const userService = new UserService()
