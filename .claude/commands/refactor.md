# refactor

Refactor code, CSS, or UI in this project without changing behavior.

## Usage

```
/refactor <target> [focus]
```

**target**: file path, component name, or domain (e.g. `inventory`, `services`)
**focus** (optional): `code` | `css` | `ui` | `all` (default: `all`)

**Examples:**
- `/refactor src/components/inventory/ProductCard.vue`
- `/refactor src/components/inventory/ProductSearchList.vue css`
- `/refactor services code`
- `/refactor src/pages/inventory/ProductListPage.vue ui`

---

## Step-by-step instructions

1. Parse `$ARGUMENTS` to identify the target file(s) and focus area
2. Read the target file(s) fully before making any changes
3. Apply only the relevant refactor rules below based on the focus
4. Preserve all existing behavior — no feature additions, no logic changes
5. Report a summary of what was changed and why

---

## Code refactor rules

### Vue components
- Use `<script setup lang="ts">` — migrate from Options API if present
- Remove unused imports, unused `ref`/`computed`, unused props
- Extract repeated inline logic into `computed` or helper functions
- Replace magic numbers/strings with named `const`
- Avoid `any` type where a proper interface can be inferred
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of manual null checks
- Remove `console.log` / `console.error` left from debugging

### Services
- Ensure class-based singleton pattern: `class FooService { ... }` + `export const fooService = new FooService()`
- All methods must be `async` and return typed Promises
- Move inline interfaces to the top of the file
- Remove dead methods

### Stores (Pinia)
- Must use Setup Store (`defineStore('id', () => { ... })`) — migrate Options Store if found
- `ref()` for state, `computed()` for derived values, plain functions for actions
- Return only what consumers need — don't expose internal helpers

### General TypeScript
- Replace `any` with proper types where inferable
- Use `interface` for object shapes (not `type` unless union/intersection needed)
- Add return types to exported functions

---

## CSS refactor rules

### Tailwind
- Replace hardcoded color hex/rgb values with project tokens: `bg-primary`, `text-primary`, `bg-background-page`, `bg-background-component`
- Consolidate duplicate utility class sequences into a single element where possible
- Remove unused utility classes
- Use responsive prefixes (`md:`, `lg:`) instead of separate media query blocks in `<style>`
- Prefer Tailwind utilities over inline `style=""` attributes

### `<style scoped>` blocks
- Remove empty `<style scoped>` blocks
- Remove classes that are already handled entirely by Tailwind utilities
- Keep only: Ant Design overrides (`:deep(.ant-xxx)`), pseudo-element styles, and anything Tailwind cannot express
- Always use `:deep()` when overriding Ant Design component internals — never use unscoped global selectors

### Ant Design overrides
- Group all `:deep()` overrides together at the bottom of `<style scoped>`
- Add a short comment above each override group explaining what it fixes (Ant Design quirks are non-obvious)

---

## UI refactor rules

### Layout consistency
- Page wrappers must follow the standard pattern:
  ```vue
  <div class="overflow-x-auto w-full min-w-[800px] bg-background-page">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <AuthHeader />
    </div>
    <div class="mx-auto py-6 max-w-7xl pt-[140px]">
      <!-- content -->
    </div>
    <Footer />
  </div>
  ```
- All page components must have `AuthHeader` + `Footer`
- Content wrapper must have `pt-[140px]` to clear the fixed header

### Loading & error states
- Replace any custom spinners with `<a-spin :spinning="loading" tip="Đang tải...">`
- Replace `alert(...)` / `console.error(...)` error handling with `message.error('...')` from `ant-design-vue`
- Add loading state (`const loading = ref(false)`) if data is fetched but no loading UI exists

### Text & copy
- All UI-facing text must be in **Vietnamese**
- Replace "dummy text", "placeholder", "TODO" strings with realistic Vietnamese copy or remove them
- Remove commented-out template blocks

### Placeholder cleanup
- Replace hardcoded mock/dummy data with either real service calls or clearly marked `// TODO:` comments
- Remove unused template variables referenced as "dummy text"

### Accessibility & semantics
- Use semantic HTML: `<button>` not `<div @click>`, `<nav>` for navigation, `<main>` for main content
- Add `:title` or `aria-label` to icon-only buttons
- Ensure `<img>` tags have meaningful `alt` attributes (not empty string unless decorative)
