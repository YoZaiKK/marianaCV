import assert from 'node:assert/strict';
import { test } from 'node:test';
import raw from '../src/content/portfolio.data.json' with { type: 'json' };
import en from '../src/content/en.json' with { type: 'json' };
import {
  validateContent,
  flattenMessages,
  validateDictionaries,
} from '../src/content/validation.ts';
import { dictionaries } from '../src/i18n/index.ts';
import { published, getContent } from '../src/content/index.ts';
import { createTranslator } from '../src/i18n/index.ts';

test('all source collections and translation references validate', () => {
  assert.equal(validateContent(raw, en).experience.length, 4);
  assert.ok(Object.values(flattenMessages(en)).every((value) => typeof value === 'string'));
});
test('broken relationships and duplicate identifiers are rejected', () => {
  const broken = structuredClone(raw);
  broken.experience[0].organizationId = 'missing-organization';
  assert.throws(() => validateContent(broken, en), /Unresolved reference/);
  const duplicate = structuredClone(raw);
  duplicate.experience[1].id = duplicate.experience[0].id;
  assert.throws(() => validateContent(duplicate, en), /Duplicate identifiers/);
});
test('missing translations and unresolved interpolations cannot leak into output', () => {
  const messages = structuredClone(en);
  delete (messages.experience.carters as Partial<typeof messages.experience.carters>).role;
  assert.throws(() => validateContent(raw, messages), /Missing string translation/);
  assert.throws(() => createTranslator('en')('meta.homeTitle'), /Missing interpolation/);
  assert.throws(() => flattenMessages({ list: ['not a string leaf'] }), /Translation leaves/);
});
test('completed periods never silently become current and invalid months fail', () => {
  const missing = structuredClone(raw);
  missing.experience[0].period.isCurrent = false;
  assert.throws(() => validateContent(missing, en), /Completed periods/);
  const invalid = structuredClone(raw);
  invalid.experience[0].period.start.value = '2026-13';
  assert.throws(() => validateContent(invalid, en));
});
test('publication filtering omits drafts and respects explicit order without mutating input', () => {
  const input = [
    { id: 'second', order: 2, publicationStatus: 'published' as const },
    { id: 'draft', order: 1, publicationStatus: 'draft' as const },
    { id: 'first', order: 1, publicationStatus: 'published' as const },
  ];
  assert.deepEqual(
    published(input).map((item) => item.id),
    ['first', 'second'],
  );
  assert.equal(input[0].id, 'second');
});
test('navigation excludes sections whose entries are all drafts', () => {
  const draft = structuredClone(raw);
  for (const entry of [...draft.experience, ...draft.education, ...draft.expertise])
    entry.publicationStatus = 'draft';
  const content = getContent('en', draft);
  assert.deepEqual(
    content.navigation.map((link) => link.id),
    ['about', 'contact'],
  );
  assert.equal(content.sections.experience, false);
});
test('English and Spanish share every key and interpolation and both validate the same data', () => {
  assert.ok(validateDictionaries(dictionaries).length > 0);
  for (const dictionary of Object.values(dictionaries)) validateContent(raw, dictionary);
  const broken = structuredClone(dictionaries);
  broken.es.language = { label: 'Idioma' };
  assert.throws(() => validateDictionaries(broken), /keys differ/);
  const placeholder = structuredClone(dictionaries);
  placeholder.es.meta = {
    ...(placeholder.es.meta as Record<string, string>),
    homeTitle: '{{nombre}} | Recursos Humanos',
  };
  assert.throws(() => validateDictionaries(placeholder), /interpolations differ/);
});
