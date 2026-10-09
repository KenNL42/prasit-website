/**
 * UI translation dictionaries for the two site locales.
 *
 * `en` defines the canonical structure (typed via `typeof en`); `th` must
 * cover the same keys — the compiler enforces this. Content that is itself
 * language-specific (publication abstracts, photo captions) lives in the
 * content collections, not here.
 *
 * Identity fields (name, affiliation, description) are pulled from
 * `site.config.ts` so pages can read everything through `t.home.*` while
 * the config stays the single source of truth.
 */
import { SITE } from '../site.config';

const en = {
  nav: {
    home: 'Home',
    about: 'About',
    publications: 'Publications',
    photos: 'Photos',
    contact: 'Contact',
    switchTo: 'Switch to Thai',
  },
  common: {
    more: 'more…',
    less: 'show less',
    downloadPdf: 'Download PDF',
    filterPlaceholder: 'Filter by title, author, year…',
    showingAll: (n: number | string) => `Showing ${n} publication${Number(n) === 1 ? '' : 's'}`,
    showingOf: (n: number | string, m: number | string) => `Showing ${n} of ${m} publication${Number(m) === 1 ? '' : 's'}`,
    entries: (n: number) => `${n} entr${n === 1 ? 'y' : 'ies'}`,
    photos: (n: number) => `${n} photo${n === 1 ? '' : 's'}`,
    viewGallery: 'View gallery',
    backToPhotos: 'Back to all photos',
    noPhotos:
      'No photos have been added to this album yet. Place images inside the album folder (public/pictures/…) to display them here.',
  },
  typeLabels: {
    'Journal Article': 'Journal Article',
    Book: 'Book',
    'Book Chapter': 'Book Chapter',
    'Conference Paper': 'Conference Paper',
    Review: 'Review',
    'Working Paper': 'Working Paper',
    Other: 'Other',
  },
  home: {
    // Identity fields — sourced from site.config.ts (single source of truth).
    name: SITE.name,
    nameAndTitle: SITE.nameAndTitle,
    affiliation: SITE.affiliation,
    description: SITE.description,
    portraitLabel: 'portrait',
    intro:
      'An anthropologist of ethnicity and indigenous studies — with a particular focus on how state government, regionalization and globalization shape ethnic and indigenous life in northern Thailand. My work appears in both English and Thai, and this site gathers my publications, photos, and relevant archives in one place.',
    browsePublications: 'Browse publications',
    viewGalleries: 'View photos',
    ctaTitle: 'Interested in collaboration or fieldwork exchange?',
    ctaText:
      'I welcome correspondence from students, colleagues and institutions working on indigenity  and the anthropology of Hmong.',
    getInTouch: 'Get in touch',
  },
  about: {
    title: 'Biography',
    positions: 'Academic positions',
    positionsList: [
      { role: 'Assistant Professor of Anthropology', place: 'Chiang Mai University', period: '2015 - present' },
      { role: 'Sociology Researcher', place: 'Chiang Mai University', period: '1988 - 2015(?)' },
    ],
    education: 'Education',
    educationList: [
      { degree: 'Ph.D. in Anthropology', place: 'University of Washington, Seattle, USA', year: '2001' },
      { degree: 'M.A. in Population and Social Research', place: 'Mahidol University, Thailand', year: '1988' },
      { degree: 'B.A. in Political Science', place: 'Ramkhamhaeng University, Thailand', year: '1985' },
    ],
  },
  publications: {
    title: 'Research publications',
    englishCardTitle: 'Publications in English',
    englishCardText: 'Journal articles, book chapters and reviews for international readership —',
    thaiCardTitle: 'Publications in Thai',
    thaiCardText: 'Journal articles and essays written for readers in Thailand —',
    english: 'English',
    thai: 'Thai',
    thaiBadge: 'Thai',
    breadcrumb: 'Publications',
    enTitle: 'Publications in English',
    thTitle: 'Publications in Thai',
    backToEn: 'View English publications',
    backToTh: 'View Thai publications',
    archivesTitle: 'Relevant Archives',
    archivesText:
      'Publications without a downloadable PDF. You can read the titles and search for the articles yourself.',
    viewArchives: 'Browse the archives',
  },
  photos: {
    title: 'Photos',
    intro:
      'Collection of photos taken by me and others, including links to relevant sources of interesting photos.',
    note:
      'Note: Please give credit to the photographer, by referring to his/her name, when you use it.',
    empty:
      'No albums yet. Add a Markdown file under src/content/photos/ and drop photos into public/pictures/ to create the first gallery.',
  },
  contact: {
    title: 'Get in touch',
    messageHeading: 'Send a message',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    sendViaEmail: 'Send via email',
    formNote:
      'This form opens your email client with the message pre-filled — nothing is stored on this website.',
    directEmail: 'Direct email',
    office: 'Office',
    profiles: 'Academic profiles',
  },
  footer: {
    site: 'Site',
    contact: 'Contact',
    rights: (name: string) => `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  },
};

export type Dictionary = typeof en;

const th: Dictionary = {
  nav: {
    home: 'หน้าแรก',
    about: 'เกี่ยวกับ',
    publications: 'สิ่งพิมพ์',
    photos: 'ภาพถ่าย',
    contact: 'ติดต่อ',
    switchTo: 'เปลี่ยนเป็นภาษาไทย',
  },
  common: {
    more: 'อ่านเพิ่มเติม…',
    less: 'ย่อลง',
    downloadPdf: 'ดาวน์โหลด PDF',
    filterPlaceholder: 'ค้นหาตามชื่อเรื่อง ผู้แต่ง หรือปี…',
    showingAll: (n) => `แสดงทั้งหมด ${n} รายการ`,
    showingOf: (n, m) => `แสดง ${n} จาก ${m} รายการ`,
    entries: (n) => `${n} รายการ`,
    photos: (n) => `${n} ภาพ`,
    viewGallery: 'ชมภาพถ่าย',
    backToPhotos: 'กลับไปยังภาพทั้งหมด',
    noPhotos:
      'ยังไม่มีภาพในอัลบั้มนี้ กรุณาใส่ภาพลงในโฟลเดอร์ (public/pictures/…) เพื่อแสดงผล',
  },
  typeLabels: {
    'Journal Article': 'บทความวารสาร',
    Book: 'หนังสือ',
    'Book Chapter': 'บทความในหนังสือ',
    'Conference Paper': 'บทความนำเสนอในที่ประชุมวิชาการ',
    Review: 'บทวิจารณ์',
    'Working Paper': 'เอกสารวิชาการ',
    Other: 'อื่น ๆ',
  },
  home: {
    // Identity fields — Thai variants from site.config.ts.
    name: SITE.nameTh,
    nameAndTitle: SITE.nameAndTitleTh,
    affiliation: SITE.affiliationTh,
    description: SITE.descriptionTh,
    portraitLabel: 'ภาพถ่ายบุคคล',
    intro:
      'นักมานุษยวิทยาด้านชาติพันธุ์สัมพันธ์และชนพื้นเมืองศึกษา เน้นอิทธิพลของรัฐชาติ ความเป็นภูมิภาคและกระแสโลกาภิวัตน์ที่ส่งผลต่อกลุ่มชาติพันธุ์และชนพื้นเมืองในภาคเหนือของประเทศไทย ข้อมูลในนี้มีทั้งภาษาไทยและอังกฤษ เน้นการรวบรวมงานตีพิมพ์ของผม ภาพถ่ายและเอกสารอื่นที่เกี่ยวข้อง',
    browsePublications: 'ดูสิ่งพิมพ์',
    viewGalleries: 'ชมภาพถ่าย',
    ctaTitle: 'สนใจร่วมมือวิจัยหรือแลกเปลี่ยนภาคสนามหรือไม่?',
    ctaText:
      'ผมยินดีรับการติดต่อจากนักศึกษา เพื่อนร่วมงาน และสถาบันที่ทำงานด้านศาสนา พิธีกรรม มรดกวัฒนธรรม และมานุษยวิทยาแห่งเอเชียตะวันออกเฉียงใต้',
    getInTouch: 'ติดต่อ',
  },
  about: {
    title: 'ประวัติย่อ',
    positions: 'ตำแหน่งทางวิชาการ',
    positionsList: [
      { role: 'ผู้ช่วยศาสตราจารย์ด้านมานุษยวิทยา', place: 'มหาวิทยาลัยเชียงใหม่', period: 'พ.ศ. 2561 – ปัจจุบัน' },
      { role: 'อาจารย์ประจำสาขามานุษยวิทยา', place: 'มหาวิทยาลัยเชียงใหม่', period: 'พ.ศ. 2556 – 2561' },
      { role: 'นักวิจัยหลังปริญญาเอก', place: 'โรงเรียนฝรั่งเศสแห่งปลายบูรพาทิศ (EFEO) กรุงเทพฯ', period: 'พ.ศ. 2555 – 2556' },
    ],
    education: 'การศึกษา',
    educationList: [
      { degree: 'ปริญญาเอก สาขามานุษยวิทยา', place: 'มหาวิทยาลัยวอชิงตัน สหรัฐอเมริกา', year: 'พ.ศ. 2544' },
      { degree: 'ปริญญาโท สาขาวิชาวิจัยประชากรและสังคม', place: 'มหาวิทยาลัยมหิดล', year: 'พ.ศ. 2531' },
      { degree: 'ปริญญาตรี สาขารัฐศาสตร์', place: 'มหาวิทยาลัยรามคำแหง', year: 'พ.ศ. 2528' },
    ],
  },
  publications: {
    title: 'สิ่งพิมพ์วิจัย',
    englishCardTitle: 'สิ่งพิมพ์ภาษาอังกฤษ',
    englishCardText: 'บทความวารสาร บทความในหนังสือ และบทวิจารณ์สำหรับผู้อ่านต่างประเทศ —',
    thaiCardTitle: 'สิ่งพิมพ์ภาษาไทย',
    thaiCardText: 'บทความและงานเขียนภาษาไทยสำหรับผู้อ่านในประเทศ —',
    english: 'ภาษาอังกฤษ',
    thai: 'ภาษาไทย',
    thaiBadge: 'ภาษาไทย',
    breadcrumb: 'สิ่งพิมพ์',
    enTitle: 'สิ่งพิมพ์ภาษาอังกฤษ',
    thTitle: 'สิ่งพิมพ์ภาษาไทย',
    backToEn: 'ดูสิ่งพิมพ์ภาษาอังกฤษ',
    backToTh: 'ดูสิ่งพิมพ์ภาษาไทย',
    archivesTitle: 'คลังเอกสารอ้างอิง',
    archivesText:
      'รายการผลงานตีพิมพ์ที่ไม่มีไฟล์ PDF สำหรับดาวน์โหลด ผู้เข้าชมสามารถค้นหาบทความได้จากชื่อเรื่องด้วยตนเอง',
    viewArchives: 'ดูคลังเอกสารอ้างอิง',
  },
  photos: {
    title: 'ภาพถ่าย',
    intro:
      'รวบรวมภาพถ่ายที่ถ่ายโดยผมเองและคนอื่น ๆ รวมถึงเว็บไซต์ที่มีภาพถ่ายที่น่าสนใจ',
    note:
      'หมายเหตุ: กรุณาให้เกียรติด้วยการอ้างถึงชื่อคนถ่ายภาพ หากท่านนำไปใช้หรือเผยแพร่',
    empty:
      'ยังไม่มีอัลบั้ม กรุณาเพิ่มไฟล์ Markdown ใน src/content/photos/ และใส่ภาพใน public/pictures/ เพื่อสร้างแกลเลอรีแรก',
  },
  contact: {
    title: 'ติดต่อเรา',
    messageHeading: 'ส่งข้อความ',
    name: 'ชื่อ',
    email: 'อีเมล',
    subject: 'หัวข้อ',
    message: 'ข้อความ',
    sendViaEmail: 'ส่งผ่านอีเมล',
    formNote: 'ฟอร์มนี้จะเปิดโปรแกรมอีเมลของคุณพร้อมข้อความที่กรอกไว้ — ข้อมูลไม่ได้ถูกจัดเก็บในเว็บไซต์นี้',
    directEmail: 'อีเมลโดยตรง',
    office: 'ที่ทำงาน',
    profiles: 'ประวัติวิชาการออนไลน์',
  },
  footer: {
    site: 'เว็บไซต์',
    contact: 'ติดต่อ',
    rights: (name) => `สงวนลิขสิทธิ์ © ${new Date().getFullYear()} ${name}`,
  },
};

export const dictionaries: Record<'en' | 'th', Dictionary> = { en, th };
