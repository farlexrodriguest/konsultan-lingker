#!/usr/bin/env node
// Generate ULID Crockford base32 (26 karakter) — /dev/ulid untuk berkas konten baru.
// Wajib unik lintas koleksi; jalankan ulang untuk batch berikutnya.
// Usage: node scripts/generate-ulid.mjs <jumlah>
import crypto from 'node:crypto';

const CROCK = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // tanpa I, L, O, U
const used = new Set();

function ulid() {
  for (;;) {
    let t = BigInt(Date.now());
    let ts = '';
    for (let i = 0; i < 10; i += 1) {
      ts = CROCK[Number(t % 32n)] + ts;
      t /= 32n;
    }
    let rand = '';
    for (let i = 0; i < 16; i += 1) {
      rand = CROCK[crypto.randomInt(32)] + rand;
    }
    const value = ts + rand;
    if (/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(value) && !used.has(value)) {
      used.add(value);
      return value;
    }
  }
}

const count = Number.parseInt(process.argv[2] ?? '1', 10);
for (let i = 0; i < count; i += 1) {
  console.log(ulid());
}
