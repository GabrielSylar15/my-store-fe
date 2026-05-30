---
name: design-color-system
description: GIADE brand color palette — all tokens live in tailwind.css, single source of truth
metadata:
  type: project
---

All brand colors are defined as CSS custom properties in `src/assets/styles/tailwind.css` inside the `@theme` block. Tailwind v4 auto-generates utility classes (`bg-primary`, `text-dark-text-muted`, etc.) from these tokens.

## Current palette (teal)

```
--color-primary:       #0d9488   teal-600  buttons, links, nav bar, prices
--color-primary-dark:  #0f766e   teal-700  hover / pressed state
--color-primary-light: #5eead4   teal-300  gradients, hover text on dark

--color-background-page:      #f0fdfa   teal-50 page background
--color-background-component: #fff      card/component background
--color-border-base:          #e2e8f0   content-area borders

--color-dark-base:    #134e4a   teal-900  footer body
--color-dark-surface: #115e59   teal-800  elevated elements in dark areas
--color-dark-border:  #0f766e   teal-700  borders in dark areas
--color-dark-bottom:  #0c3835   footer bottom bar

--color-dark-text:        #f0fdfa   headings on dark
--color-dark-text-muted:  #ccfbf1   body text on dark
--color-dark-text-subtle: #99f6e4   tertiary / copyright on dark
```

## Exception: Ant Design Vue theme

`src/App.vue` passes `colorPrimary` and `colorLink` as **literal hex** to `<a-config-provider>` — CSS variables cannot be used in JS config. When changing `--color-primary`, **also update** `App.vue` manually to keep Ant Design components in sync.

## Why teal was chosen

Teal reads as clean, fresh, and domestic — fits household items. Completely absent from Vietnamese ecommerce at scale (Shopee = orange-red, Tiki = blue, Lazada = orange). Creates a distinctive signature without breaking shopper expectations.

**How to apply:** To rebrand, change only `tailwind.css` tokens + the two hex values in `App.vue`. Everything else cascades automatically.
