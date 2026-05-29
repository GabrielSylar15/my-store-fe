/**
 * Display a server phone number (84xxxxxxxxx as number or string) as a local Vietnamese number (0xxxxxxxxx).
 * Server stores/sends phone as int 84xxxxxxxxx; UI always shows 0xxxxxxxxx.
 */
export const formatPhone = (phone: number | string): string => {
  const s = String(phone).replace(/\D/g, '')
  if (s.startsWith('84')) return '0' + s.slice(2)
  if (s.startsWith('0')) return s
  return s
}

/**
 * Convert a user-entered phone string (0xxxxxxxxx or 84xxxxxxxxx) to the int
 * format the server expects (84xxxxxxxxx).
 */
export const parsePhoneToServer = (phone: string): number => {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? '84' + digits.slice(1) : digits
  return Number(normalized)
}

/**
 * Format a number as Vietnamese currency (VND, no fractional digits).
 * @example currency(150000) // "150.000 ₫"
 */
export const currency = (n: number): string =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

/**
 * Build a Google Drive thumbnail URL from an image id.
 * Optional `size` adds the `&sz=w{size}` parameter (Google Drive native resize).
 */
export const getImageUrl = (id: string, size?: number): string => {
  if (!id) return ''
  const base = `https://drive.google.com/thumbnail?id=${id}`
  return size ? `${base}&sz=w${size}` : base
}

/**
 * Default `<img @error>` handler — swaps to a no-image placeholder so the
 * UI never shows a broken-image icon.
 */
export const onImgError = (e: Event, size = 80): void => {
  const target = e.target as HTMLImageElement
  target.src = `https://placehold.co/${size}x${size}?text=No+Image`
}

/**
 * Format an ISO timestamp as "HH:MM DD/MM/YYYY" (Vietnamese reading order).
 */
export const formatDateTime = (iso: string): string => {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}
