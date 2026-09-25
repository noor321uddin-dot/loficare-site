// Lead storage on the Node built-in SQLite (decision D7): zero native modules, one file, one volume.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const MIGRATIONS = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form TEXT NOT NULL,
        audience TEXT NOT NULL,
        name TEXT, facility TEXT, facility_type TEXT, role TEXT, branches TEXT, message TEXT,
        phone TEXT, email TEXT, contact_raw TEXT,
        language TEXT NOT NULL DEFAULT 'en',
        source_page TEXT, user_agent TEXT, ip_hash TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        duplicate INTEGER NOT NULL DEFAULT 0,
        spam INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
      );
      CREATE INDEX IF NOT EXISTS leads_phone ON leads(phone);
      CREATE INDEX IF NOT EXISTS leads_email ON leads(email);
      CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at);
      CREATE TABLE IF NOT EXISTS deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER NOT NULL REFERENCES leads(id),
        channel TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        attempts INTEGER NOT NULL DEFAULT 0,
        last_error TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
        delivered_at TEXT
      );
      CREATE INDEX IF NOT EXISTS deliveries_status ON deliveries(status);
    `,
  },
];

const handles = new Map();

/** Open (once per path), enable WAL, apply migrations. */
export function getDb(dbPath) {
  const key = path.resolve(dbPath);
  if (handles.has(key)) return handles.get(key);
  mkdirSync(path.dirname(key), { recursive: true });
  const db = new DatabaseSync(key);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;');
  db.exec('CREATE TABLE IF NOT EXISTS migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)');
  const applied = new Set(db.prepare('SELECT version FROM migrations').all().map((r) => r.version));
  for (const m of MIGRATIONS) {
    if (applied.has(m.version)) continue;
    db.exec(m.sql);
    db.prepare('INSERT INTO migrations (version, applied_at) VALUES (?, ?)').run(m.version, new Date().toISOString());
  }
  handles.set(key, db);
  return db;
}

const nz = (v) => (v === undefined || v === '' ? null : v);

export function insertLead(db, lead) {
  const info = db
    .prepare(
      `INSERT INTO leads (form, audience, name, facility, facility_type, role, branches, message, phone, email, contact_raw, language, source_page, user_agent, ip_hash, duplicate, spam)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      lead.form, lead.audience, nz(lead.name), nz(lead.facility), nz(lead.facility_type), nz(lead.role), nz(lead.branches), nz(lead.message),
      nz(lead.phone), nz(lead.email), nz(lead.contact_raw), lead.language || 'en', nz(lead.source_page), nz(lead.user_agent), nz(lead.ip_hash),
      lead.duplicate ? 1 : 0, lead.spam ? 1 : 0,
    );
  return Number(info.lastInsertRowid);
}

export function getLead(db, id) {
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id) || null;
}

/** Same phone or email within 24 hours: stored and flagged, never rejected. */
export function findRecentDuplicate(db, { phone, email }) {
  if (!phone && !email) return null;
  return (
    db
      .prepare(
        `SELECT id FROM leads WHERE spam = 0 AND created_at > strftime('%Y-%m-%d %H:%M:%f', 'now', '-1 day')
         AND ((? IS NOT NULL AND phone = ?) OR (? IS NOT NULL AND email = ?)) ORDER BY id DESC LIMIT 1`,
      )
      .get(nz(phone), nz(phone), nz(email), nz(email)) || null
  );
}

export function createDelivery(db, leadId, channel) {
  return Number(db.prepare('INSERT INTO deliveries (lead_id, channel) VALUES (?, ?)').run(leadId, channel).lastInsertRowid);
}

export function pendingDeliveries(db, { leadId = null, maxAttempts = 5 } = {}) {
  return leadId == null
    ? db.prepare(`SELECT * FROM deliveries WHERE status IN ('pending', 'failed') AND attempts < ? ORDER BY id`).all(maxAttempts)
    : db.prepare(`SELECT * FROM deliveries WHERE lead_id = ? AND status IN ('pending', 'failed') AND attempts < ? ORDER BY id`).all(leadId, maxAttempts);
}

export function markDelivered(db, id) {
  db.prepare(`UPDATE deliveries SET status = 'sent', attempts = attempts + 1, last_error = NULL, delivered_at = strftime('%Y-%m-%d %H:%M:%f', 'now') WHERE id = ?`).run(id);
}

export function markFailed(db, id, error) {
  db.prepare(`UPDATE deliveries SET status = 'failed', attempts = attempts + 1, last_error = ? WHERE id = ?`).run(String(error).slice(0, 500), id);
}

export function stats(db) {
  const leads = db.prepare('SELECT COUNT(*) AS n FROM leads WHERE spam = 0').get().n;
  const spam = db.prepare('SELECT COUNT(*) AS n FROM leads WHERE spam = 1').get().n;
  const pending = db.prepare(`SELECT COUNT(*) AS n FROM deliveries WHERE status IN ('pending', 'failed') AND attempts < 5`).get().n;
  return { leads, spam, pendingDeliveries: pending };
}
