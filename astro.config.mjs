import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ticket FE-13 — SSG thuần (giữ nguyên cost model AD-04: hosting = 0, xem decisions-log.md mục "Ticket
// FE-13"). `site`/`base` theo đúng GitHub Pages project-page URL của repo riêng `pickleheads-marketing-site`
// (KHÔNG dùng custom domain — chưa cần ở MVP, custom domain riêng theo club thuộc phạm vi Premium/AD-05,
// giữ chỗ backlog, không triển khai ở ticket này).
export default defineConfig({
  site: 'https://cuunon9x.github.io',
  base: '/pickleheads-marketing-site',
  integrations: [sitemap()],
});
