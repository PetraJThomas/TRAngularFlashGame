#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = join(__dirname, '..', 'public', 'flash-questions');

const url = process.env.CONVEX_URL?.replace(/\/$/, '');
const secret = process.env.IMPORT_SECRET;

if (!url) {
  console.error('CONVEX_URL env var is required (e.g. from .env.local).');
  process.exit(1);
}
if (!secret) {
  console.error('IMPORT_SECRET env var is required.');
  process.exit(1);
}

const siteUrl = url.replace('.convex.cloud', '.convex.site');

async function call(path, body) {
  const res = await fetch(`${siteUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(body ?? {}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

const files = (await readdir(QUESTIONS_DIR)).filter(
  (f) => f.endsWith('.json') && f !== '_index.json'
);

for (const file of files) {
  const slug = file.replace(/\.json$/, '');
  const raw = JSON.parse(await readFile(join(QUESTIONS_DIR, file), 'utf8'));
  try {
    const result = await call('/import-deck', {
      slug,
      name: raw.name ?? slug,
      questions: raw.questions,
    });
    console.log(`✓ ${result.slug} (${result.count} questions)`);
  } catch (err) {
    console.error(`✗ ${slug}:`, err.message);
    process.exitCode = 1;
  }
}

const refresh = await call('/refresh-index');
console.log(`✓ Refreshed index for ${refresh.decks} decks`);
