import raw from './portfolio.data.json' with { type: 'json' };
import { validateContent } from './validation.ts';
import type { PublishedEntry } from './model.ts';
import { createTranslator, dictionaries, localeUrl, type Locale } from '../i18n/index.ts';
import { formatPeriod } from '../i18n/dates.ts';
import { formatLocales } from '../i18n/config.ts';

export const published = <T extends PublishedEntry>(items: T[]) =>
  items.filter((item) => item.publicationStatus === 'published').sort((a, b) => a.order - b.order);

export function getContent(locale: Locale, input: unknown = raw) {
  const data = validateContent(input, dictionaries[locale]);
  const t = createTranslator(locale);
  const organization = (id: string) => {
    const entry = data.organizations.find((item) => item.id === id);
    if (!entry) throw new Error(`Unknown organization: ${id}`);
    return entry.name;
  };
  const sections: Record<string, boolean> = {
    about: true,
    expertise: published(data.expertise).length > 0,
    experience: published(data.experience).length > 0,
    education: published(data.education).length > 0,
    development: published(data.developmentGroups).some((group) =>
      published(data.development).some((item) => item.groupId === group.id),
    ),
    practice: published(data.practiceGroups).some((group) =>
      published(data.practices).some((item) => item.groupId === group.id),
    ),
    contact: true,
  };
  return {
    data,
    t,
    locale,
    formatLocale: formatLocales[locale],
    sections,
    navigation: data.navigation.filter((link) => sections[link.id]),
    url: (anchor = '') => localeUrl(locale, anchor),
    organization,
    period: (value: Parameters<typeof formatPeriod>[0]) => formatPeriod(value, locale, t),
  };
}
export type SiteContent = ReturnType<typeof getContent>;
