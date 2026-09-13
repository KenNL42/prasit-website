// ---------------------------------------------------------------------------
// Central site configuration.
// Edit the values below to personalise the whole website — names, titles,
// contact details and academic profiles are used across every page.
// ---------------------------------------------------------------------------

export const SITE = {
  /** Base URL used for sitemap + canonical links. Keep the trailing slash off. */
  url: 'https://yourname.example.edu',
  /** Short name shown in the navigation bar. */
  name: 'Dr. Niran Chanthana',
  /** Full professional title (shown on the home page hero). */
  title: 'Assistant Professor of Anthropology',
  /** Department / faculty line, e.g. your university. */
  affiliation: 'Department of Anthropology, Faculty of Social Sciences, Chiang Mai University',
  /** Thai version of the affiliation line (used on /th/ pages). */
  affiliationTh: 'ภาควิชามานุษยวิทยา คณะสังคมศาสตร์ มหาวิทยาลัยเชียงใหม่',
  /** Employer / university (used in SEO structured data). */
  organization: 'Chiang Mai University',
  /** One-line professional summary used in <meta> tags and the hero. */
  description:
    'Anthropologist specialising in religion, ritual and memory in mainland Southeast Asia. Publications in English and Thai, fieldwork photo galleries, and academic contact details.',
  /** Primary contact email shown on the contact page and footer. */
  email: 'niran.chanthana@example.edu',
  /** Office / postal address lines. */
  address: ['Faculty of Social Sciences, Chiang Mai University', '239 Huay Kaew Road, Suthep, Muang', 'Chiang Mai 50200, Thailand'],
  /** Academic profiles (label → URL). Empty entries are hidden automatically. */
  profiles: {
    'Google Scholar': 'https://scholar.google.com',
    ORCID: 'https://orcid.org',
    ResearchGate: 'https://www.researchgate.net',
    Academia: 'https://www.academia.edu',
  },
  /** Research interests shown as tags on the home / about pages. */
  interests: [
    'Religion and Ritual',
    'Memory and Heritage',
    'Material Culture',
    'Ethnography of Mainland Southeast Asia',
    'Religious Pluralism',
    'Museum Anthropology',
  ],
} as const;

export type SiteConfig = typeof SITE;
