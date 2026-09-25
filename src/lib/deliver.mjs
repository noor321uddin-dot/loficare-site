// Outbound delivery of a stored lead: webhook (GoHighLevel inbound webhook takes the flat JSON as is) and email.
// Every attempt is recorded in the deliveries table; leads:retry replays anything pending or failed.
import { createDelivery, getLead, pendingDeliveries, markDelivered, markFailed } from './db.mjs';

export function flattenLead(lead) {
  return {
    source: 'loficare-site',
    lead_id: lead.id,
    form: lead.form,
    audience: lead.audience,
    full_name: lead.name || '',
    company_name: lead.facility || '',
    facility_type: lead.facility_type || '',
    role: lead.role || '',
    branches: lead.branches || '',
    phone: lead.phone || '',
    email: lead.email || '',
    contact: lead.contact_raw || '',
    message: lead.message || '',
    language: lead.language,
    duplicate: lead.duplicate ? 'yes' : 'no',
    created_at: lead.created_at,
  };
}

async function sendWebhook(env, lead) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flattenLead(lead)),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}

async function sendEmail(env, lead) {
  const { default: nodemailer } = await import('nodemailer');
  const transport = nodemailer.createTransport(env.SMTP_URL);
  const flat = flattenLead(lead);
  const lines = Object.entries(flat).map(([k, v]) => `${k}: ${v}`).join('\n');
  await transport.sendMail({
    from: env.LEAD_EMAIL_FROM || env.LEAD_EMAIL_TO,
    to: env.LEAD_EMAIL_TO,
    subject: `LofiCare ${lead.form} lead: ${lead.name || lead.contact_raw || lead.phone || lead.email}`,
    text: lines,
  });
}

async function attempt(db, env, delivery) {
  const lead = getLead(db, delivery.lead_id);
  if (!lead) { markFailed(db, delivery.id, 'lead missing'); return false; }
  try {
    if (delivery.channel === 'webhook') await sendWebhook(env, lead);
    else if (delivery.channel === 'email') await sendEmail(env, lead);
    else throw new Error(`unknown channel ${delivery.channel}`);
    markDelivered(db, delivery.id);
    return true;
  } catch (err) {
    markFailed(db, delivery.id, err && err.message ? err.message : String(err));
    return false;
  }
}

/** Create one delivery per configured channel and try them now. Safe to call without awaiting. */
export async function queueAndDeliver(db, env, leadId) {
  if (env.webhook) createDelivery(db, leadId, 'webhook');
  if (env.email) createDelivery(db, leadId, 'email');
  return runPending(db, env, { leadId });
}

/** Retry everything pending or failed with attempts left. Returns { tried, sent }. */
export async function runPending(db, env, { leadId = null, maxAttempts = 5 } = {}) {
  const rows = pendingDeliveries(db, { leadId, maxAttempts });
  let sent = 0;
  for (const d of rows) if (await attempt(db, env, d)) sent++;
  return { tried: rows.length, sent };
}
