// Shared handler for the two lead forms. Accepts JSON (the enhanced forms) and form-encoded posts (no JavaScript),
// validates, filters spam, rate-limits, stores, queues delivery, and answers in the visitor's language.
import type { APIContext } from 'astro';
import { createHash } from 'node:crypto';
import { loadEnv } from './env.mjs';
import { getDb, insertLead, findRecentDuplicate } from './db.mjs';
import { queueAndDeliver } from './deliver.mjs';
import { allow } from './ratelimit.mjs';
import { normalizeBdPhone, isEmail } from './phone.mjs';
import { t, type Locale } from '../i18n';

type Form = 'demo' | 'trial';
const MIN_FILL_MS = 2500;
const FACILITY_TYPES = new Set(['diagnostic_centre', 'hospital']);
const BRANCHES = new Set(['1', '2-3', '4+']);

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

async function readBody(request: Request): Promise<Record<string, string>> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await request.json().catch(() => ({}));
    return Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [k, v == null ? '' : String(v)]));
  }
  const fd = await request.formData().catch(() => null);
  const out: Record<string, string> = {};
  if (fd) for (const [k, v] of fd.entries()) out[k] = String(v);
  return out;
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data: any = await res.json();
    return Boolean(data && data.success);
  } catch {
    return false;
  }
}

export async function handleLead(ctx: APIContext, form: Form): Promise<Response> {
  const env = loadEnv(import.meta.env);
  const { request } = ctx;
  const body = await readBody(request);
  const wantsJson = (request.headers.get('content-type') || '').includes('application/json') || (request.headers.get('accept') || '').includes('application/json');
  const language: Locale = body.language === 'bn' ? 'bn' : 'en';
  const thanks = `${language === 'bn' ? '/bn' : ''}/thank-you?form=${form}`;
  const fail = (status: number, payload: Record<string, unknown>) => (wantsJson ? json(status, { ok: false, ...payload }) : ctx.redirect(`${language === 'bn' ? '/bn' : ''}/#${form === 'demo' ? 'demo' : 'trial'}`, 303));

  let ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  if (!ip) { try { ip = ctx.clientAddress; } catch { ip = '0.0.0.0'; } }
  if (!allow(`${form}:${ip}`, env.RATE_LIMIT_PER_10MIN, 10 * 60 * 1000)) {
    return fail(429, { message: t(language, 'form.error.server') });
  }

  if (env.turnstile) {
    const token = body['cf-turnstile-response'];
    if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET!, token, ip))) return fail(400, { message: t(language, 'form.error.server') });
  }

  const tooFast = body.ts ? Date.now() - Number(body.ts) < MIN_FILL_MS : false;
  const spam = Boolean(body.website) || tooFast;

  const errors: Record<string, string> = {};
  const lead: Record<string, string | undefined> = { form, language };
  const clean = (v: string | undefined, max: number) => (v || '').trim().slice(0, max);

  if (form === 'demo') {
    lead.audience = 'facility';
    lead.name = clean(body.name, 120);
    lead.facility = clean(body.facility, 160);
    lead.facility_type = clean(body.facility_type, 40);
    lead.role = clean(body.role, 80);
    lead.branches = BRANCHES.has(body.branches) ? body.branches : '1';
    lead.message = clean(body.message, 2000) || undefined;
    if (lead.name.length < 2) errors.name = t(language, 'form.error.required');
    if (lead.facility.length < 2) errors.facility = t(language, 'form.error.required');
    if (!FACILITY_TYPES.has(lead.facility_type)) errors.facility_type = t(language, 'form.error.required');
    if (lead.role.length < 2) errors.role = t(language, 'form.error.required');
    const phoneRaw = clean(body.phone, 40);
    const emailRaw = clean(body.email, 160).toLowerCase();
    if (!phoneRaw && !emailRaw) errors.contact = t(language, 'form.error.contact');
    if (phoneRaw) { const p = normalizeBdPhone(phoneRaw); if (p) lead.phone = p; else errors.phone = t(language, 'form.error.phone'); }
    if (emailRaw) { if (isEmail(emailRaw)) lead.email = emailRaw; else errors.email = t(language, 'form.error.email'); }
  } else {
    lead.audience = 'doctor';
    const contact = clean(body.contact, 160);
    lead.contact_raw = contact;
    const p = normalizeBdPhone(contact);
    if (p) lead.phone = p;
    else if (isEmail(contact)) lead.email = contact.toLowerCase();
    else errors.contact = t(language, 'trial.error');
  }

  if (Object.keys(errors).length) return fail(400, { errors });

  const db = getDb(env.DATABASE_PATH);
  const duplicate = !spam && Boolean(findRecentDuplicate(db, { phone: lead.phone, email: lead.email }));
  const ua = (request.headers.get('user-agent') || '').slice(0, 200);
  const ipHash = createHash('sha256').update(`${ip}|loficare`).digest('hex').slice(0, 24);
  const id = insertLead(db, {
    ...lead,
    source_page: (request.headers.get('referer') || '').slice(0, 300),
    user_agent: ua,
    ip_hash: ipHash,
    duplicate,
    spam,
  });

  if (!spam) queueAndDeliver(db, env, id).catch((err) => console.error('[leads] delivery failed to start', err));

  return wantsJson ? json(200, { ok: true, id, duplicate, redirect: thanks }) : ctx.redirect(thanks, 303);
}
