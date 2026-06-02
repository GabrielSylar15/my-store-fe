import { httpClient } from '@/core'
import type { Product } from '@/services/product/productService'
import type { CartItem } from '@/services/cart/cartService'

// ─── Real API types (GET /api/v1/orders/:alias) ────────────────────────────

export type OrderApiStatus =
  | 'ORDERED'    // Just placed
  | 'CONFIRMED'  // Confirmed, awaiting shipment
  | 'SHIPPING'   // In transit
  | 'DELIVERED'  // Delivered, awaiting buyer confirmation
  | 'COMPLETED'  // Buyer confirmed receipt
  | 'CANCELLED'  // Cancelled

export const ORDER_API_STATUS_LABEL: Record<OrderApiStatus, string> = {
  ORDERED:   'Chờ xác nhận',
  CONFIRMED: 'Chờ lấy hàng',
  SHIPPING:  'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

export const ORDER_API_STATUS_COLOR: Record<OrderApiStatus, string> = {
  ORDERED:   '#faad14',
  CONFIRMED: '#1890ff',
  SHIPPING:  '#1890ff',
  DELIVERED: '#52c41a',
  COMPLETED: '#52c41a',
  CANCELLED: '#bfbfbf',
}

export interface OrderApiVariant {
  name: string
  value: string
}

export interface OrderApiItem {
  product_id: number
  product_variant_id: number
  quantity: number
  product_name: string
  image: string
  variants: OrderApiVariant[]
  currency: string
  current_price: number
  original_price: number | null
}

export interface OrderApiDetail {
  id: number
  alias: string
  note?: string
  address: string
  city: string
  district: string
  phone_number: number
  created_by: number
  created_at: string
  status: OrderApiStatus
  total_price: number
  total_bill: number
  reviewable: boolean
  items: OrderApiItem[]
}

export interface OrderApiListItem extends OrderApiDetail {}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CreateOrderItem {
  product_variant_id: number
  quantity: number
}

export interface CreateOrderPayload {
  items: CreateOrderItem[]
  note?: string
  address: string
  city: string
  district: string
  phone_number: number
  is_from_cart?: boolean
}

export type OrderStatus =
  | 'PENDING'      // Chờ xác nhận
  | 'CONFIRMED'    // Đã xác nhận, chờ lấy hàng
  | 'SHIPPING'     // Đang giao
  | 'DELIVERED'    // Giao thành công
  | 'COMPLETED'    // Đã nhận hàng (buyer confirmed)
  | 'CANCELLED'    // Đã hủy

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'Chờ xác nhận',
  CONFIRMED: 'Chờ lấy hàng',
  SHIPPING:  'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

export interface OrderItem extends CartItem {
  /** Product snapshot at order time — embedded so historical orders survive product changes. */
  product?: Product
  /** Unit price captured at order time (variant or product level). */
  unit_price: number
}

export interface ShippingAddress {
  full_name: string
  phone_number: string
  address: string
  district: string
  city: string
}

export interface OrderTotals {
  items_subtotal: number
  shipping_fee: number
  voucher_discount: number
  grand_total: number
}

export interface OrderStatusEvent {
  status: OrderStatus
  at: string         // ISO timestamp
  message?: string   // optional caption
}

export interface Order {
  id: number
  code: string                    // human-readable e.g. "GD2605281234"
  items: OrderItem[]
  totals: OrderTotals
  status: OrderStatus
  status_history: OrderStatusEvent[]
  shipping_address: ShippingAddress
  shipping_method: { label: string; fee: number; eta: string }
  payment_method: 'cod' | 'bank' | 'momo'
  voucher_code?: string
  note?: string
  created_at: string              // ISO timestamp
}

// ─── Mock persistence (localStorage) ───────────────────────────────────────
const STORAGE_KEY = 'mock_orders'

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function writeAll(list: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function makeOrderCode(id: number): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `GD${pad(d.getFullYear() % 100)}${pad(d.getMonth() + 1)}${pad(d.getDate())}${id.toString().slice(-4)}`
}

// ─── Service ───────────────────────────────────────────────────────────────

export interface CreatedOrder { id: number; alias?: string; total_amount: number; status: string }

/** Extra context callers can pass so the locally-saved order reflects the real UI state. */
export interface MockOrderContext {
  items: OrderItem[]
  totals: OrderTotals
  shipping_address: ShippingAddress
  shipping_method: { label: string; fee: number; eta: string }
  payment_method: 'cod' | 'bank' | 'momo'
  voucher_code?: string
}

class OrderService {
  /**
   * Create an order. Calls the backend `POST /api/v1/orders`.
   * If `context` is provided, also persists a richer snapshot to localStorage
   * so the order-history / order-detail pages have data to show until the
   * corresponding GET endpoints are wired up.
   */
  async createOrder(payload: CreateOrderPayload, context?: MockOrderContext): Promise<CreatedOrder> {
    let created: CreatedOrder
    try {
      const res = await httpClient.post('/api/v1/orders', payload)
      created = res.data
    } catch (err) {
      // Backend may not be ready — fall back to a mock created order so the flow continues.
      if (!context) throw err
      created = { id: Date.now(), total_amount: context.totals.grand_total, status: 'PENDING' }
    }

    if (context) this._saveMock(created.id, payload, context)
    return created
  }

  private _saveMock(id: number, payload: CreateOrderPayload, ctx: MockOrderContext) {
    const now = new Date().toISOString()
    const order: Order = {
      id,
      code: makeOrderCode(id),
      items: ctx.items,
      totals: ctx.totals,
      status: 'PENDING',
      status_history: [{ status: 'PENDING', at: now, message: 'Đơn hàng đã được đặt' }],
      shipping_address: ctx.shipping_address,
      shipping_method: ctx.shipping_method,
      payment_method: ctx.payment_method,
      voucher_code: ctx.voucher_code,
      note: payload.note,
      created_at: now,
    }
    const all = readAll()
    all.unshift(order)
    writeAll(all)
  }

  // ─── Read API (mock) — used by OrderSuccess until a GET-by-id endpoint exists ──
  async getById(id: number): Promise<Order | null> {
    await new Promise(r => setTimeout(r, 150))
    return readAll().find(o => o.id === id) ?? null
  }

  // ─── Real API ───────────────────────────────────────────────────────────────
  async listOrders(status?: OrderApiStatus, lastId?: number): Promise<OrderApiListItem[]> {
    try {
      const params: Record<string, string | number> = {}
      if (status) params.status = status
      if (lastId) params.last_id = lastId
      const res = await httpClient.get('/api/v1/orders', { params })
      return res.data ?? []
    } catch {
      return []
    }
  }

  async getByAlias(alias: string): Promise<OrderApiDetail | null> {
    try {
      const res = await httpClient.get(`/api/v1/orders/${alias}`)
      return res.data ?? null
    } catch {
      return null
    }
  }
}

export const orderService = new OrderService()
