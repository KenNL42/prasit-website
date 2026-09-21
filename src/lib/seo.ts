import { SITE } from '../site.config';

/**
 * schema.org Person node for the site owner — reused on the home page
 * (as the main entity) and the About page (as the mainEntity of the
 * ProfilePage node).
 */
export function personLd() {
  return {
    '@type': 'Person',
    name: SITE.name,
    jobTitle: SITE.title,
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    worksFor: { '@type': 'Organization', name: SITE.organization },
    sameAs: Object.values(SITE.profiles),
    knowsAbout: SITE.interests,
  };
}
