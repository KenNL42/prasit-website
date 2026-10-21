import { getRelativeLocaleUrl } from 'astro:i18n';
import { dictionaries, type Dictionary } from './dictionaries';
import { stripBase } from '../lib/url';

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/**
 * URL of the same page in the other locale.
 * `pathname` is the current URL path, which may include the Astro `base`
 * (during builds) and the `/th/` prefix. Both are stripped first so
 * getRelativeLocaleUrl receives a clean language-neutral path.
 */
export function otherLocaleUrl(lang: Locale, pathname: string): string {
  let neutralPath = stripBase(pathname);
  if (lang === 'th' && (neutralPath === '/th' || neutralPath.startsWith('/th/'))) {
    neutralPath = neutralPath.slice(3) || '/';
  }
  const other: Locale = lang === 'en' ? 'th' : 'en';
  return getRelativeLocaleUrl(other, neutralPath === '/' ? undefined : neutralPath);
}

/**
 * Language-neutral path: strips the Astro `base` (present in
 * Astro.url.pathname during builds, e.g. "/prasit-website/th/about/") and
 * then the `/th/` prefix, so both /about and /th/about yield "/about".
 */
export function neutralPath(lang: Locale, pathname: string): string {
  const path = stripBase(pathname);
  if (lang === 'th' && (path === '/th' || path.startsWith('/th/'))) {
    return path.slice(3) || '/';
  }
  return path;
}
