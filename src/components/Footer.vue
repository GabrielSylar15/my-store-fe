<template>
  <footer class="footer">
    <!-- ===== Top: link columns ===== -->
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 text-sm text-dark-text-muted">
        <nav v-for="col in linkColumns" :key="col.title" :aria-label="col.title">
          <h3 class="footer-heading">{{ col.title }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in col.links" :key="link.label">
              <a
                  :href="link.href || '#'"
                  class="footer-link"
                  :title="link.label"
              >{{ link.label }}</a>
            </li>
          </ul>
        </nav>

        <!-- Social column -->
        <nav aria-label="Theo dõi GIADE">
          <h3 class="footer-heading">Theo Dõi GIADE</h3>
          <ul class="space-y-2.5">
            <li v-for="s in socials" :key="s.label">
              <a :href="s.href" :title="s.label" class="footer-link icon-row">
                <iconify-icon :icon="s.icon" width="18" height="18"></iconify-icon>
                <span>{{ s.label }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- App download column -->
        <div>
          <h3 class="footer-heading">Tải Ứng Dụng GIADE</h3>
          <div class="flex items-start gap-3">
            <div class="w-20 h-20 bg-dark-surface border border-dark-border rounded flex items-center justify-center text-dark-text-muted flex-shrink-0">
              <iconify-icon icon="material-symbols:qr-code-2" width="56" height="56"></iconify-icon>
            </div>
            <div class="flex flex-col gap-1.5 min-w-0">
              <a v-for="a in appStores" :key="a.label" :href="a.href" :title="a.label" class="app-badge">
                <iconify-icon :icon="a.icon" width="16" height="16"></iconify-icon>
                <span>{{ a.label }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Mid: payment + shipping partners ===== -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-dark-border">
        <div>
          <h3 class="footer-heading">Phương Thức Thanh Toán</h3>
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="p in paymentMethods" :key="p" class="logo-chip">{{ p }}</span>
          </div>
        </div>
        <div>
          <h3 class="footer-heading">Đơn Vị Vận Chuyển</h3>
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="s in shippingPartners" :key="s" class="logo-chip">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Bottom bar ===== -->
    <div class="bg-dark-bottom border-t border-dark-bottom">
      <div class="max-w-7xl mx-auto px-4 py-5 text-xs text-dark-text-subtle">
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          <a v-for="l in legalLinks" :key="l" class="footer-link" href="#" :title="l">{{ l }}</a>
        </div>
        <p class="text-center m-0 text-dark-text-subtle">
          © {{ year }} GIADE. Tất cả các quyền được bảo lưu.
        </p>
        <p class="text-center mt-1 m-0 text-dark-text-subtle">
          Quốc gia &amp; Khu vực: Việt Nam
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FooterLink { label: string; href?: string }
interface FooterColumn { title: string; links: FooterLink[] }

const linkColumns: FooterColumn[] = [
  {
    title: 'Dịch Vụ Khách Hàng',
    links: [
      { label: 'Trung Tâm Trợ Giúp' },
      { label: 'GIADE Blog' },
      { label: 'GIADE Mall' },
      { label: 'Hướng Dẫn Mua Hàng' },
      { label: 'Hướng Dẫn Bán Hàng' },
      { label: 'Thanh Toán' },
      { label: 'GIADE Xu' },
      { label: 'Vận Chuyển' },
      { label: 'Trả Hàng & Hoàn Tiền' },
      { label: 'Chính Sách Bảo Hành' },
    ],
  },
  {
    title: 'GIADE Việt Nam',
    links: [
      { label: 'Về GIADE' },
      { label: 'Tuyển Dụng' },
      { label: 'Điều Khoản GIADE' },
      { label: 'Chính Sách Bảo Mật' },
      { label: 'Chính Hãng' },
      { label: 'Kênh Người Bán' },
      { label: 'Flash Sale' },
      { label: 'Tiếp Thị Liên Kết' },
      { label: 'Liên Hệ Truyền Thông' },
    ],
  },
]

interface Social { label: string; icon: string; href: string }
const socials: Social[] = [
  { label: 'Facebook',  icon: 'logos:facebook',         href: '#' },
  { label: 'Instagram', icon: 'skill-icons:instagram',  href: '#' },
  { label: 'TikTok',    icon: 'logos:tiktok-icon',      href: '#' },
  { label: 'YouTube',   icon: 'logos:youtube-icon',     href: '#' },
]

interface AppStore { label: string; icon: string; href: string }
const appStores: AppStore[] = [
  { label: 'App Store',   icon: 'logos:apple-app-store', href: '#' },
  { label: 'Google Play', icon: 'logos:google-play-icon', href: '#' },
  { label: 'AppGallery',  icon: 'logos:huawei',           href: '#' },
]

const paymentMethods: string[] = ['VISA', 'MasterCard', 'JCB', 'ATM', 'COD', 'GIADE Pay']
const shippingPartners: string[] = ['GIADE Express', 'Giao Hàng Nhanh', 'Giao Hàng Tiết Kiệm', 'J&T Express', 'Ninja Van']
const legalLinks: string[] = [
  'Chính Sách Bảo Mật',
  'Quy Chế Hoạt Động',
  'Chính Sách Vận Chuyển',
  'Chính Sách Trả Hàng & Hoàn Tiền',
]

const year = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  margin-top: 40px;
  background: var(--color-dark-base);
}

.footer-heading {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-dark-text);
  text-transform: uppercase;
  letter-spacing: .04em;
  margin-bottom: 14px;
}

.footer-link {
  display: inline-block;
  font-size: 13px;
  color: var(--color-dark-text-subtle);
  transition: color .15s;
  text-decoration: none;
  cursor: pointer;
}
.footer-link:hover {
  color: var(--color-primary-light);
}

/* iconify-icon is a custom element with default `display: inline`,
   which breaks flex gap. Force it to be a proper inline-flex box. */
.footer :deep(iconify-icon) {
  display: inline-flex;
  vertical-align: middle;
  line-height: 0;
}

.icon-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.app-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--color-dark-text-muted);
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 4px;
  text-decoration: none;
  transition: border-color .15s, color .15s;
  min-width: 110px;
}
.app-badge:hover {
  border-color: var(--color-primary);
  color: var(--color-primary-light);
}

.logo-chip {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 500;
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 3px;
  color: var(--color-dark-text-muted);
}
</style>
