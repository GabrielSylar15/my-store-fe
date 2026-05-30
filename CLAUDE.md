# CLAUDE.md — my-store-fe

Vue 3 ecommerce frontend (GIADE). Vietnamese UI. Active features: home, product list/search, product detail, Google OAuth login. Stubs (not yet wired): cart, checkout, order detail, admin, user profile.

## Memory

Project memory lives in `.claude/memory/`. At the start of every session, read `.claude/memory/MEMORY.md` for the index, then read any files relevant to the current task before proceeding.

- `.claude/memory/MEMORY.md` — index of all memory files
- `.claude/memory/project-giade-context.md` — what GIADE sells, target audience
- `.claude/memory/design-color-system.md` — full color token system, teal palette, how to change colors
- `.claude/memory/feedback-vn-ecommerce-ux.md` — UX conventions for Vietnamese ecommerce

## Run

```bash
npm run dev        # Vite dev server → http://localhost:3000
```

Backend expected at `http://localhost:8080` (see `.env`).

**Key env vars** (`.env`):
- `VITE_API_BASE_URL` — backend base URL
- `VITE_PORT` — dev server port (default 3000)
- `VITE_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_REDIRECT_URI`, `VITE_APPLICATION_DOMAIN` — OAuth config

## Stack

| Tool | Version |
|---|---|
| Vue | 3.5 |
| TypeScript | strict, `noImplicitAny: false` |
| Vite | 6.4 |
| Ant Design Vue | 4.2 (full import in `main.js`) |
| Tailwind CSS | v4 (no `tailwind.config.js`) |
| Pinia | 3 |
| Vue Router | 4 |
| Axios | 1.8 |

Path alias: `@` → `src/`

## Directory Structure

```
src/
  main.js                        # Entry: Vue app, Antd, Pinia, tailwind.css
  App.vue                        # Root: only <router-view />
  routes/
    index.ts                     # Router instance — spreads domain route arrays
    user.routes.ts               # /buyer/login, /buyer/login/callback, /user/account/profile
    product.routes.ts            # /product, /product/:productName
  pages/                         # Route-level page wrappers (thin — mostly compose components)
    HomePage.vue
    user/                        # BuyerLoginPage, OAuthCallbackPage, UserProfile (stub)
    inventory/                   # ProductListPage, ProductDetailPage
    order/                       # Cart, CheckOut, OrderDetail  ← empty stubs, NO routes yet
    admin/                       # ConfigSystem, CreateProduct   ← empty stubs, NO routes yet
  components/                    # Reusable components
    AuthHeader.vue               # Fixed top navbar (search, cart, account dropdown)
    LoginHeader.vue              # Slim header for auth pages
    Footer.vue
    BannerComponent.vue
    inventory/                   # ProductCard, ProductCardSkeleton, ProductSearchList,
                                 # ProductDetail, CategoryList, HotSearchProduct, ProductSuggestion
    users/auth/BuyerLogin.vue
    users/BuyerProfile.vue       # stub
    users/BuyerRegister.vue      # stub
    order/OrderDetail.vue        # stub
  services/
    index.ts                     # re-exports authService, useBannerSlider
    bannerService.ts             # useBannerSlider() composable ← exception to class pattern
    product/productService.ts    # productService singleton
    product/categoryService.ts   # categoryService singleton
    user/authService.ts          # authService singleton
  stores/
    searchStore.ts               # useSearchStore — global search text
  core/
    index.ts                     # re-exports utils + auth helpers
    auth/helpers/index.ts        # getAccessToken, setAccessToken, removeToken (localStorage)
    interfaces/httpClient.ts     # ApiResponse<T>, ExtendedAxiosRequestConfig
    utils/httpClient.ts          # HttpClient class
    utils/htttpClientFactory.ts  # exports httpClient singleton (triple-t typo — do NOT rename)
    utils/sample.ts              # unused prototype — ignore
  helpers/
    common.ts                    # jsonDecode / jsonEncode (json-big for BigInt safety)
    notify.ts                    # isNotifyWhenFail()
  assets/
    styles/tailwind.css          # Tailwind v4 @theme — custom color tokens
    base.css                     # Vue starter CSS vars (mostly inert — Tailwind takes over)
    main.css                     # imports base.css (mostly inert)
```

