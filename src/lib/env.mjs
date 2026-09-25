// Configuration, validated once. Plain JS so the boot script and the CLI commands can import it without a build.
import { z } from 'zod';

const optionalString = z.string().trim().optional().or(z.literal(''));
const schema = z.object({
  SITE_URL: z.string().url().default('http://127.0.0.1:4321'),
  DATABASE_PATH: z.string().min(1).default('./data/leads.db'),
  LEAD_WEBHOOK_URL: z.string().url().optional().or(z.literal('')),
  SMTP_URL: optionalString,
  LEAD_EMAIL_TO: optionalString,
  LEAD_EMAIL_FROM: optionalString,
  TURNSTILE_SECRET: optionalString,
  TURNSTILE_SITE_KEY: optionalString,
  ANALYTICS_DOMAIN: optionalString,
  CONTACT_PHONE: z.string().default('+8801000000000'),
  CONTACT_WHATSAPP: z.string().default('8801000000000'),
  RATE_LIMIT_PER_10MIN: z.coerce.number().int().positive().default(10),
});

let cached = null;

/**
 * Read and validate configuration. Pass import.meta.env from Astro code so .env values are seen in dev;
 * scripts pass nothing and read process.env (start them with --env-file-if-exists=.env).
 * Throws with every problem listed, so a bad configuration never half-starts.
 */
export function loadEnv(extra) {
  if (cached) return cached;
  const source = { ...process.env, ...(extra || {}) };
  const picked = {};
  for (const key of Object.keys(schema.shape)) if (source[key] !== undefined && source[key] !== '') picked[key] = source[key];
  const result = schema.safeParse(picked);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`);
    throw new Error('Invalid configuration:\n' + lines.join('\n'));
  }
  const e = result.data;
  cached = {
    ...e,
    webhook: Boolean(e.LEAD_WEBHOOK_URL),
    email: Boolean(e.SMTP_URL && e.LEAD_EMAIL_TO),
    turnstile: Boolean(e.TURNSTILE_SECRET),
    analytics: Boolean(e.ANALYTICS_DOMAIN),
  };
  return cached;
}

export function resetEnvCache() { cached = null; }
