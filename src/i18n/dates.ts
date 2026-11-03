import type { DatePoint, Period } from '../content/model.ts';
import type { Locale, Translator } from './index.ts';
import { formatLocales } from './config.ts';

export function isValidDatePoint(input: unknown): input is DatePoint {
  if (!input || typeof input !== 'object') return false;
  const { value, precision } = input as DatePoint;
  return (
    typeof value === 'string' &&
    (precision === 'year'
      ? /^\d{4}$/.test(value)
      : precision === 'month' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value))
  );
}

export function formatDate(date: DatePoint, locale: Locale): string {
  if (!isValidDatePoint(date)) throw new Error('Invalid partial date');
  const [year, month = '01'] = date.value.split('-');
  return new Intl.DateTimeFormat(formatLocales[locale], {
    year: 'numeric',
    ...(date.precision === 'month' ? { month: 'short' } : {}),
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
}

export function formatPeriod(period: Period, locale: Locale, t: Translator): string {
  const start = formatDate(period.start, locale);
  if (period.isCurrent) return t('dates.range', { start, end: t('dates.present') });
  return period.end ? t('dates.range', { start, end: formatDate(period.end, locale) }) : start;
}
