import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';

test('semantic content, anchors, CV and accessible disclosure work in the compiled site', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Mariana Alejo Flores | Human Resources');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.experience-card')).toHaveCount(4);
  await expect(page.locator('.date-range').filter({ hasText: /^2025–Aug 2026$/ })).toHaveCount(1);
  const anchors = await page
    .locator('a[href*="#"]')
    .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).hash).filter(Boolean));
  for (const anchor of anchors)
    await expect(page.locator(`[id="${anchor.slice(1)}"]`)).toHaveCount(1);
  const disclosure = page.locator('details').first();
  const summary = disclosure.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure.locator('li').first()).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(disclosure).not.toHaveAttribute('open');
  const pdf = await request.get('/resume/mariana-alejo-flores-cv.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect(
    createHash('sha256')
      .update(await pdf.body())
      .digest('hex'),
  ).toBe('6aeea4dcdd6fd304bf268936448c0da6f54e0e6dcf7d44785ede833d0d3d2a21');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.header-cv').click();
  expect((await downloadEvent).suggestedFilename()).toBe('mariana-alejo-flores-cv.pdf');
  expect(errors).toEqual([]);
  expect(await page.locator('body').innerText()).not.toContain('{{');
  await page.locator('details').evaluateAll((elements) =>
    elements.forEach((element) => {
      (element as HTMLDetailsElement).open = true;
    }),
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('email copy reports success and failure with an always-available mail link', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          (window as unknown as { copiedEmail: string }).copiedEmail = value;
        },
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Email address copied.');
  expect(
    await page.evaluate(() => (window as unknown as { copiedEmail: string }).copiedEmail),
  ).toBe('marianalejo81@gmail.com');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Denied');
    };
  });
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toContainText('could not be copied');
  await expect(page.getByRole('link', { name: 'Send an email' })).toHaveAttribute(
    'href',
    'mailto:marianalejo81@gmail.com',
  );
});

test('fixed background changes reversibly, stays still at rest, and remeasures expanded content', async ({
  page,
}) => {
  await page.goto('/');
  const background = page.locator('.pearl-background');
  await expect(background).toHaveAttribute('data-scroll-progress', '0');
  const initialGeometry = await background.boundingBox();
  await page.evaluate(() =>
    window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2),
  );
  await expect
    .poll(async () => Number(await background.getAttribute('data-scroll-progress')))
    .toBeCloseTo(0.5, 2);
  const middle = await background.getAttribute('style');
  const atRest = await background.getAttribute('data-scroll-progress');
  await page.waitForTimeout(150);
  expect(await background.getAttribute('data-scroll-progress')).toBe(atRest);
  const heightBefore = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate(() =>
    document.querySelectorAll('details').forEach((detail) => {
      detail.open = true;
    }),
  );
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollHeight))
    .toBeGreaterThan(heightBefore);
  await expect
    .poll(async () => Number(await background.getAttribute('data-scroll-progress')))
    .toBeLessThan(0.5);
  await page.evaluate(() => {
    document.querySelectorAll('details').forEach((detail) => {
      detail.open = false;
    });
    window.scrollTo(0, 0);
  });
  await expect(background).toHaveAttribute('data-scroll-progress', '0');
  await page.evaluate(() =>
    window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2),
  );
  await expect
    .poll(async () => Number(await background.getAttribute('data-scroll-progress')))
    .toBeCloseTo(0.5, 2);
  expect(await background.getAttribute('style')).toBe(middle);
  expect(await background.boundingBox()).toEqual(initialGeometry);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(background).not.toHaveAttribute('style');
  await expect(background).not.toHaveAttribute('data-scroll-progress');
  await page.evaluate(() => window.scrollTo(0, 100));
  await expect(background).not.toHaveAttribute('style');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(background).toHaveAttribute('data-scroll-progress');
});

test('responsive layouts and keyboard focus do not lose content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    expect(
      await page.evaluate(() => {
        const card = document.querySelector<HTMLElement>('.hero-card')!;
        const text = document.querySelector<HTMLElement>('.hero-main')!;
        const contentRight =
          card.getBoundingClientRect().right - parseFloat(getComputedStyle(card).paddingRight);
        return text.getBoundingClientRect().right <= contentRight + 1;
      }),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
});

test('content, navigation, static background and details remain available without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Mariana Alejo Flores');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Experience' })
    .click();
  await expect(page).toHaveURL(/#experience$/);
  await page.locator('details').first().locator('summary').click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await expect(page.locator('.copy-email')).toBeHidden();
  await expect(page.locator('.pearl-background img')).toBeVisible();
  await expect(page.locator('.pearl-background')).not.toHaveAttribute('style');
  await expect(page.getByRole('link', { name: 'Send an email' })).toBeVisible();
  await context.close();
});

test('404 has its own title and a working return link', async ({ page }) => {
  const response = await page.goto('/page-that-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found | Mariana Alejo Flores');
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page.locator('h1')).toHaveText('Mariana Alejo Flores');
});
