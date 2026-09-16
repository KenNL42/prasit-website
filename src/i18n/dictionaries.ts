/**
 * UI translation dictionaries for the two site locales.
 *
 * `en` defines the canonical structure (typed via `typeof en`); `th` must
 * cover the same keys — the compiler enforces this. Content that is itself
 * language-specific (publication abstracts, event photo captions) lives in
 * the content collections, not here.
 */

const en = {
  nav: {
    home: 'Home',
    about: 'About',
    publications: 'Publications',
    events: 'Fieldwork & Events',
    contact: 'Contact',
    cta: 'Get in touch',
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
    backToEvents: 'Back to all events',
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
    eyebrow: 'Assistant Professor of Anthropology',
    intro:
      'An anthropologist of religion, ritual and memory in mainland Southeast Asia — with a particular focus on how sacred landscapes, material culture and collective remembrance shape community life in northern Thailand. My work appears in both English and Thai, and this site gathers my publications, fieldwork galleries, and research notes in one place.',
    browsePublications: 'Browse publications',
    viewGalleries: 'View fieldwork galleries',
    interestsLabel: 'Research interests',
    selectedWork: 'Selected work',
    recentPublications: 'Recent publications',
    allPublications: 'All publications',
    inTheField: 'In the field',
    eventsTitle: 'Fieldwork & events',
    allGalleries: 'All galleries',
    ctaTitle: 'Interested in collaboration or fieldwork exchange?',
    ctaText:
      'I welcome correspondence from students, colleagues and institutions working on religion, ritual, heritage and the anthropology of Southeast Asia.',
    getInTouch: 'Get in touch',
    interests: [
      'Religion and Ritual',
      'Memory and Heritage',
      'Material Culture',
      'Ethnography of Mainland Southeast Asia',
      'Religious Pluralism',
      'Museum Anthropology',
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'Biography',
    bio1:
      'I am an anthropologist working at the intersection of religion, ritual and collective memory in mainland Southeast Asia. My research asks how communities make and remake sacred space — through pilgrimage, temple renovation, spirit cults and commemorative practice — and how those processes bear on questions of belonging, heritage and political identity today.',
    bio2:
      'My primary fieldwork has been carried out in northern Thailand and the upper Mekong region, where I have conducted long-term ethnographic research since 2007. I am particularly interested in material culture: the ways that objects — Buddha images, amulets, monuments, archives — carry memory across generations and become the focus of religious and civic devotion.',
    bio3:
      'My work has been published in both English and Thai. Writing in Thai has been deliberate: I believe anthropological knowledge should speak to the communities it studies, and much of my recent writing addresses audiences of Thai students, heritage practitioners and the wider public.',
    bio4:
      'At the university I teach courses on the anthropology of religion, ethnographic methods, and the anthropology of Southeast Asia, and I regularly supervise fieldwork projects across the region.',
    positions: 'Academic positions',
    positionsList: [
      { role: 'Assistant Professor of Anthropology', place: 'Chiang Mai University', period: '2018 – present' },
      { role: 'Lecturer in Anthropology', place: 'Chiang Mai University', period: '2013 – 2018' },
      { role: 'Postdoctoral Research Fellow', place: 'École française d’Extrême-Orient (EFEO), Bangkok', period: '2012 – 2013' },
    ],
    education: 'Education',
    educationList: [
      { degree: 'Ph.D. in Anthropology', place: 'University of Cambridge, United Kingdom', year: '2012' },
      { degree: 'M.A. in Southeast Asian Studies', place: 'Chulalongkorn University, Thailand', year: '2006' },
      { degree: 'B.A. in History (First Class Honours)', place: 'Chiang Mai University, Thailand', year: '2003' },
    ],
    languages: 'Languages',
    languagesList: [
      { name: 'Thai', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Northern Thai (Lanna)', level: 'Working' },
      { name: 'French', level: 'Reading' },
    ],
    researchInterests: 'Research interests',
  },
  publications: {
    eyebrow: 'Publications',
    title: 'Research publications',
    intro:
      'My published work spans English- and Thai-language venues. Each entry lists the abstract and a downloadable PDF where available.',
    latestNote: (year: number) => ` The most recent addition is from ${year}.`,
    englishCardTitle: 'Publications in English',
    englishCardText: 'Journal articles, book chapters and reviews for international readership —',
    thaiCardTitle: 'Publications in Thai',
    thaiCardText: 'Journal articles and essays written for readers in Thailand —',
    english: 'English',
    thai: 'Thai',
    thaiBadge: 'Thai',
    breadcrumb: 'Publications',
    enTitle: 'Publications in English',
    enIntro:
      'Journal articles, book chapters and reviews written for an international readership.',
    thTitle: 'สิ่งพิมพ์ภาษาไทย',
    thIntro:
      'งานเขียนภาษาไทยมุ่งสู่ผู้อ่านในประเทศ ทั้งนักศึกษา นักวิชาการ และผู้ปฏิบัติงานด้านวัฒนธรรม เพื่อให้ความรู้ทางมานุษยวิทยาเข้าถึงสังคมที่เราศึกษา',
    backToEn: 'View English publications',
    backToTh: 'ดูสิ่งพิมพ์ภาษาอังกฤษ',
  },
  events: {
    eyebrow: 'In the field',
    title: 'Fieldwork & events',
    intro:
      'Photo galleries documenting fieldwork trips, conferences, seminars and community engagements. Each event has its own page; select a card to browse the photographs.',
    breadcrumb: 'Fieldwork & events',
    empty:
      'No events yet. Add a Markdown file under src/content/events/ and drop photos into public/pictures/ to create the first gallery.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Get in touch',
    intro:
      'For correspondence about research collaboration, graduate supervision, invited talks or media inquiries, the quickest way to reach me is by email. I usually respond within a few working days.',
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
    events: 'ภาคสนามและกิจกรรม',
    contact: 'ติดต่อ',
    cta: 'ติดต่อฉัน',
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
    backToEvents: 'กลับไปยังกิจกรรมทั้งหมด',
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
    eyebrow: 'ผู้ช่วยศาสตราจารย์ด้านมานุษยวิทยา',
    intro:
      'ผมเป็นนักมานุษยวิทยาที่ศึกษาศาสนา พิธีกรรม และความทรงจำร่วมในเอเชียตะวันออกเฉียงใต้ โดยให้ความสำคัญกับวิธีที่พื้นที่ศักดิ์สิทธิ์ วัตถุวัฒนธรรม และการระลึกถึงร่วมของชุมชนหล่อหลอมชีวิตสังคมในภาคเหนือของประเทศไทย ผลงานของผมตีพิมพ์ทั้งภาษาอังกฤษและภาษาไทย เว็บไซต์นี้รวบรวมสิ่งพิมพ์ ภาพถ่ายภาคสนาม และบันทึกการวิจัยไว้ในที่เดียว',
    browsePublications: 'ดูสิ่งพิมพ์',
    viewGalleries: 'ชมภาพภาคสนาม',
    interestsLabel: 'ความสนใจวิจัย',
    selectedWork: 'ผลงานคัดสรร',
    recentPublications: 'สิ่งพิมพ์ล่าสุด',
    allPublications: 'สิ่งพิมพ์ทั้งหมด',
    inTheField: 'ในภาคสนาม',
    eventsTitle: 'ภาคสนามและกิจกรรม',
    allGalleries: 'ภาพทั้งหมด',
    ctaTitle: 'สนใจร่วมมือวิจัยหรือแลกเปลี่ยนภาคสนามหรือไม่?',
    ctaText:
      'ผมยินดีรับการติดต่อจากนักศึกษา เพื่อนร่วมงาน และสถาบันที่ทำงานด้านศาสนา พิธีกรรม มรดกวัฒนธรรม และมานุษยวิทยาแห่งเอเชียตะวันออกเฉียงใต้',
    getInTouch: 'ติดต่อ',
    interests: [
      'ศาสนาและพิธีกรรม',
      'ความทรงจำและมรดกวัฒนธรรม',
      'วัตถุวัฒนธรรม',
      'ชาติพันธุ์วรรณนาแห่งเอเชียตะวันออกเฉียงใต้',
      'พหุนิยมทางศาสนา',
      'มานุษยวิทยาพิพิธภัณฑ์',
    ],
  },
  about: {
    eyebrow: 'เกี่ยวกับ',
    title: 'ประวัติย่อ',
    bio1:
      'ผมเป็นนักมานุษยวิทยาที่ทำงานอยู่บนจุดตัดของศาสนา พิธีกรรม และความทรงจำร่วมในเอเชียตะวันออกเฉียงใต้ งานวิจัยของผมสอบถามว่าชุมชนสร้างและสร้างใหม่ซึ่งพื้นที่ศักดิ์สิทธิ์อย่างไร — ผ่านการจาริกแสวงบุญ การบูรณปฏิสังขรณ์วัด ลัทธิผี และแนวปฏิบัติรำลึก — และกระบวนการเหล่านี้เกี่ยวข้องกับคำถามเรื่องการเป็นเจ้าของ มรดกวัฒนธรรม และอัตลักษณ์ทางการเมืองในปัจจุบันอย่างไร',
    bio2:
      'งานสนามหลักของผมอยู่ในภาคเหนือของประเทศไทยและภูมิภาคลุ่มน้ำโขงตอนบน ซึ่งผมได้ทำการวิจัยเชิงชาติพันธุ์วรรณนาแบบระยะยาวมาตั้งแต่ปี พ.ศ. 2550 ผมสนใจเป็นพิเศษในวัตถุวัฒนธรรม: วิธีที่วัตถุ — พระพุทธรูป เครื่องราง อนุสาวรีย์ จดหมายเหตุ — รับส่งความทรงจำข้ามรุ่นและกลายเป็นจุดรวมของความศรัทธาทางศาสนาและทางพลเมือง',
    bio3:
      'ผลงานของผมตีพิมพ์ทั้งภาษาอังกฤษและภาษาไทย การเขียนเป็นภาษาไทยเป็นการตัดสินใจอย่างตั้งใจ: ผมเชื่อว่าความรู้ทางมานุษยวิทยาควรสื่อสารกับสังคมที่เราศึกษา และงานเขียนช่วงหลังของผมจำนวนมากกล่าวถึงผู้อ่านชาวไทย ทั้งนักศึกษา ผู้ปฏิบัติงานด้านมรดกวัฒนธรรม และสาธารณชนในวงกว้าง',
    bio4:
      'ในมหาวิทยาลัย ผมสอนวิชามานุษยวิทยาศาสนา ระเบียบวิธีชาติพันธุ์วรรณนา และมานุษยวิทยาแห่งเอเชียตะวันออกเฉียงใต้ และเป็นที่ปรึกษาโครงการภาคสนามของนักศึกษาในภูมิภาคนี้อย่างสม่ำเสมอ',
    positions: 'ตำแหน่งทางวิชาการ',
    positionsList: [
      { role: 'ผู้ช่วยศาสตราจารย์ด้านมานุษยวิทยา', place: 'มหาวิทยาลัยเชียงใหม่', period: 'พ.ศ. 2561 – ปัจจุบัน' },
      { role: 'อาจารย์ประจำสาขามานุษยวิทยา', place: 'มหาวิทยาลัยเชียงใหม่', period: 'พ.ศ. 2556 – 2561' },
      { role: 'นักวิจัยหลังปริญญาเอก', place: 'โรงเรียนฝรั่งเศสแห่งปลายบูรพาทิศ (EFEO) กรุงเทพฯ', period: 'พ.ศ. 2555 – 2556' },
    ],
    education: 'การศึกษา',
    educationList: [
      { degree: 'ปริญญาเอก สาขามานุษยวิทยา', place: 'มหาวิทยาลัยเคมบริดจ์ สหราชอาณาจักร', year: 'พ.ศ. 2555' },
      { degree: 'ปริญญาโท สาขาเอเชียตะวันออกเฉียงใต้ศึกษา', place: 'จุฬาลงกรณ์มหาวิทยาลัย', year: 'พ.ศ. 2549' },
      { degree: 'ปริญญาตรี สาขาประวัติศาสตร์ (เกียรตินิยมอันดับหนึ่ง)', place: 'มหาวิทยาลัยเชียงใหม่', year: 'พ.ศ. 2546' },
    ],
    languages: 'ภาษา',
    languagesList: [
      { name: 'ภาษาไทย', level: 'เจ้าของภาษา' },
      { name: 'ภาษาอังกฤษ', level: 'คล่องแคล่ว' },
      { name: 'ภาษาล้านนา', level: 'ใช้ทำงานได้' },
      { name: 'ภาษาฝรั่งเศส', level: 'อ่านออก' },
    ],
    researchInterests: 'ความสนใจวิจัย',
  },
  publications: {
    eyebrow: 'สิ่งพิมพ์',
    title: 'สิ่งพิมพ์วิจัย',
    intro:
      'ผลงานตีพิมพ์ของผมครอบคลุมวารสารทั้งภาษาอังกฤษและภาษาไทย แต่ละรายการแสดงบทคัดย่อและไฟล์ PDF ที่ดาวน์โหลดได้ (ถ้ามี)',
    latestNote: (year) => ` ผลงานล่าสุดคือจากปี พ.ศ. ${year + 543}.`,
    englishCardTitle: 'สิ่งพิมพ์ภาษาอังกฤษ',
    englishCardText: 'บทความวารสาร บทความในหนังสือ และบทวิจารณ์สำหรับผู้อ่านต่างประเทศ —',
    thaiCardTitle: 'สิ่งพิมพ์ภาษาไทย',
    thaiCardText: 'บทความและงานเขียนภาษาไทยสำหรับผู้อ่านในประเทศ —',
    english: 'ภาษาอังกฤษ',
    thai: 'ภาษาไทย',
    thaiBadge: 'ภาษาไทย',
    breadcrumb: 'สิ่งพิมพ์',
    enTitle: 'สิ่งพิมพ์ภาษาอังกฤษ',
    enIntro: 'บทความวารสาร บทความในหนังสือ และบทวิจารณ์ที่เขียนสำหรับผู้อ่านต่างประเทศ',
    thTitle: 'สิ่งพิมพ์ภาษาไทย',
    thIntro:
      'งานเขียนภาษาไทยมุ่งสู่ผู้อ่านในประเทศ ทั้งนักศึกษา นักวิชาการ และผู้ปฏิบัติงานด้านวัฒนธรรม เพื่อให้ความรู้ทางมานุษยวิทยาเข้าถึงสังคมที่เราศึกษา',
    backToEn: 'ดูสิ่งพิมพ์ภาษาอังกฤษ',
    backToTh: 'ดูสิ่งพิมพ์ภาษาไทย',
  },
  events: {
    eyebrow: 'ในภาคสนาม',
    title: 'ภาคสนามและกิจกรรม',
    intro:
      'คลังภาพถ่ายบันทึกการทำงานภาคสนาม การประชุมวิชาการ สัมมนา และกิจกรรมร่วมกับชุมชน แต่ละกิจกรรมมีหน้าเพจของตัวเอง เลือกการ์ดเพื่อชมภาพถ่าย',
    breadcrumb: 'ภาคสนามและกิจกรรม',
    empty:
      'ยังไม่มีกิจกรรม กรุณาเพิ่มไฟล์ Markdown ใน src/content/events/ และใส่ภาพใน public/pictures/ เพื่อสร้างแกลเลอรีแรก',
  },
  contact: {
    eyebrow: 'ติดต่อ',
    title: 'ติดต่อเรา',
    intro:
      'สำหรับการติดต่อเรื่องความร่วมมือวิจัย การดูแลวิทยานิพนธ์ การบรรยายรับเชิญ หรือสื่อมวลชน วิธีที่เร็วที่สุดคืออีเมล โดยทั่วไปผมตอบกลับภายในไม่กี่วันทำการ',
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