## HTTP Client

```ts
import { httpClient } from '@/core'
```

`httpClient` is an `AxiosInstance` singleton. Built-in interceptors:

- **Request**: auto-injects `Authorization: Bearer <token>` from localStorage
- **Response success**: JSON-parses with `json-big`, runs `isNotifyWhenFail()`, transforms to `ApiResponse<T>`
- **Response error**: same shape; on **401** clears token, optionally redirects to `/login?returnUrl=...`

`ApiResponse<T>` shape (from `src/core/interfaces/httpClient.ts`):
```ts
{
  success: boolean
  error: boolean
  data: T
  statusCode?: number
  message?: string
  rawResponse?: AxiosResponse
}
```

Services return `res.data` directly — `data` is already the unwrapped payload, not the full `ApiResponse` wrapper.

## Service Pattern

Class-based singleton. One file per service at `src/services/{domain}/{name}Service.ts`.

```ts
import { httpClient } from '@/core'

export interface Foo { id: number; /* fields */ }
export interface FetchFooCondition { text?: string; limit?: number }

class FooService {
  async fetchByCondition(condition: FetchFooCondition = {}): Promise<Foo[]> {
    const res = await httpClient.post('/api/v1/foos/get_by_condition', condition)
    return res.data
  }
  async fetchById(id: number): Promise<Foo> {
    const res = await httpClient.get(`/api/v1/foos/${id}`)
    return res.data
  }
}

export const fooService = new FooService()
```

- TypeScript interfaces for the domain go in the same file as the service
- List queries use `POST .../get_by_condition` (see `productService` for reference)
- Check `res.success` before trusting `res.data` when calling endpoints that may fail gracefully

## Component Pattern

Always `<script setup lang="ts">`. No Options API. Vietnamese UI text.

**Page component** (wraps `AuthHeader` + `Footer`):
```vue
<template>
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader />
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px]">
      <ComponentName />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthHeader from '@/components/AuthHeader.vue'
import Footer from '@/components/Footer.vue'
import ComponentName from '@/components/{domain}/ComponentName.vue'

onMounted(() => {
  document.title = 'Tên Trang | GIADE'
})
</script>
```

**Feature component** (data fetching):
```vue
<template>
  <a-spin :spinning="loading" tip="Đang tải...">
    <!-- content -->
  </a-spin>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { fooService } from '@/services/{domain}/fooService'

const items = ref<Foo[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    items.value = await fooService.fetchByCondition()
  } catch {
    message.error('Không tải được dữ liệu')
  } finally {
    loading.value = false
  }
})
</script>
```

Key rules:
- `pt-[140px]` on content wrapper — compensates for fixed `AuthHeader` height
- `<a-spin :spinning="loading" tip="Đang tải...">` for loading state
- `message.error(...)` from `ant-design-vue` for error notifications
- `document.title` set in `onMounted` on page components

## Store Pattern

Pinia **Setup Store** (function-style). Never use Options Store.

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFooStore = defineStore('foo', () => {
  const items = ref<Foo[]>([])
  const count = computed(() => items.value.length)

  const setItems = (data: Foo[]) => { items.value = data }
  const clear = () => { items.value = [] }

  return { items, count, setItems, clear }
})
```

File: `src/stores/{name}Store.ts`. Export name: `use{Name}Store`.

## Routing Convention

1. Create `src/routes/{domain}.routes.ts`:
```ts
import FooPage from '@/pages/{domain}/FooPage.vue'

const fooRoutes = [
  { path: '/foo', name: 'Foo', component: FooPage }
]

export default fooRoutes
```

2. Import and spread in `src/routes/index.ts`:
```ts
import fooRoutes from './foo.routes'

