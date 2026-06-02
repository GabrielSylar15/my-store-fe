import { httpClient } from '@/core'
import { parsePhoneToServer, formatPhone } from '@/helpers/format'

export interface UserAddress {
  id: number
  full_name: string
  phone_number: string   // string for display; use parsePhoneToServer when sending to API
  address: string
  ward: string
  district: string
  city: string
  is_default: boolean
}

/** Raw shape returned by the backend (snake_case, recipient_name). */
interface ShippingAddressApi {
  id: number
  recipient_name: string
  phone_number: number | string
  address: string
  ward: string
  district: string
  city: string
  is_default: boolean
}

function fromApi(raw: ShippingAddressApi): UserAddress {
  return {
    id: raw.id,
    full_name: raw.recipient_name ?? '',
    phone_number: formatPhone(raw.phone_number ?? ''),
    address: raw.address ?? '',
    ward: raw.ward ?? '',
    district: raw.district ?? '',
    city: raw.city ?? '',
    is_default: raw.is_default ?? false,
  }
}

class AddressService {
  async list(): Promise<UserAddress[]> {
    const res = await httpClient.get('/api/v1/shipping_addresses')
    if (!res.success) return []
    return (res.data ?? []).map(fromApi)
  }

  async getDefault(): Promise<UserAddress | null> {
    const list = await this.list()
    return list.find(a => a.is_default) ?? list[0] ?? null
  }

  async create(data: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    const res = await httpClient.post('/api/v1/shipping_addresses', {
      recipient_name: data.full_name,
      phone_number: parsePhoneToServer(data.phone_number),
      address: data.address,
      ward: data.ward,
      district: data.district,
      city: data.city,
      is_default: data.is_default,
    })
    if (!res.success) throw new Error(res.message ?? 'Không thể lưu địa chỉ')
    return fromApi(res.data)
  }

  async update(id: number, data: Partial<Omit<UserAddress, 'id'>>): Promise<UserAddress> {
    const res = await httpClient.put(`/api/v1/shipping_addresses/${id}`, {
      recipient_name: data.full_name,
      phone_number: data.phone_number ? parsePhoneToServer(data.phone_number) : undefined,
      address: data.address,
      ward: data.ward,
      district: data.district,
      city: data.city,
      is_default: data.is_default,
    })
    if (!res.success) throw new Error(res.message ?? 'Không thể cập nhật địa chỉ')
    return fromApi(res.data)
  }

  async setDefault(id: number): Promise<void> {
    const res = await httpClient.put(`/api/v1/shipping_addresses/${id}/default`)
    if (!res.success) throw new Error(res.message ?? 'Không thể đặt địa chỉ mặc định')
  }

  async remove(id: number): Promise<void> {
    const res = await httpClient.delete(`/api/v1/shipping_addresses/${id}`)
    if (!res.success) throw new Error(res.message ?? 'Không thể xóa địa chỉ')
  }
}

export const addressService = new AddressService()
