import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import raw from '../src/content/portfolio.data.json' with { type: 'json' };
import { validateContent, validateDictionaries } from '../src/content/validation.ts';
import { dictionaries, getMessage } from '../src/i18n/index.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const baseKeys = validateDictionaries(dictionaries);
for (const messages of Object.values(dictionaries)) {
  validateContent(raw, messages);
}
async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? filesAt(join(directory, entry.name)) : [join(directory, entry.name)],
    ),
  );
  return nested.flat();
}
for (const file of (await filesAt(join(root, 'src'))).filter((file) =>
  /\.(astro|ts)$/.test(file),
)) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) {
    for (const dictionary of Object.values(dictionaries)) getMessage(dictionary, match[1]);
  }
}
if (raw.profile.resumeUrl) {
  const resume = await readFile(resolve(root, 'public', `.${raw.profile.resumeUrl}`));
  if (resume.subarray(0, 5).toString() !== '%PDF-') throw new Error('Resume is not a PDF');
  const actualHash = createHash('sha256').update(resume).digest('hex');
  const expected = JSON.parse(await readFile(join(root, 'docs/resume-source.json'), 'utf8'));
  if (actualHash !== expected.sha256)
    throw new Error(
      'CV differs from the recorded source. Review identity/contact and update docs/resume-source.json deliberately.',
    );
}
for (const file of ['pearl-desktop.webp', 'pearl-mobile.webp']) {
  if ((await stat(join(root, 'public/images', file))).size > 250_000)
    throw new Error(`Background exceeds image budget: ${file}`);
}
console.log(
  `Content valid: ${baseKeys.length} matching messages in ${Object.keys(dictionaries).join(', ')}; interpolations, references, dates, source PDF and image budgets checked.`,
);