const routes = [ { path: '/', ... }, ...userRoutes, ...productRoutes, ...fooRoutes ]
```

## Styling

**Tailwind CSS v4** — no `tailwind.config.js`. Custom tokens live in `src/assets/styles/tailwind.css` inside `@theme`:

```css
@theme {
  --color-primary: #e30707;           /* → bg-primary, text-primary, border-primary */
  --color-background-page: #f5f5f5;   /* → bg-background-page */
  --color-background-component: #fff; /* → bg-background-component */
}
```

To add a new color: add `--color-{name}: {value}` in the `@theme` block → use as `bg-{name}` / `text-{name}`.

**Ant Design Vue** components use `a-` prefix: `a-button`, `a-input`, `a-spin`, `a-tag`, `a-pagination`, `a-checkbox`, `a-dropdown`, `a-segmented`, etc.

Override Ant Design styles in `<style scoped>`:
```css
:deep(.ant-xxx) { /* override */ }
```

**Iconify icons** (loaded via CDN in `index.html`):
```html
<iconify-icon icon="material-symbols:star" width="18" height="18"></iconify-icon>
```

**Currency formatting (VND)**:
```ts
const currency = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
```

**Image from Google Drive**:
```ts
const getImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}`
```

## Auth System

Tokens stored in `localStorage`: `app_access_token`, `app_refresh_token`.

Helpers from `@/core`: `getAccessToken()`, `setAccessToken({ token, refresh_token })`, `removeToken()`.

**Google OAuth popup flow**:
1. `authService.redirectToGoogleOAuth()` opens a popup window
2. Popup navigates to `/buyer/login/callback` → `OAuthCallbackPage` calls `authService.handleOAuthCallback()`
3. Callback calls `GET /api/v1/users/auth/callback?code=...`, stores token via `localStorage.setItem('google-auth-success', token)`, closes popup
4. Parent window listens via `window.addEventListener('storage', ...)` in `authService.loginWithGoogle()`, sets token, redirects to `returnUrl`

## Debugging: Taking a Browser Screenshot

The dev server runs on Wayland (no X11 root capture, no `scrot`, no `grim`). Use **Chrome headless + CDP over raw socket** to take authenticated screenshots.

### Environment facts
- `WAYLAND_DISPLAY=wayland-0`, `DISPLAY=:0` (Xwayland present but root capture fails)
- `google-chrome` available; no `ws` npm package globally; Node.js v16
- Auth token stored in `localStorage` key `app_access_token`
- `npm run build` fails (Node.js version incompatibility with Vite) — use dev server only

### One-shot screenshot script

```bash
TOKEN="<paste JWT from localStorage or a fresh login curl>"

google-chrome --headless=new --disable-gpu --ozone-platform=headless \
  --window-size=1400,1000 --remote-debugging-port=9235 'about:blank' 2>/dev/null &
CPID=$!
sleep 2

python3 << PYEOF
import json, http.client, time, base64, struct, socket, os

PORT = 9235
TOKEN = "$TOKEN"
TARGET_URL = "http://localhost:3000/product/283506"   # ← change this

conn = http.client.HTTPConnection('localhost', PORT)
conn.request('GET', '/json')
tabs = json.loads(conn.getresponse().read())
tab = next((t for t in tabs if 'blank' in t.get('url','')), tabs[0])
u = tab['webSocketDebuggerUrl'].replace(f'ws://localhost:{PORT}','')

s = socket.socket()
s.connect(('localhost', PORT))
s.settimeout(20)
hs = f"GET {u} HTTP/1.1\r\nHost: localhost:{PORT}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n"
s.send(hs.encode())
resp = b''
while b'\r\n\r\n' not in resp:
    resp += s.recv(1024)

mid = [1]

def cdp(method, params=None):
    id_ = mid[0]; mid[0] += 1
    body = json.dumps({'id': id_, 'method': method, 'params': params or {}}).encode()
    mk = b'\x01\x02\x03\x04'
    masked = bytes(b ^ mk[i%4] for i,b in enumerate(body))
    hdr = bytes([0x81, 0x80|len(body)]) + mk if len(body) < 126 else bytes([0x81, 0xFE, len(body)>>8, len(body)&0xFF]) + mk
    s.send(hdr + masked)
    buf = b''
    for _ in range(100):
        try:
            chunk = s.recv(131072)
        except socket.timeout:
            return {}
        buf += chunk
        if len(buf) < 2: continue
        b1 = buf[1] & 0x7f
        hl = 2 if b1 < 126 else (4 if b1==126 else 10)
        pl = b1 if b1 < 126 else (struct.unpack('>H',buf[2:4])[0] if b1==126 else struct.unpack('>Q',buf[2:10])[0])
        if len(buf) < hl+pl: continue
        r = json.loads(buf[hl:hl+pl].decode())
        if r.get('id') == id_:
            return r.get('result', {})
        buf = buf[hl+pl:]
    return {}

# 1. Navigate to origin first so localStorage is in the right domain
cdp('Page.navigate', {'url': 'http://localhost:3000'})
time.sleep(2)

# 2. Inject auth token
cdp('Runtime.evaluate', {'expression': f"localStorage.setItem('app_access_token','{TOKEN}')"})

# 3. Navigate to target page and wait for Vue + API
cdp('Page.navigate', {'url': TARGET_URL})
time.sleep(7)          # increase if page has slow API calls

# 4. Optional: scroll before screenshot
# cdp('Runtime.evaluate', {'expression': 'window.scrollTo(0, 600)'})
# time.sleep(0.5)

# 5. Capture
r = cdp('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': False})
if r and 'data' in r:
    out = '/tmp/screenshot.png'
    with open(out,'wb') as f:
        f.write(base64.b64decode(r['data']))
    print(f"Saved {os.path.getsize(out)} bytes → {out}")
else:
    print("No screenshot data:", r)

s.close()
PYEOF

kill $CPID 2>/dev/null
```

