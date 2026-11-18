#!/usr/bin/env node
/**
 * Enforce .cursorrules file-size cap: max 250 lines per .ts/.tsx source file.
 * Excludes *.test.*, *.spec.*, and static fixture/sample data files.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const MAX_LINES = 250;
const EXCLUDED_NAME =
  /\.(test|spec)\.(ts|tsx)$|sampleData\.ts$|fixtures?\./i;

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(ts|tsx)$/.test(entry) && !EXCLUDED_NAME.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const offenders = [];
for (const file of walk(SRC)) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/).length;
  if (lines > MAX_LINES) {
    offenders.push({ file: relative(ROOT, file), lines });
  }
}

if (offenders.length > 0) {
  console.error(`Line-count check failed (max ${MAX_LINES} lines):\n`);
  for (const { file, lines } of offenders) {
    console.error(`  ${file}: ${lines} lines`);
  }
  process.exit(1);
}

console.log(`check:lines passed (all src files ≤ ${MAX_LINES} lines).`);
