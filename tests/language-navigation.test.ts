import assert from 'node:assert/strict';
import { test } from 'node:test';
import { languageDestination, localizedPageUrl } from '../src/i18n/navigation.ts';
import { getContent } from '../src/content/index.ts';

test('localized navigation preserves section and query and returns to the default root', () => {
  assert.equal(
    languageDestination('/es/', 'https://example.test/?source=cv#experience'),
    '/es/?source=cv#experience',
  );
  assert.equal(languageDestination('/', 'https://example.test/es/#education'), '/#education');
  assert.equal(localizedPageUrl('en'), '/');
  assert.equal(localizedPageUrl('es'), '/es/');
  assert.equal(getContent('es').url('contact'), '/es/#contact');
});
test('error page translations have explicit routes and external destinations are rejected', () => {
  assert.equal(localizedPageUrl('en', 'notFound'), '/404.html');
  assert.equal(localizedPageUrl('es', 'notFound'), '/es/404/');
  assert.throws(
    () => languageDestination('https://other.test/', 'https://example.test/'),
    /local paths/,
  );
  assert.throws(() => languageDestination('//other.test/', 'https://example.test/'), /local paths/);
});
