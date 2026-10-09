// ---------------------------------------------------------------------------
// Central site configuration.
// Edit the values below to personalise the whole website — names, titles,
// contact details and academic profiles are used across every page.
// ---------------------------------------------------------------------------

export const SITE = {
  /** Base URL used for sitemap + canonical links. Keep the trailing slash off. */
  url: 'https://kennl42.github.io',
  /** Short name shown in the navigation bar. */
  name: 'Prasit Leepreecha',
  /** Thai version of the name (used on /th/ pages). */
  nameTh: 'ประสิทธิ์ ลีปรีชา',
  nameAndTitle: 'Prasit Leepreecha, PhD',
  nameAndTitleTh: 'รองศาสตราจารย์ ประสิทธิ์ ลีปรีชา',
  /** Full professional title (shown on the home page hero). */
  title: 'Associate Professor of Anthropology',
  /** Thai version of the professional title (used on /th/ pages). */
  titleTh: 'รองศาสตราจารย์',
  /** Department / faculty line, e.g. your university. */
  affiliation: 'Department of Social Sciences and Developmental, Chiang Mai University',
  /** Thai version of the affiliation line (used on /th/ pages). */
  affiliationTh: 'ภาควิชาสังคมศาสตร์กับการพัฒนา คณะสังคมศาสตร์ มหาวิทยาลัยเชียงใหม่',
  /** Employer / university (used in SEO structured data). */
  organization: 'Chiang Mai University',
  /** One-line professional summary used in <meta> tags and the hero. */
  description:
    'An anthropologist of ethnicity and indigenous studies — with a particular focus on how state government, regionalization and globalization shape ethnic and indigenous life in northern Thailand. My work appears in both English and Thai, and this site gathers my publications, photos, and relevant archives in one place.',
  descriptionTh:
    'นักมานุษยวิทยาด้านชาติพันธุ์สัมพันธ์และชนพื้นเมืองศึกษา เน้นอิทธิพลของรัฐชาติ ความเป็นภูมิภาคและกระแสโลกาภิวัตน์ที่ส่งผลต่อกลุ่มชาติพันธุ์และชนพื้นเมืองในภาคเหนือของประเทศไทย ข้อมูลในนี้มีทั้งภาษาไทยและอังกฤษ เน้นการรวบรวมงานตีพิมพ์ของผม ภาพถ่ายและเอกสารอื่นที่เกี่ยวข้อง',
  /** Primary contact email shown on the contact page and footer. */
  email: 'leesia2009@gmail.com',
  /** Office / postal address lines. */
  address: ['Department of Social Science and Development', 'Faculty of Social Sciences, Chiang Mai University', '239 Huay Kaew Road, Suthep, Muang', 'Chiang Mai 50200, Thailand'],
  /** Thai version of the address (used on /th/ pages). */
  addressTh: ['คณะสังคมศาสตร์ มหาวิทยาลัยเชียงใหม่', '239 ถนนห้วยแก้ว ตำบลสุเทพ อำเภอเมือง', 'เชียงใหม่ 50200 ประเทศไทย'],
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
};

export type SiteConfig = typeof SITE;
