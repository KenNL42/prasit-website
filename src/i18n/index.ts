import { getRelativeLocaleUrl } from 'astro:i18n';
import { dictionaries, type Dictionary } from './dictionaries';

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/**
 * URL of the same page in the other locale.
 * `pathname` is the current URL path, which may include the `/th/` prefix.
 */
export function otherLocaleUrl(lang: Locale, pathname: string): string {
  let neutralPath = pathname;
  if (lang === 'th' && (pathname === '/th' || pathname.startsWith('/th/'))) {
    neutralPath = pathname.slice(3) || '/';
  }
  const other: Locale = lang === 'en' ? 'th' : 'en';
  return getRelativeLocaleUrl(other, neutralPath === '/' ? undefined : neutralPath);
}

/** Language-neutral path (strips the `/th/` prefix when present). */
export function neutralPath(lang: Locale, pathname: string): string {
  if (lang === 'th' && (pathname === '/th' || pathname.startsWith('/th/'))) {
    return pathname.slice(3) || '/';
  }
  return pathname;
}
