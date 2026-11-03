import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate, formatPeriod } from '../src/i18n/dates.ts';
import { createTranslator } from '../src/i18n/index.ts';
const t = createTranslator('en');
test('year precision does not acquire an invented month', () => {
  assert.equal(formatDate({ value: '2025', precision: 'year' }, 'en'), '2025');
  assert.equal(formatPeriod({ start: { value: '2025', precision: 'year' }, end: { value: '2026-08', precision: 'month' }, isCurrent: false }, 'en', t), '2025–Aug 2026');
});
test('current roles use localized Present while month dates remain stable across time zones', () => {
  assert.equal(formatPeriod({ start: { value: '2026-08', precision: 'month' }, end: null, isCurrent: true }, 'en', t), 'Aug 2026–Present');
  assert.equal(formatDate({ value: '2025-01', precision: 'month' }, 'en'), 'Jan 2025');
});
test('invalid and mismatched precision values are rejected', () => {
  assert.throws(() => formatDate({ value: '2025-14', precision: 'month' }, 'en'));
  assert.throws(() => formatDate({ value: '2025-01', precision: 'year' }, 'en'));
});
