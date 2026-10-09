/**
 * Base-path helpers for GitHub Pages-style deployments (Astro `base`).
 *
 * Astro automatically prefixes `href` attributes in the built HTML, but
 * NOT `src` attributes on <img>, and `Astro.url.pathname` DOES include the
 * base during builds — so runtime-built URLs and locale helpers need these.
 */

/** Prefix a site-root-relative path with the Astro `base` (no-op when none). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/prasit-website/"
  if (!base || base === '/') return path;
  if (!path.startsWith('/')) return path;
  return `${base.replace(/\/+$/, '')}${path}`;
}

/**
 * Remove the Astro `base` from a pathname (e.g. Astro.url.pathname, which
 * includes the base during builds: "/prasit-website/about/" -> "/about/").
 */
export function stripBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (!base || base === '/') return path;
  if (path === base || path === base.replace(/\/+$/, '')) return '/';
  if (path.startsWith(base)) return path.slice(base.length - 1);
  return path;
}

/**
 * Absolute URL of a page in a given locale, honoring `base`.
 * `neutralPath` is the language-neutral path ("/", "/about", …).
 */
export function absoluteLocaleUrl(
  locale: 'en' | 'th',
  neutralPath: string,
  siteRoot: string,
): string {
  const localePath =
    neutralPath === '/'
      ? locale === 'th' ? '/th/' : '/'
      : locale === 'th' ? `/th${neutralPath}` : neutralPath;
  return `${siteRoot}${withBase(localePath)}`;
}
