import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ticket FE-13 — SSG thuần (giữ nguyên cost model AD-04: hosting = 0, xem decisions-log.md mục "Ticket
// FE-13"). Ban đầu deploy GitHub Pages (project-page URL có base path `/marketing-site`). Chuyển sang
// Render Static Site (2026-09-30, xem decisions-log.md) để thống nhất hạ tầng với backend/frontend/
// background-jobs — Render serve ở root domain nên KHÔNG cần `base` nữa. KHÔNG dùng custom domain — chưa
// cần ở MVP, custom domain riêng theo club thuộc phạm vi Premium/AD-05, giữ chỗ backlog.
export default defineConfig({
  site: 'https://pickleheads-marketing.onrender.com',
  integrations: [sitemap()],
});