Then read the file: `Read /tmp/screenshot.png`

### Key gotchas
- **Do NOT use `pkill` before the script** — on this machine `pkill` can exit with code 144 (signal), which kills the enclosing bash heredoc.
- Use `--ozone-platform=headless` (not just `--headless`) — plain `--headless` fails on Wayland.
- `Runtime.evaluate` may timeout during the first navigate (Chrome fires events before the response is received); this is harmless — the token/navigate still executes.
- Pages that require auth show "Unauthorized request" toast if the token is missing or expired. Get a fresh token via: `curl -s http://localhost:8080/api/v1/users/auth/login -d '{"email":"...","password":"..."}'` or reuse one from the browser's DevTools → Application → Local Storage → `app_access_token`.

## Backend API Conventions

### ProductVariant `tier_index` is 1-based

`tier_index` values start at **1**, not 0. Subtract 1 before indexing into `options`:

```ts
variant.tier_index.map((optIdx, tierIdx) => {
  const tier = product.tier_variants[tierIdx]
  return tier.options[optIdx - 1]  // optIdx is 1-based!
})
```

Example: `tier_index: [1, 3]` with Size options `["S", "M", "L"]` → `options[2]` = "L".

### Fetching product variants requires `is_get_variant: true`

`product_variants` is omitted from the response unless the request body includes `"is_get_variant": true`. Always pass this flag when variant data is needed (cart, product detail, etc.).

### Use variant-level `stock_quantity`, not product-level

`Product.stock_quantity` is a product-level aggregate and may be lower than individual variant stock. Always prefer variant stock for quantity caps:

```ts
const stock = product.product_variants?.find(v => v.id === variantId)?.stock_quantity
  ?? product.stock_quantity
  ?? 99
```

Using product-level stock as a clamp max caused the cart "−" button to jump from qty=5 to qty=2 in one click (`Math.min(2, 4) = 2`).

## Known Gotchas

- **`htttpClientFactory.ts`** has a triple-t typo in the filename. Do **not** rename — all existing imports depend on this exact name.
- `ExtendedAxiosRequestConfig` in `src/core/interfaces/httpClient.ts` defines `offNotify` / `offRefreshToken` flags that are **not yet implemented** in `HttpClient`. Treat as future API surface.
- `src/core/utils/sample.ts` is an unused prototype client — do not import or modify it.
- `base.css` and `main.css` are imported but have minimal effect; Tailwind v4 takes over all styling.
- `bannerService.ts` exports a **composable** (`useBannerSlider()`) instead of a class singleton — the only exception to the service pattern in this project.
- Pages in `pages/order/` and `pages/admin/` are **empty stubs** with no registered routes yet.
- `main.js` is plain JavaScript (not `.ts`) — keep it that way.
- `BuyerRegisterPage.vue` exists under `pages/user/` but its route is not registered in `user.routes.ts`.
