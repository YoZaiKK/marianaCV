// @ts-check
import { defineConfig } from 'astro/config';
import { locales, defaultLocale } from './src/i18n/config.ts';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  ...(process.env.SITE_URL ? { site: process.env.SITE_URL } : {}),
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
});
