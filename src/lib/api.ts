/**
 * Ticket BE-13/FE-13 — fetch build-time (SSG) từ Backend API. Chạy trong Node lúc `astro build` (frontmatter/
 * `getStaticPaths()`), KHÔNG bao giờ chạy trong trình duyệt — không cần lo lộ `API_BASE_URL` ra bundle JS
 * (trang này không có fetch runtime phía client, khác `apps/frontend`).
 */
const API_BASE_URL = import.meta.env.API_BASE_URL ?? 'http://localhost:3000';

export interface PublicClubListItem {
  id: string;
  name: string;
  sport_type: string;
  slug: string;
  member_count: number;
}

export interface PublicRankingItem {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  current_rating: number;
  is_provisional: boolean;
  games_played: number;
}

export interface PublicClubMarketingPage {
  name: string;
  sport_type: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  ranking: { type: 'overall'; items: PublicRankingItem[] };
}

/** Mọi response thành công của Backend bọc `{ data: ... }` (backend.md mục 3.7) — unwrap ở đây 1 lần, dùng chung. */
async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  const body = (await res.json()) as { data?: T; error?: { code: string; message: string } };
  if (!res.ok) {
    throw new Error(`API ${path} thất bại: ${res.status} ${body.error?.code ?? ''} ${body.error?.message ?? ''}`.trim());
  }
  return body.data as T;
}

/**
 * `GET /clubs` (đã có sẵn, dùng cho luồng "club công khai" US-02/UC-03) — bổ sung `slug` vào response ở
 * Ticket BE-13/FE-13 (xem decisions-log.md) để đủ dữ liệu cho `getStaticPaths()`/sitemap.xml. Tự phân trang
 * qua hết `total` (endpoint giới hạn `limit` tối đa 100/trang, không có chế độ "lấy hết 1 lần" — xem
 * `pagination.dto.ts`).
 */
export async function listAllPublicClubs(): Promise<PublicClubListItem[]> {
  const limit = 100;
  let page = 1;
  const all: PublicClubListItem[] = [];
  for (;;) {
    const result = await apiGet<{ items: PublicClubListItem[]; total: number }>(`/clubs?limit=${limit}&page=${page}`);
    all.push(...result.items);
    if (result.items.length === 0 || all.length >= result.total) {
      break;
    }
    page += 1;
  }
  return all;
}

/** `GET public/marketing/clubs/:slug` (Ticket BE-13) — 404 (slug sai/club private) làm build page này fail rõ ràng thay vì render trang rỗng. */
export async function getClubMarketingPage(slug: string): Promise<PublicClubMarketingPage> {
  return apiGet<PublicClubMarketingPage>(`/public/marketing/clubs/${encodeURIComponent(slug)}`);
}
