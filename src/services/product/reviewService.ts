import { httpClient } from '@/core'

export interface ReviewUserInfo {
  id: number
  username: string
  avatar: string | null
}

export interface ReviewVariantInfo {
  id: number
  productId: number
  tierIndex: number[]
  tierVariations: {
    name: string
    options: string[]
    images: { url: string; image_ration: string | null }[] | null
  }[]
  image: string | null
}

export interface ProductReview {
  id: number
  star_rating: number
  comment: string
  images: string[]
  video: string | null
  created_at: string
  like_count: number
  liked_by_current_user: boolean
  product_variant: ReviewVariantInfo | null
  user_info: ReviewUserInfo
}

export interface ListReviewsResult {
  reviews: ProductReview[]
  after: string | null
}

class ReviewService {
  async list(
    productId: number,
    params: { limit?: number; star?: number; after?: string } = {}
  ): Promise<ListReviewsResult> {
    const q = new URLSearchParams({ product_id: String(productId) })
    if (params.limit) q.set('limit', String(params.limit))
    if (params.star) q.set('star', String(params.star))
    if (params.after) q.set('after', params.after)
    const res = await httpClient.get(`/api/v1/product_reviews?${q}`)
    if (!res.success) return { reviews: [], after: null }
    const rawData: ProductReview[] = res.data ?? []
    return {
      reviews: rawData.map(r => ({ ...r, liked_by_current_user: r.liked_by_current_user ?? false, like_count: r.like_count ?? 0 })),
      after: (res.rawResponse as any)?.data?.after ?? null,
    }
  }

  async create(body: {
    product_id: number
    product_variant_id: number
    order_id: number
    star_rating: number
    comment: string
  }): Promise<any> {
    const res = await httpClient.post('/api/v1/product_reviews', body)
    if (!res.success) throw new Error(res.message ?? 'Không thể gửi đánh giá')
    return res.data
  }

  async like(id: number): Promise<void> {
    const res = await httpClient.post(`/api/v1/product_reviews/${id}/like`)
    if (!res.success) throw new Error(res.message ?? 'Không thể thích đánh giá')
  }

  async reviewedInOrder(orderAlias: string): Promise<ReviewedInOrderItem[]> {
    const res = await httpClient.get(`/api/v1/product_reviews/reviewed_in_order?order_alias=${orderAlias}`)
    if (!res.success) return []
    return res.data ?? []
  }

  async unlike(id: number): Promise<void> {
    const res = await httpClient.delete(`/api/v1/product_reviews/${id}/like`)
    if (!res.success) throw new Error(res.message ?? 'Không thể bỏ thích đánh giá')
  }
}

export interface ReviewedInOrderItem {
  review_id: number
  product_id: number
  product_variant_id: number
}

export const reviewService = new ReviewService()
