import { httpClient } from '@/core'

export interface CartItem {
  product_id: number
  product_variant_id: number
  quantity: number
  image: string
}

export interface CartData {
  active_items: CartItem[]
  inactive_items: CartItem[]
}

export interface CartUpdateItem {
  product_id: number
  product_variant_id: number
  quantity: number
}

class CartService {
  async getCart(): Promise<CartData> {
    const res = await httpClient.get('/api/v1/carts')
    return res.data
  }

  async updateCart(items: CartUpdateItem[]): Promise<void> {
    await httpClient.post('/api/v1/carts/update', { items })
  }
}

export const cartService = new CartService()
