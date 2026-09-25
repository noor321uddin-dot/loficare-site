/* Measurement adapter (build prompt section 10b). No-op until consent is granted.
   Providers: console in development, a Plausible-compatible call when ANALYTICS_DOMAIN is set (phase 8). */
type Props = Record<string, string | number | boolean | undefined>;
const queue: Array<[string, Props]> = [];
let consent = false;

export function grantConsent() {
  consent = true;
  for (const [n, p] of queue.splice(0)) send(n, p);
}
export function track(name: string, props: Props = {}) {
  if (!consent) { if (queue.length < 50) queue.push([name, props]); return; }
  send(name, props);
}
function send(name: string, props: Props) {
  const w = window as any;
  if (typeof w.plausible === 'function') w.plausible(name, { props });
  else if (import.meta.env.DEV) console.debug('[track]', name, props);
}
/* Delegated clicks: any element with data-track fires its event with the audience and label. */
export function bindTracking() {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track!, { audience: el.dataset.audience, label: (el.textContent || '').trim().slice(0, 40) });
  });
  try { if (localStorage.getItem('lc-consent') === 'yes') grantConsent(); } catch {}
}
