import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import type { KingdomDatabase, PrincessProgress } from './src/types/kingdom';
import { buildDefaultDatabase } from './src/data/defaultKingdom';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'kingdom.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '65412012';
const TOKEN_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update(`akuu-world-${ADMIN_PASSWORD}`).digest('hex');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function readDb(): KingdomDatabase {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const fresh = buildDefaultDatabase();
      writeDb(fresh);
      return fresh;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as KingdomDatabase;
  } catch {
    const fresh = buildDefaultDatabase();
    writeDb(fresh);
    return fresh;
  }
}

function writeDb(data: KingdomDatabase): void {
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, DB_PATH);
}

function createAdminToken(): string {
  const payload = JSON.stringify({ role: 'tarun-admin', exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyAdminToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  if (sig !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as { exp: number };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Please sign in to Tarun’s Control Room.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Public kingdom data
  app.get('/api/kingdom', (_req, res) => {
    const db = readDb();
    res.json(db);
  });

  // Update Akuu's persistent progress (no auth needed for Akuu)
  app.post('/api/progress', (req, res) => {
    const db = readDb();
    const patch = req.body as Partial<PrincessProgress>;
    db.progress = {
      ...db.progress,
      ...patch,
      avatar: patch.avatar ? { ...db.progress.avatar, ...patch.avatar } : db.progress.avatar,
      pet: patch.pet ? { ...db.progress.pet, ...patch.pet } : db.progress.pet,
      dollhouse: patch.dollhouse ? { ...db.progress.dollhouse, ...patch.dollhouse } : db.progress.dollhouse,
      preferences: patch.preferences ? { ...db.progress.preferences, ...patch.preferences } : db.progress.preferences,
    };
    writeDb(db);
    res.json({ progress: db.progress });
  });

  // Akuu adds a personal diary entry
  app.post('/api/diary', (req, res) => {
    const db = readDb();
    const { title, content, mood, sticker } = req.body as {
      title?: string;
      content?: string;
      mood?: string;
      sticker?: string;
    };
    if (!title?.trim() || !content?.trim()) {
      res.status(400).json({ error: 'Title and entry text are required.' });
      return;
    }
    const entry = {
      id: `diary-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: title.trim(),
      content: content.trim(),
      mood: mood || 'Dreamy',
      sticker: sticker || 'sparkles',
      author: 'Akuu' as const,
    };
    db.diaryEntries.unshift(entry);
    writeDb(db);
    res.json({ entry, diaryEntries: db.diaryEntries });
  });

  // Admin auth
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body as { password?: string };
    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Incorrect royal passphrase.' });
      return;
    }
    res.json({ token: createAdminToken() });
  });

  app.post('/api/admin/verify', requireAdmin, (_req, res) => {
    res.json({ valid: true });
  });

  // Admin update site configuration
  app.put('/api/admin/config', requireAdmin, (req, res) => {
    const db = readDb();
    db.siteConfig = { ...db.siteConfig, ...req.body };
    writeDb(db);
    res.json({ siteConfig: db.siteConfig });
  });

  // Admin file upload (base64 -> disk in /data/uploads)
  app.post('/api/admin/upload', requireAdmin, (req, res) => {
    const { filename, dataBase64 } = req.body as { filename?: string; dataBase64?: string };
    if (!filename || !dataBase64) {
      res.status(400).json({ error: 'Missing filename or file payload.' });
      return;
    }
    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const stripped = dataBase64.includes(',') ? dataBase64.split(',')[1] : dataBase64;
    const buffer = Buffer.from(stripped, 'base64');
    const savedName = `${Date.now()}-${cleanName}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, savedName), buffer);
    res.json({ url: `/uploads/${savedName}` });
  });

  // Admin generic CRUD for photos, videos, albums, letters, audioTracks, diaryEntries, treasureBoxes, compliments
  app.post('/api/admin/collection/:type', requireAdmin, (req, res) => {
    const db = readDb();
    const { type } = req.params;
    const item = req.body;
    if (type === 'compliments' && typeof item?.text === 'string') {
      db.compliments.unshift(item.text);
      writeDb(db);
      res.json({ compliments: db.compliments });
      return;
    }
    const allowed = ['albums', 'photos', 'videos', 'letters', 'audioTracks', 'diaryEntries', 'treasureBoxes'] as const;
    if (!allowed.includes(type as (typeof allowed)[number])) {
      res.status(400).json({ error: 'Invalid collection type.' });
      return;
    }
    const key = type as (typeof allowed)[number];
    const newItem = { id: `${type}-${Date.now()}`, ...item };
    (db[key] as Array<{ id: string }>).unshift(newItem);
    writeDb(db);
    res.json({ item: newItem, items: db[key] });
  });

  app.put('/api/admin/collection/:type/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const { type, id } = req.params;
    const allowed = ['albums', 'photos', 'videos', 'letters', 'audioTracks', 'diaryEntries', 'treasureBoxes'] as const;
    if (!allowed.includes(type as (typeof allowed)[number])) {
      res.status(400).json({ error: 'Invalid collection type.' });
      return;
    }
    const key = type as (typeof allowed)[number];
    const list = db[key] as Array<{ id: string }>;
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Item not found.' });
      return;
    }
    list[idx] = { ...list[idx], ...req.body, id };
    writeDb(db);
    res.json({ item: list[idx], items: list });
  });

  app.delete('/api/admin/collection/:type/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const { type, id } = req.params;
    if (type === 'compliments') {
      const idx = Number(id);
      if (!Number.isNaN(idx) && idx >= 0 && idx < db.compliments.length) {
        db.compliments.splice(idx, 1);
        writeDb(db);
      }
      res.json({ compliments: db.compliments });
      return;
    }
    const allowed = ['albums', 'photos', 'videos', 'letters', 'audioTracks', 'diaryEntries', 'treasureBoxes'] as const;
    if (!allowed.includes(type as (typeof allowed)[number])) {
      res.status(400).json({ error: 'Invalid collection type.' });
      return;
    }
    const key = type as (typeof allowed)[number];
    const list = db[key] as Array<{ id: string }>;
    (db[key] as Array<{ id: string }>) = list.filter((x) => x.id !== id);
    writeDb(db);
    res.json({ items: db[key] });
  });

  // Backup & Restore
  app.get('/api/admin/backup', requireAdmin, (_req, res) => {
    const db = readDb();
    res.json(db);
  });

  app.post('/api/admin/restore', requireAdmin, (req, res) => {
    const candidate = req.body as KingdomDatabase;
    if (!candidate || !candidate.siteConfig || !candidate.progress) {
      res.status(400).json({ error: 'Invalid backup file structure.' });
      return;
    }
    writeDb(candidate);
    res.json({ ok: true, db: candidate });
  });

  // Vite dev middleware or static dist serving
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Akuu's Princess World server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
