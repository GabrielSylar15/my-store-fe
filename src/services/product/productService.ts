import {httpClient} from "@/core";

export interface Product {
    id: number
    category_id: number
    description: string
    images: {
        url: string
        image_ration: string | null
    }[]
    name: string
    pre_order: {
        is_pre_order: boolean
        days_to_ship: number
    }
    product_dimension: {
        weight: number
        height: number
        width: number
        length: number
    }
    stock_quantity: number
    video: {
        id: string
        thumbnail_url: string
        duration: number
    }
    status: string
    total_sold: number
    display_priority: number
    price_info: {
        currency: string
        current_price: number
    }
    product_variants: any[]
    tier_variants: any[]
}


export interface FetchProductCondition {
    category_id?: number;
    text?: string;
    order?: string;
    by?: string;
    limit?: number;
    price_from?: number;
    price_to?: number;
    suggestion_type?: string;
    suggested_param?: {
        product_id?: number;
    },
    after?: string;
}

class ProductService {
    async fetchByCondition(condition: FetchProductCondition = {}): Promise<Product[]> {
        const res = await httpClient.post('/api/v1/products/get_by_condition', condition)
        return res.data
    }
}

export const productService = new ProductService();