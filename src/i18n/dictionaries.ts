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
    eyebrow: 'Professor of Anthropology',
    intro:
      'An anthropologist of indegeneous study — with a particular focus on how landscapes, culture and collective remembrance shape community life in northern Thailand. My work appears in both English and Thai, and this site gathers my publications, fieldwork galleries, and research notes in one place.',
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
      'Indegenious',
      'Hmong',
      'Religious',
      'Ethnography of Northern Thailand',
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'Biography',
    bio1:
      'My mother gave birth to me in a small Hmong town, near Ban Kae, Boh Klua, Nan. It is a mountainous village on Thailand-Lao border.....',
    bio2:
      'In 1970, communist soldier sieged our village....',
    picture1:
      '<insert family picture>',
    bio3:
      'In May, 1970, I started my education in Pah Klang school....',
    picture2:
      '<insert student group picture>',
    bio4:
      'After high school, I failed to attend university while also did not want to teacher training colleges (later became Rajabhat Universities)....',
    picture3:
      '<insert graduation picture>',
    picture4:
      '<insert graduation picture>',
    bio5:
      'In 1988, I became an assistant researcher for Dr. Peter Knstadter of University of California, San Francisco....',
    picture5:
      '<insert picture with prof. Chayan>',
    bio6:
      'While I was part of Chiang Mai University, I started to connect with other scholars, especially anthropologists who were interested to research indegenious people. One of them was Professor Charles F. Keyes of University of Washington, Seattle....',
    picture6:
      '<insert picture with professor Charles F Keyes>',
    picture7:
      '<insert grad picture>',
    picture8:
      '<insert grad picture with family>',
    bio7:
      'After my Ph.D., I came back to continue my work as a researcher for department of sociology, Chiang Mai University....',
    picture9:
    '<insert picture with students>',
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
    thTitle: 'Publications in Thai',
    thIntro:
      'Journal articles and essays written for readers in Thailand — students, scholars and heritage practitioners — bringing anthropological knowledge to the society we study.',
    backToEn: 'View English publications',
    backToTh: 'View Thai publications',
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
      'ผมเป็นนักมานุษยวิทยาที่ศึกษาชนพื้นเมือง ......................',
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
      'แม่ให้กำเนิดผมที่ชุมชนม้งขนาดเล็ก ใกล้บ้านน้ำแคะ ตำบลบ่อเกลือเหนือ อำเภอบ่อเกลือ จังหวัดน่าน เป็นหมู่บ้านบนภูเขา อยู่ติดชายแดนไทย-ลาว เมื่อผมอายุประมาณ 2 ขวบ พวกเราได้ย้ายไปอยู่หมู่บ้านดอยภูแป้น (ปัจจุบันเป็นพื้นที่ต้นน้ำห้วยพิวซึ่งไหลไปทางทิศตะวันออก บรรจบกับแม่น้ำน่านที่บ้านนาปง) อยู่ที่นั่นได้ประมาณ 4 ปี ขบวนการคอมมิวนิสต์จากฝั่งลาวเริ่มเข้ามาเคลื่อนไหวเพื่อระดมมวลชนในชุมชนม้งและลัวะบริเวณชายแดนไทย-ลาว หมู่บ้านม้งหลายแห่งในพื้นที่กลายเป็นจุดปะทะด้วยอาวุธระหว่างฝ่ายคอมมิวนิสต์กับฝ่ายทหารไทย',
    bio2:
      'วันหนึ่งในต้นปี พ.ศ. 2513 ทหารฝ่ายคอมมิวนิสต์เข้ามาปิดล้อมหมู่บ้านเล็ก ๆ ของเรา โชคดีที่กลุ่มแกนนำหมู่บ้านหลบหนีออกมาได้ จึงพากันลี้ภัยมาอยู่ชั่วคราวที่บ้านบ่อหยวก ตำบลบ่อเกลือเหนือ พักที่นั่นได้หลายวัน พ่อผมซึ่งตอนนั้นเป็นผู้ใหญ่บ้านและมีความสัมพันธ์ที่ดีกับกำนันและทหารไทยในพื้นที่ ได้ตัดสินใจพาผมขึ้นเฮลิคอปเตอร์ของทหารลงมาที่ศูนย์อพยพชาวเขา บ้านป่ากลาง ตำบลศิลาแลง อำเภอปัว ซึ่งเป็นศูนย์รับผู้อพยพชาวม้งและอิ้วเมี่ยนที่หนีภัยคอมมิวนิสต์จากหมู่บ้านบนดอยลงมา ตั้งแต่ต้นปี พ.ศ. 2511 แล้ว ในเดือนต่อมาแม่และพี่ ๆ ของครอบครัวผมจึงเดินเท้าลงมาสมทบที่ป่ากลาง',
    picture1:
      '',
    bio3:
      'เดือนพฤษภาคม 2513 โรงเรียนเปิดเทอม ผมกับพี่ชายจึงถูกพ่อส่งเข้าเรียนที่โรงเรียนบ้านป่ากลาง ผมเรียนชั้นประถมศึกษาปีที่ 1 ถึงชั้นประถมศึกษาปีที่ 7 แล้วปี พ.ศ. 2520 ผมไปเรียนต่อชั้นมัธยมศึกษาปีที่ 1 ที่โรงเรียนปัว ซึ่งอยู่ห่างจากบ้านป่ากลาง 5 กิโลเมตร แต่การเดินทางในสมัยนั้นลำบากมาก ผมจึงขอไปอยู่ในหอพักคริสเตียนที่ตัวอำเภอปัว เพื่อไปเรียนที่โรงเรียนปัว จนจบชั้นมัธยมศึกษาปีที่ 5 เมื่อต้นปี พ.ศ. 2525',
    picture2:
      '',
    bio4:
      'หลังจบชั้นมัธยมปลาย ผมสอบแข่งขันเข้าเรียนในมหาวิทยาลัยไม่ได้ และไม่อยากไปเรียนต่อวิทยาลัยครู (ต่อมาเปลี่ยนเป็นมหาวิทยาลัยราชภัฎ) จึงเดินทางเข้ากรุงเทพฯ ไปสมัครเรียนที่มหาวิทยาลัยรามคำแหง ซึ่งเป็นมหาวิทยาลัยเปิดเพียงแห่งเดียวของประเทศในสมัยนั้น โดยน้าชายได้พาผมไปฝากเป็นเด็กวัด อยู่กฎิเจ้าอาวาส วัดเบญจมบพิตรดุสิตวนาราม ผมใช้เวลาเรียน 3 ปีครึ่งก็จบปริญญาตรีสาขารัฐศาสตร์ จากนั้นผมได้สมัครเข้าเรียนต่อปริญญาโท สาขาวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล ในปีการศึกษา 2529 ใช้เวลาเรียน 2 ปีก็จบ',
    picture3:
      '',
    picture4:
      '',
    bio5:
      'ปี พ.ศ. 2531 ผมได้เริ่มทำงานด้วยการเป็นผู้ช่วยนักวิจัยของ Dr. Peter Kunstadter แห่ง University of California, San Francisco ในโครงการศึกษาเรื่องประชากร เศรษฐกิจและสังคมม้ง ที่จังหวัดเชียงใหม่ ขณะเดียวกัน ผมก็สอบผ่าน เข้ารับการฝึกอบรมและได้บรรจุเป็นปลัดอำเภอ แต่ผมตัดสินใจเลือกงานสายวิชาการ เพราะน่าจะมีความเป็นอิสระในการทำงานมากกว่า ปีถัดมา ผมได้รู้จักและเป็นผู้ช่วยวิจัยของ ดร.ชยันต์ วรรธนะภูติ ผู้อำนวยการสถาบันวิจัยสังคม มหาวิทยาลัยเชียงใหม่ ในโครงการวิจัยเกี่ยวกับชาวเขา และต่อมาได้บรรจุเป็นข้าราชการ ตำแหน่งนักวิจัย เมื่อปี พ.ศ. 2534',
    picture5:
      '',
    bio6:
      'การอยู่ในวงวิชาการของมหาวิทยาลัยเชียงใหม่ ทำให้ผมได้รู้จักอาจารย์ชาวต่างชาติที่เข้ามาศึกษาสังคมไทย โดยเฉพาะนักมานุษยวิทยาที่สนใจศึกษาวิจัยชาวเขาในขณะนั้น ซึ่งหนึ่งในนักวิชาการเหล่านั้นคือ Professor Charles F. Keyes จาก University of Washington เมือง Seattle ประเทศสหรัฐอเมริกา หลังจากได้พบและสนทนากันหลายครั้ง ผมจึงสอบถามข้อมูลและสมัครเข้าเรียนต่อปริญญาเอกกับท่าน ฤดูใบไม้ร่วงของปี พ.ศ. 2538 ผมเข้าเรียนต่อที่ University of Washington, Seattle ในสาขา Cultural Anthropology โดยเบื้องต้นได้รับทุนจากมูลนิธิฟอร์ด (ผ่านมหาวิทยาลัยเชียงใหม่) และต่อด้วยทุนจาก Wenner-Glen Foundation for Anthropology จนจบปริญญาเอกในฤดูใบไม้ผลิ ปี พ.ศ. 2544',
    picture6:
      '',
    picture7:
      '',
    picture8:
      '',
    bio7:
'หลังสำเร็จการศึกษา ผมได้กลับมารับราชการเป็นนักวิจัยต่อที่สถาบันวิจัยสังคม มหาวิทยาลัยเชียงใหม่ จนกระทั่งปี พ.ศ. 2553 จึงได้โอนย้ายมาเป็นอาจารย์ในคณะสังคมศาสตร์ เป็นหนึ่งในอาจารย์รุ่นบุกเบิกของการตั้งภาควิชาสังคมศาสตร์กับการพัฒนา และเริ่มสอนหลักสูตรปริญญาโท สาขาชาติพันธุ์สัมพันธ์กับการพัฒนาเป็นรุ่นแรกในปีนั้นเอง สำหรับวิชาที่ได้สอน ทั้งในระดับปริญญาเอก โทและตรี ทั้งหลักสูตรภาษาไทยและอังกฤษ ประกอบด้วย\
  - วิชาทฤษฎีสังคมศาสตร์ (สอนเฉพาะบางหัวข้อ)\
  - วิชาทฤษฎีชาติพันธุ์สัมพันธ์กับการพัฒนา\
  - วิชาชาติพันธุ์สัมพันธ์และขบวนการเคลื่อนไหวของชนพื้นเมือง\
  - วิชาการท่องเที่ยวในอาเซียน\
  - วิชาศาสนากับความเปลี่ยนแปลงทางสังคม\
  - วิชาพลวัตชุมชนชาติพันธุ์บนพื้นที่สูง\
  - วิชาสังคมและวัฒนธรรม้ง\
ด้านงานวิจัยที่ผมสนใจและได้ทำมา ประกอบด้วยตัวอย่างโครงการวิจัยดังต่อไปนี้\
  - การปรับตัวของชาวเขาที่เข้ามาอยู่ในเมือง \
  - นโยบายรัฐกับผลกระทบต่อสังคมและวัฒนธรรมม้งกับกลุ่มชาติพันธุ์บนพื้นที่สูง \
  - เครือข่ายม้งข้ามชาติ \
  - ขบวนการเคลื่อนไหวของชนพื้นเมืองในไทยและเอเชียอาคเนย์ \
  - เทพารักษ์ล้านนา \
  - การท่องเที่ยวชาติพันธุ์ \
  - ระบบการศึกษาในโรงเรียนกับผลกระทบต่อกลุ่มชาติพันธุ์ \
  - นามสกุลกับการกลายเป็นไทยของกลุ่มชาติพันธุ์\
  - ศาสนาคริสต์กับการสร้างความศิวิไลซ์แก่ชาวม้ง \
  - จักรวาลทัศน์ชาติพันธุ์ \
  - ธรรมจาริกกับการเผยแพร่ศาสนาพุทธในกลุ่มชาติพันธุ์บนพื้นที่สูง \
  - ม่าง(กัญชง)ในวิถีชีวิตม้ง  เป็นต้น\
',
    picture9:
    '',
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
