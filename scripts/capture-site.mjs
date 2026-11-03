import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const name =
  process.argv[2] ||
  `i18n-${new Date()
    .toISOString()
    .replace(/[^0-9a-z]/gi, '-')
    .toLowerCase()}`;
if (!/^[a-z0-9-]+$/.test(name)) throw new Error('Use a simple screenshot folder name.');
const directory = join('docs/screenshots', name);
// An existing set is never overwritten.
await mkdir(directory);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const manifest = [];
try {
  for (const locale of ['en', 'es']) {
    for (const [device, viewport] of Object.entries({
      desktop: { width: 1440, height: 1000 },
      mobile: { width: 390, height: 844 },
    })) {
      const page = await browser.newPage({ viewport });
      await page.goto(
        new URL(
          locale === 'en' ? '/' : '/es/',
          process.env.TEST_BASE_URL || 'http://127.0.0.1:4322',
        ).href,
      );
      await page.evaluate(() => document.fonts.ready);
      for (const state of ['page', 'language-open']) {
        if (state === 'language-open') await page.getByRole('combobox').click();
        const file = `${locale}-${device}-${state}.png`;
        const path = join(directory, file);
        await page.screenshot({ path, animations: 'disabled' });
        const bytes = await readFile(path);
        manifest.push({
          file,
          locale,
          viewport,
          state,
          sha256: createHash('sha256').update(bytes).digest('hex'),
        });
      }
      await page.close();
    }
  }
  await writeFile(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', {
    flag: 'wx',
  });
  console.log(`Saved ${manifest.length} screenshots in ${directory}`);
} finally {
  await browser.close();
}
