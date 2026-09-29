/**
 * Ticket FE-25 — scroll-reveal cho homepage + club page: IntersectionObserver, KHÔNG `scroll` event listener
 * (Design System mục "Marketing surface — premium redesign" §performance guardrail). Fallback tức thời dưới
 * `prefers-reduced-motion` đã xử lý bằng CSS thuần ở `tokens.css` ([data-reveal] trong @media reduce) — hàm
 * này không cần tự check lại điều kiện đó, chỉ cần add class khi phần tử vào viewport.
 */
export function initScrollReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (items.length === 0) {
    return;
  }
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );
  items.forEach((el) => observer.observe(el));
}
