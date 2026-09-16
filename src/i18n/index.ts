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
export function otherLocaleUrl(currentLang: string, neutralPath: string) {
  const targetLang = currentLang === 'en' ? 'th' : 'en';
  
  // Astro's getRelativeLocaleUrl automatically reads your astro.config.mjs 
  // and prepends BOTH the '/project1' base and the language code smoothly.
  return getRelativeLocaleUrl(targetLang, neutralPath);
}

/** Language-neutral path (strips the `/th/` prefix when present). */
export function neutralPath(lang: Locale, pathname: string): string {
  if (lang === 'th' && (pathname === '/th' || pathname.startsWith('/th/'))) {
    return pathname.slice(3) || '/';
  }
  return pathname;
}
