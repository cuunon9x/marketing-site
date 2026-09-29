/**
 * Ticket FE-29 — submit `POST public/marketing/leads` (BE-42) qua `fetch()` runtime phía client, KHÔNG
 * native form POST/page reload. `data-api-base` đọc từ attribute do component set lúc build (Astro
 * frontmatter, `PUBLIC_API_BASE_URL`) — script này tự nó không đụng `import.meta.env` để tránh phụ thuộc
 * build tooling, chỉ đọc DOM attribute thuần (dễ test/tái dùng).
 */
export function initLeadForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-lead-form]');
  if (!form) {
    return;
  }

  const apiBaseUrl = form.dataset.apiBase ?? '';
  const statusEl = form.querySelector<HTMLElement>('[data-lead-form-status]');
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  function setStatus(state: 'idle' | 'pending' | 'success' | 'error', message: string): void {
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void handleSubmit();
  });

  async function handleSubmit(): Promise<void> {
    const formData = new FormData(form!);
    const body = {
      club_name: String(formData.get('club_name') ?? '').trim(),
      contact_name: String(formData.get('contact_name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      // Honeypot — client thật luôn để trống, BE-42 tự bỏ qua request khi field này bị điền.
      website: String(formData.get('website') ?? ''),
    };

    submitBtn?.setAttribute('disabled', 'true');
    setStatus('pending', 'Đang gửi...');

    try {
      const res = await fetch(`${apiBaseUrl}/public/marketing/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      form!.reset();
      setStatus('success', 'Cảm ơn bạn! Đội ngũ Pickleheads sẽ liên hệ lại sớm.');
    } catch {
      setStatus('error', 'Gửi không thành công. Vui lòng thử lại hoặc email trực tiếp hello@pickleheads.vn.');
    } finally {
      submitBtn?.removeAttribute('disabled');
    }
  }
}
