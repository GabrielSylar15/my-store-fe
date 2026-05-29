// NOTE: Mocked — backend profile endpoints not yet wired.
// Persists to localStorage so the profile UX can be developed end-to-end.

export type Gender = 'male' | 'female' | 'other'

export interface UserProfile {
  username: string         // readonly handle, e.g. "sylar1505"
  full_name: string
  email: string
  phone_number: string
  gender: Gender | null
  /** ISO date string, e.g. "1995-04-12". Empty when not set. */
  birthday: string
  avatar_url: string
}

const STORAGE_KEY = 'mock_user_profile'

const DEFAULT_PROFILE: UserProfile = {
  username: 'sylar1505',
  full_name: 'Nguyễn Thế Vinh',
  email: 'ne**********@gmail.com',
  phone_number: '********69',
  gender: null,
  birthday: '',
  avatar_url: 'https://i.pravatar.cc/160?img=8',
}

function read(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE }
  } catch { return { ...DEFAULT_PROFILE } }
}

function write(p: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 150))
    return read()
  }

  async updateProfile(patch: Partial<Omit<UserProfile, 'username'>>): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 200))
    const next = { ...read(), ...patch }
    write(next)
    return next
  }
}

export const userService = new UserService()
