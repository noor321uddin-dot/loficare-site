import en from './en.json';
import bn from './bn.json';

export type Locale = 'en' | 'bn';
export const locales: Locale[] = ['en', 'bn'];
const dict: Record<Locale, Record<string, string>> = { en, bn };

/** Translate a key. Falls back to English; check:i18n lists every fallback. */
export function t(locale: Locale, key: string): string {
  return dict[locale][key] ?? dict.en[key] ?? key;
}
export function has(locale: Locale, key: string): boolean {
  return key in dict[locale];
}
export function missing(locale: Locale): string[] {
  return Object.keys(dict.en).filter((k) => !(k in dict[locale]));
}
export function localePath(locale: Locale, path = '/'): string {
  return locale === 'en' ? path : `/bn${path}`;
}
export const otherLocale = (l: Locale): Locale => (l === 'en' ? 'bn' : 'en');
