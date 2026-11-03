import en from '../content/en.json' with { type: 'json' };
import es from '../content/es.json' with { type: 'json' };
import { defaultLocale, type Locale } from './config.ts';
export { locales, defaultLocale, type Locale } from './config.ts';

export function localeUrl(locale: Locale, anchor = ''): string {
  const path = locale === defaultLocale ? '/' : `/${locale}/`;
  return anchor ? `${path}#${anchor}` : path;
}
export type MessageTree = { [key: string]: string | MessageTree };
export const dictionaries: Record<Locale, MessageTree> = { en, es };

export function getMessage(dictionary: MessageTree, key: string): string {
  const value = key
    .split('.')
    .reduce<string | MessageTree | undefined>(
      (node, part) =>
        node && typeof node === 'object' && Object.hasOwn(node, part) ? node[part] : undefined,
      dictionary,
    );
  if (typeof value !== 'string') throw new Error(`Missing string translation: ${key}`);
  return value;
}

export function createTranslator(locale: Locale) {
  const dictionary = dictionaries[locale];
  if (!dictionary) throw new Error(`Unsupported locale: ${locale}`);
  return (key: string, values: Record<string, string | number> = {}): string =>
    getMessage(dictionary, key).replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
      if (!Object.hasOwn(values, name)) throw new Error(`Missing interpolation ${name} in ${key}`);
      return String(values[name]);
    });
}
export type Translator = ReturnType<typeof createTranslator>;
