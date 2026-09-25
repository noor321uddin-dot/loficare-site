import { track } from './track';

const bdPhone = (v: string) => /^(\+?880|0)1[3-9]\d{8}$/.test(v.replace(/[\s-]/g, ''));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Progressive enhancement for the demo and trial forms: inline validation, JSON submit, status region. */
export function enhanceForm(form: HTMLFormElement) {
  const statusEl = form.dataset.statusId ? document.getElementById(form.dataset.statusId) : null;
  const setInvalid = (name: string, invalid: boolean, message?: string) => {
    const field = form.querySelector<HTMLElement>(`[data-field="${name}"]`);
    if (!field) return;
    field.dataset.invalid = String(invalid);
    if (invalid && message) { const err = field.querySelector<HTMLElement>('.error'); if (err) err.textContent = message; }
  };
  const showStatus = (text: string) => { if (statusEl) { statusEl.hidden = false; statusEl.textContent = text; statusEl.focus(); } };

  const ts = form.querySelector<HTMLInputElement>('input[name="ts"]');
  if (ts) ts.value = String(Date.now());
  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; track('form_start', { form: form.dataset.formName, language: document.documentElement.lang }); } });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    let ok = true;
    for (const el of form.querySelectorAll<HTMLInputElement>('[required]')) {
      const value = el.type === 'radio' ? String(data.get(el.name) || '') : el.value.trim();
      const bad = !value;
      setInvalid(el.dataset.field || el.name, bad);
      if (bad) ok = false;
    }
    const phone = String(data.get('phone') || '').trim();
    const mail = String(data.get('email') || '').trim();
    if (form.dataset.contact === 'either') {
      const none = !phone && !mail;
      setInvalid('contact', none);
      if (none) ok = false;
      if (phone && !bdPhone(phone)) { setInvalid('phone', true); ok = false; } else setInvalid('phone', false);
      if (mail && !isEmail(mail)) { setInvalid('email', true); ok = false; } else setInvalid('email', false);
    }
    if (form.dataset.contact === 'single') {
      const c = String(data.get('contact') || '').trim();
      const bad = !(bdPhone(c) || isEmail(c));
      setInvalid('contact', bad);
      if (bad) ok = false;
    }
    if (!ok) { form.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea')?.focus(); return; }

    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = form.dataset.sending || label;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const json: any = await res.json().catch(() => ({}));
      if (res.ok) {
        track('form_complete', { form: form.dataset.formName, facility_type: String(data.get('facility_type') || ''), language: document.documentElement.lang });
        form.hidden = true;
        showStatus(form.dataset.success || '');
      } else {
        if (json && json.errors) for (const [k, msg] of Object.entries(json.errors)) setInvalid(k, true, typeof msg === 'string' ? msg : undefined);
        showStatus((json && json.message) || form.dataset.errorServer || '');
      }
    } catch {
      showStatus(form.dataset.errorServer || '');
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}
