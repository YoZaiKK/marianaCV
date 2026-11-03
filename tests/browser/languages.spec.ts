import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Spanish renders localized content, metadata, dates and email interactions', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    }),
  );
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle('Mariana Alejo Flores | Recursos Humanos');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Conoce la experiencia/,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'es_MX');
  await expect(page.locator('.experience-card').first()).toContainText('ago 2026–Actualidad');
  await expect(page.locator('.academic-average')).toHaveText('Promedio académico: 9.07');
  await expect(page.locator('#practice')).toContainText('Inglés — B2');
  await expect(page.locator('#practice')).toContainText('Cleaver, Zavic y Figura Humana');
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  for (const link of await navigation.getByRole('link').all())
    expect(await link.getAttribute('href')).toMatch(/^\/es\/#/);
  await page.getByRole('button', { name: 'Copiar correo' }).click();
  await expect(page.getByRole('status')).toHaveText('Correo copiado.');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Denied');
    };
  });
  await page.getByRole('button', { name: 'Copiar correo' }).click();
  await expect(page.getByRole('status')).toContainText('No se pudo copiar');
  await page.locator('details').evaluateAll((elements) =>
    elements.forEach((element) => {
      (element as HTMLDetailsElement).open = true;
    }),
  );
  expect(await page.locator('body').innerText()).not.toMatch(
    /\{\{|Human Resources|Additional responsibilities|Download CV/,
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('select supports keyboard navigation, cancellation, typeahead and reversible section-aware switching', async ({
  page,
}) => {
  await page.goto('/?source=cv#experience');
  const select = page.getByRole('combobox');
  await select.focus();
  await page.keyboard.press('ArrowDown');
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('End');
  await expect(select).toHaveAttribute('aria-activedescendant', 'language-en-option-es');
  await expect(page.getByRole('option', { name: 'English', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(select).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/\/\?source=cv#experience$/);
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/es\/\?source=cv#experience$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('combobox')).toHaveAccessibleName('Idioma Español');
  await page.getByRole('combobox').focus();
  await page.keyboard.press('e');
  await page.keyboard.press('n');
  await expect(page.getByRole('combobox')).toHaveAttribute(
    'aria-activedescendant',
    'language-es-option-en',
  );
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/\?source=cv#experience$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('dropdown matches the design system, stays within each viewport and closes without trapping focus', async ({
  page,
}) => {
  await page.goto('/es/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const select = page.getByRole('combobox');
    await select.click();
    const menu = page.getByRole('listbox');
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(Math.round((await select.boundingBox())!.height * 100) / 100).toBeGreaterThanOrEqual(44);
    expect(await menu.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
      'rgb(255, 255, 255)',
    );
    expect(await menu.evaluate((element) => getComputedStyle(element).borderRadius)).toBe('16px');
    expect(
      await page
        .getByRole('option', { name: 'Español' })
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ).toBe('rgb(232, 239, 210)');
    expect(
      await select.evaluate(
        (element) =>
          getComputedStyle(element).fontFamily === getComputedStyle(document.body).fontFamily,
      ),
    ).toBeTruthy();
    expect(
      await menu.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return element.contains(document.elementFromPoint(rect.left + 20, rect.top + 20));
      }),
    ).toBeTruthy();
    await page.keyboard.press('Escape');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    expect(
      await page.locator('.hero-main').evaluate((element) => {
        const card = element.closest('.hero-card')!;
        return (
          element.getBoundingClientRect().right <=
          card.getBoundingClientRect().right - parseFloat(getComputedStyle(card).paddingRight) + 1
        );
      }),
    ).toBeTruthy();
  }
  await page.getByRole('combobox').click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.locator('h1').click();
  await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('combobox').focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('combobox')).not.toBeFocused();
  await expect(page).toHaveURL(/\/es\/$/);
});

test('pointer selection and no-JavaScript links navigate between both languages', async ({
  page,
  browser,
  baseURL,
}) => {
  await page.goto('/');
  if (test.info().project.use.hasTouch) {
    await page.getByRole('combobox').tap();
    await page.getByRole('option', { name: 'Español', exact: true }).tap();
  } else {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Español', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.getByRole('combobox')).toHaveAccessibleName('Idioma Español');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 844 },
  });
  const fallbackPage = await context.newPage();
  await fallbackPage.goto('/');
  await expect(fallbackPage.getByRole('combobox')).toBeHidden();
  await fallbackPage
    .getByRole('navigation', { name: 'Language', exact: true })
    .getByRole('link', { name: 'Español', exact: true })
    .click();
  await expect(fallbackPage).toHaveURL(/\/es\/$/);
  await expect(fallbackPage.locator('html')).toHaveAttribute('lang', 'es');
  await fallbackPage
    .getByRole('navigation', { name: 'Idioma', exact: true })
    .getByRole('link', { name: 'English', exact: true })
    .click();
  await expect(fallbackPage.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('Spanish errors stay localized and their language selector preserves the error page', async ({
  page,
}) => {
  const response = await page.goto('/es/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Página no encontrada | Mariana Alejo Flores');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('link', { name: 'Volver al inicio', exact: true })).toHaveAttribute(
    'href',
    '/es/',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/404.html$/);
  await expect(page).toHaveTitle('Page not found | Mariana Alejo Flores');
});
