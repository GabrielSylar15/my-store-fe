# add-service

Add a new API service to the project following the established service pattern.

## Usage

```
/add-service <domain> <ServiceName> [api-endpoint]
```

**Examples:**
- `/add-service order OrderService /api/v1/orders`
- `/add-service inventory ReviewService /api/v1/reviews`
- `/add-service user WishlistService /api/v1/wishlists`

## What this skill does

Creates `src/services/{domain}/{serviceName}Service.ts` with:
- A TypeScript interface for the resource model
- A TypeScript interface for fetch conditions
- A service class with typed methods
- An exported singleton

## Rules

- Import `httpClient` from `@/core` — never raw axios
- `res.data` is already unwrapped by the response interceptor (`ApiResponse.data`) — return it directly
- Use `POST /get_by_condition` pattern for list queries (see `productService` as reference)
- Name the singleton export `{camelCase}Service`
- All comments in Vietnamese if needed

## Reference implementation

See `src/services/product/productService.ts` for the canonical pattern:

```ts
import { httpClient } from '@/core'

export interface MyResource {
  id: number
  // fields...
}

export interface FetchMyResourceCondition {
  text?: string
  limit?: number
  // filters...
}

class MyResourceService {
  async fetchByCondition(condition: FetchMyResourceCondition = {}): Promise<MyResource[]> {
    const res = await httpClient.post('/api/v1/my-resources/get_by_condition', condition)
    return res.data
  }

  async fetchById(id: number): Promise<MyResource> {
    const res = await httpClient.get(`/api/v1/my-resources/${id}`)
    return res.data
  }
}

export const myResourceService = new MyResourceService()
```

## Step-by-step instructions

1. Parse `$ARGUMENTS` for `domain`, `ServiceName`, and optional `api-endpoint`
2. If `api-endpoint` is not provided, infer it from the service name (e.g. `ReviewService` → `/api/v1/reviews`)
3. Create `src/services/{domain}/{camelCaseServiceName}.ts`
4. Infer reasonable TypeScript fields for the resource interface based on the service name and domain context
5. Include `fetchByCondition` and `fetchById` as minimum methods; add more if the context suggests it
6. Report the created file path

$ARGUMENTS
