import type { OrderItem, OrderStatus } from '@/services/order/orderService'

// Re-export shared format helpers so existing order components keep working.
export { currency, getImageUrl, onImgError, formatDateTime } from '@/helpers/format'

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

export const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING:   '#faad14',
  CONFIRMED: '#1890ff',
  SHIPPING:  '#1890ff',
  DELIVERED: '#52c41a',
  COMPLETED: '#52c41a',
  CANCELLED: '#bfbfbf',
}

export const PAYMENT_LABEL: Record<'cod' | 'bank' | 'momo', string> = {
  cod:  'Thanh toán khi nhận hàng',
  bank: 'Thẻ ATM / Internet Banking',
  momo: 'Ví MoMo',
}
