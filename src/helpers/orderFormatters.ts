import type { OrderItem } from '@/services/order/orderService'

/** Build the "Color: Red, Size: M" label for a specific cart/order item. */
export const variantLabel = (i: OrderItem): string => {
  const p = i.product
  if (!p?.tier_variants?.length) return 'Mặc định'
  const variant = p.product_variants?.find(v => v.id === i.product_variant_id)
  if (!variant?.tier_index?.length) return 'Mặc định'
  return variant.tier_index
    .map((optIdx, tierIdx) => p.tier_variants?.[tierIdx]?.options?.[optIdx - 1] ?? '')
    .filter(Boolean)
    .join(', ')
}

export const PAYMENT_LABEL: Record<'cod' | 'bank' | 'momo', string> = {
  cod:  'Thanh toán khi nhận hàng',
  bank: 'Thẻ ATM / Internet Banking',
  momo: 'Ví MoMo',
}
