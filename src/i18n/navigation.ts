import { defaultLocale, type Locale } from './config.ts';

export type PageKind = 'home' | 'notFound';

export function localizedPageUrl(locale: Locale, page: PageKind = 'home'): string {
  const prefix = locale === defaultLocale ? '/' : `/${locale}/`;
  if (page === 'notFound') return locale === defaultLocale ? '/404.html' : `${prefix}404/`;
  return prefix;
}

/** Keep the visitor's section and query while navigating to a known local page. */
export function languageDestination(targetPath: string, currentHref: string): string {
  const current = new URL(currentHref);
  const target = new URL(targetPath, current);
  if (
    !targetPath.startsWith('/') ||
    targetPath.startsWith('//') ||
    target.origin !== current.origin
  )
    throw new Error('Language destinations must be local paths.');
  target.search = current.search;
  target.hash = current.hash;
  return `${target.pathname}${target.search}${target.hash}`;
}
