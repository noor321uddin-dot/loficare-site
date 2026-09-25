// Bangladeshi mobile numbers: 01[3-9]XXXXXXXX, with or without +880 / 880, spaces or dashes. Returns E.164 or null.
export function normalizeBdPhone(raw) {
  if (!raw) return null;
  let s = String(raw).replace(/[\s\-().]/g, '');
  if (s.startsWith('+')) s = s.slice(1);
  if (s.startsWith('00880')) s = s.slice(2);
  if (s.startsWith('880')) s = s.slice(3);
  if (s.startsWith('0')) s = s.slice(1);
  if (!/^1[3-9]\d{8}$/.test(s)) return null;
  return '+880' + s;
}

export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
}
