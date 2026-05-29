// NOTE: Mocked — backend API for addresses not yet implemented.
// Persists to localStorage so the checkout UX can be developed end-to-end.

export interface UserAddress {
  id: number
  full_name: string
  phone_number: string   // store as string for display; convert to number when sending order
  address: string        // street / building
  district: string
  city: string
  is_default: boolean
}

const STORAGE_KEY = 'mock_user_addresses'

function read(): UserAddress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function write(list: UserAddress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

class AddressService {
  async list(): Promise<UserAddress[]> {
    await new Promise(r => setTimeout(r, 150))
    return read()
  }

  async getDefault(): Promise<UserAddress | null> {
    const list = await this.list()
    return list.find(a => a.is_default) ?? list[0] ?? null
  }

  async create(data: Omit<UserAddress, 'id' | 'is_default'> & { is_default?: boolean }): Promise<UserAddress> {
    const list = read()
    const id = Date.now()
    const isDefault = data.is_default ?? list.length === 0
    if (isDefault) list.forEach(a => (a.is_default = false))
    const next: UserAddress = { ...data, id, is_default: isDefault }
    list.push(next)
    write(list)
    return next
  }

  async update(id: number, data: Partial<Omit<UserAddress, 'id'>>): Promise<UserAddress | null> {
    const list = read()
    const idx = list.findIndex(a => a.id === id)
    if (idx === -1) return null
    if (data.is_default) list.forEach(a => (a.is_default = false))
    list[idx] = { ...list[idx], ...data }
    write(list)
    return list[idx]
  }

  async setDefault(id: number): Promise<void> {
    const list = read()
    list.forEach(a => (a.is_default = a.id === id))
    write(list)
  }

  async remove(id: number): Promise<void> {
    const list = read().filter(a => a.id !== id)
    if (list.length && !list.some(a => a.is_default)) list[0].is_default = true
    write(list)
  }
}

export const addressService = new AddressService()
