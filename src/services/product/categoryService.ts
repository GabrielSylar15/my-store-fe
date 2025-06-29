import {httpClient} from "@/core";

export interface Category {
    id: number
    name: string
    description: string
    parent_id: number | null
    image: string
    children: Category[]
}

class CategoryService {
    async fetchAll(): Promise<Category[]> {
        const res = await httpClient.get('/api/v1/categories')
        return res.data
    }
}

export const categoryService = new CategoryService();
