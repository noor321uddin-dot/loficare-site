// leads:retry. Replays every webhook or email delivery that is pending or failed with attempts left.
import { loadEnv } from '../src/lib/env.mjs';
import { getDb, stats } from '../src/lib/db.mjs';
import { runPending } from '../src/lib/deliver.mjs';

const env = loadEnv();
if (!env.webhook && !env.email) console.log('no delivery channel configured (LEAD_WEBHOOK_URL, SMTP_URL + LEAD_EMAIL_TO); nothing to retry');
const db = getDb(env.DATABASE_PATH);
const result = await runPending(db, env);
console.log(`retried ${result.tried} delivery(ies), ${result.sent} sent; ${stats(db).pendingDeliveries} still pending`);
