import fs from 'fs';
import path from 'path';

// All 39 languages
const LANGUAGES = [
  'en', 'no', 'fr', 'pt', 'ar', 'he', 'ro', 'az', 'hi', 'ru',
  'bg', 'hr', 'sk', 'bn', 'hu', 'sr', 'cs', 'id', 'sv', 'da',
  'it', 'th', 'de', 'ja', 'tl', 'el', 'kk', 'tr', 'ko', 'ur',
  'es', 'ms', 'uz', 'fa', 'nl', 'vi', 'fi', 'pl', 'zh'
];

const BASE_EN = {
  appName: 'Age Calculator',
  tagline: 'Calculate your exact age in years, months, days, and live running seconds.',
  calculateAge: 'Online Age Calculator',
  dob: 'Date of Birth',
  ageAsOf: 'Age As Of Date',
  includeTime: 'Include Exact Birth Time (Optional)',
  timeOfBirth: 'Time of Birth (Local Time)',
  targetTime: 'Target Time',
  calculateBtn: 'Calculate Age',
  resetBtn: 'Reset',
  printBtn: 'Print',
  copyBtn: 'Copy',
  copiedBtn: 'Copied!',
  exactAge: 'Your Exact Age',
  years: 'Years',
  months: 'Months',
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  weeks: 'Weeks',
  totalDaysLived: 'Total Days Lived',
  totalWeeksLived: 'Total Weeks',
  nextBirthday: 'Next Birthday',
  daysRemaining: 'days remaining',
  turningAge: 'Turning',
  happyBirthday: '🎉 Happy Birthday Today!',
  timeBreakdown: 'Comprehensive Time Breakdown',
  liveSeconds: 'Live Total Seconds Lived',
  heartbeats: 'Heartbeats',
  breaths: 'Breaths Taken',
  solarOrbit: 'Solar Year Progress',
  shareCard: 'Share My Age Card',
  downloadCard: 'Download Image (PNG)',
  shareBtn: 'Share Image Card',
  moreTools: 'More Tools',
  allCalculators: 'All Age & Date Tools',
  selectLanguage: 'Choose Your Language',
  searchLanguage: 'Search language...',
  close: 'Close',
  bornOn: 'Born on',
  zodiacSign: 'Western Zodiac',
  chineseZodiac: 'Chinese Zodiac',
  openCalculator: 'Open Calculator',
  heroTitle: 'Age Calculator',
  heroDesc: 'Calculate your exact age in years, months, and days. Find your next birthday, total days lived, and explore detailed live running seconds.',
  dateDiffTitle: 'Date Difference Calculator',
  dateDiffSubtitle: 'Find the exact difference and duration between any two historical or future calendar dates.',
  startDate: 'From Date (Start)',
  endDate: 'To Date (End)',
  calcDiffBtn: 'Calculate Difference',
  exactDuration: 'Exact Calendar Duration',
  between: 'Between',
  and: 'and',
  totalDays: 'Total Days',
  totalWeeks: 'Total Weeks',
  totalHours: 'Total Hours',
  totalMinutes: 'Total Minutes',
  ageDiffTitle: 'Age Difference Calculator',
  ageDiffSubtitle: 'Compare two dates of birth to calculate the exact age gap and difference in years, months, and days.',
  person1: 'Person 1 Date of Birth',
  person2: 'Person 2 Date of Birth',
  person1Label: 'First Person',
  person2Label: 'Second Person',
  calcAgeDiffBtn: 'Calculate Age Difference',
  isOlderThan: 'is older than',
  byExactGap: 'by an exact gap of',
  sameAgeMsg: 'Both persons have the exact same date of birth!',
  bdayTitle: 'Birthday & Milestone Calculator',
  bdaySubtitle: 'Discover when your next birthday is, how many days remain, and see the exact days of the week for all your milestone birthdays.',
  bdayCountdownTitle: 'Live Birthday Countdown Clock',
  bdayCountdownSubtitle: 'Real-time live countdown ticking down the exact days, hours, minutes, and seconds to your next birthday.',
  milestoneTitle: 'Milestone Birthday Schedule',
  milestoneAge: 'Milestone Age',
  milestoneYear: 'Year',
  milestoneDay: 'Day of Week',
  milestoneStatus: 'Status',
  celebrated: 'Celebrated',
  upcoming: 'Upcoming',
  countdownDays: 'Days',
  countdownHours: 'Hours',
  countdownMins: 'Minutes',
  countdownSecs: 'Seconds',
  chronologicalTitle: 'Chronological Age Calculator',
  chronologicalSubtitle: 'Calculate exact chronological age for clinical, school admission, demographic, and legal records.',
  testDate: 'Test / Assessment Date',
  calcChronologicalBtn: 'Calculate Chronological Age',
  decimalAge: 'Decimal Age',
  totalMonths: 'Total Months',
  dobCalcTitle: 'Date of Birth Calculator',
  dobCalcSubtitle: 'Calculate your exact birth date if you know your age on a given reference date.',
  knownAge: 'Known Age (Years, Months, Days)',
  asOfDate: 'As of Date',
  calcDobBtn: 'Calculate Date of Birth',
  estimatedDob: 'Calculated Date of Birth',
  daysBetweenTitle: 'Days Between Dates Calculator',
  daysBetweenSubtitle: 'Count the exact number of calendar days, business days, and weekend days between any two dates.',
  includeEndDay: 'Include End Date in Count (+1 day)',
  calcDaysBtn: 'Calculate Days',
  calendarDays: 'Calendar Days',
  weekdaysCount: 'Business Days (Mon–Fri)',
  weekendDaysCount: 'Weekend Days (Sat–Sun)',
  leapYearTitle: 'Leap Year Age Calculator',
  leapYearSubtitle: 'Calculate birthdays and true quadrennial milestones for Leap Day (February 29) babies.',
  isLeapYear: 'Leap Year Status',
  leapMilestones: 'Quadrennial Leap Birthdays',
  nextLeapBday: 'Next Official Feb 29 Birthday',
  retirementTitle: 'Retirement Age Calculator',
  retirementSubtitle: 'Plan your retirement timeline and calculate exact years, months, and days remaining until target retirement.',
  targetRetirementAge: 'Target Retirement Age',
  calcRetirementBtn: 'Calculate Retirement Date',
  retirementDate: 'Target Retirement Date',
  timeRemainingUntilRetirement: 'Time Remaining Until Retirement',
  howItWorks: 'How the Calculator Works',
  faqSectionTitle: 'Frequently Asked Questions',
  popularToolsTitle: 'Popular Age & Date Tools',
  guideTitle: 'How to Calculate Age – Precision Guide',
  aboutTitle: 'About Us',
  contactTitle: 'Contact Us',
  privacyTitle: 'Privacy Policy',
  termsTitle: 'Terms of Service'
};

// Translations map for common languages
const TRANSLATIONS_MAP = {
  en: BASE_EN,
  hi: {
    appName: 'आयु कैलकुलेटर',
    tagline: 'अपने सटीक उम्र की गणना वर्ष, महीने, दिन और लाइव सेकंड में करें।',
    calculateAge: 'ऑनलाइन आयु कैलकुलेटर',
    dob: 'जन्म तिथि',
    ageAsOf: 'इस तारीख तक की आयु',
    includeTime: 'सटीक जन्म समय जोड़ें (वैकल्पिक)',
    timeOfBirth: 'जन्म का समय (स्थानीय समय)',
    targetTime: 'लक्ष्य समय',
    calculateBtn: 'आयु की गणना करें',
    resetBtn: 'रीसेट करें',
    printBtn: 'प्रिंट करें',
    copyBtn: 'कॉपी करें',
    copiedBtn: 'कॉपी हो गया!',
    exactAge: 'आपकी सटीक आयु',
    years: 'वर्ष',
    months: 'महीने',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    weeks: 'सप्ताह',
    totalDaysLived: 'कुल बिताए गए दिन',
    totalWeeksLived: 'कुल सप्ताह',
    nextBirthday: 'अगला जन्मदिन',
    daysRemaining: 'दिन शेष',
    turningAge: 'आयु पूरी होगी',
    happyBirthday: '🎉 आज आपका जन्मदिन है! बधाई!',
    timeBreakdown: 'विस्तृत समय विवरण',
    liveSeconds: 'लाइव कुल सेकंड',
    heartbeats: 'दिल की धड़कनें',
    breaths: 'ली गई सांसें',
    solarOrbit: 'सौर वर्ष प्रगति',
    shareCard: 'मेरा आयु कार्ड साझा करें',
    downloadCard: 'इमेज डाउनलोड करें (PNG)',
    shareBtn: 'इमेज कार्ड साझा करें',
    moreTools: 'अन्य उपकरण',
    allCalculators: 'सभी आयु और दिनांक उपकरण',
    selectLanguage: 'अपनी भाषा चुनें',
    searchLanguage: 'भाषा खोजें...',
    close: 'बंद करें',
    bornOn: 'जन्म वार',
    zodiacSign: 'राशि चक्र',
    chineseZodiac: 'चीनी राशि',
    openCalculator: 'कैलकुलेटर खोलें',
    heroTitle: 'आयु कैलकुलेटर',
    heroDesc: 'अपनी सटीक आयु वर्ष, महीने और दिन में जानें। अगले जन्मदिन की उल्टी गिनती और लाइव सेकंड देखें।',
    dateDiffTitle: 'तारीख अंतर कैलकुलेटर',
    dateDiffSubtitle: 'किन्हीं भी दो ऐतिहासिक या भविष्य की तारीखों के बीच सटीक अंतर और अवधि ज्ञात करें।',
    startDate: 'शुरुआती तारीख (Start)',
    endDate: 'अंतिम तारीख (End)',
    calcDiffBtn: 'अंतर की गणना करें',
    exactDuration: 'सटीक कैलेंडर अवधि',
    between: 'के बीच',
    and: 'और',
    totalDays: 'कुल दिन',
    totalWeeks: 'कुल सप्ताह',
    totalHours: 'कुल घंटे',
    totalMinutes: 'कुल मिनट',
    ageDiffTitle: 'आयु अंतर कैलकुलेटर',
    ageDiffSubtitle: 'दो जन्मतिथियों की तुलना करके सटीक आयु अंतर (वर्ष, महीने, दिन) निकालें।',
    person1: 'पहले व्यक्ति की जन्म तिथि',
    person2: 'दूसरे व्यक्ति की जन्म तिथि',
    person1Label: 'पहला व्यक्ति',
    person2Label: 'दूसरा व्यक्ति',
    calcAgeDiffBtn: 'आयु अंतर की गणना करें',
    isOlderThan: 'से बड़ा है',
    byExactGap: 'सटीक अंतर:',
    sameAgeMsg: 'दोनों व्यक्तियों की जन्मतिथि बिल्कुल समान है!',
    bdayTitle: 'जन्मदिन और मील का पत्थर कैलकुलेटर',
    bdaySubtitle: 'जानें कि आपका अगला जन्मदिन कब है, कितने दिन बचे हैं, और मील के पत्थर के जन्मदिन किस वार को आएंगे।',
    bdayCountdownTitle: 'लाइव जन्मदिन उलटी गिनती घड़ी',
    bdayCountdownSubtitle: 'अगले जन्मदिन के लिए दिन, घंटे, मिनट और सेकंड की वास्तविक समय उलटी गिनती।',
    milestoneTitle: 'मील का पत्थर जन्मदिन अनुसूची',
    milestoneAge: 'मील का पत्थर आयु',
    milestoneYear: 'वर्ष',
    milestoneDay: 'सप्ताह का दिन',
    milestoneStatus: 'स्थिति',
    celebrated: 'मनाया जा चुका',
    upcoming: 'आगामी',
    countdownDays: 'दिन',
    countdownHours: 'घंटे',
    countdownMins: 'मिनट',
    countdownSecs: 'सेकंड',
    chronologicalTitle: 'कालानुक्रमिक आयु कैलकुलेटर',
    chronologicalSubtitle: 'स्कूल प्रवेश, क्लिनिकल और कानूनी रिकॉर्ड के लिए सटीक कालानुक्रमिक आयु निकालें।',
    testDate: 'परीक्षण / मूल्यांकन तिथि',
    calcChronologicalBtn: 'कालानुक्रमिक आयु की गणना करें',
    decimalAge: 'दशमलव आयु',
    totalMonths: 'कुल महीने',
    dobCalcTitle: 'जन्म तिथि कैलकुलेटर',
    dobCalcSubtitle: 'यदि आपको किसी संदर्भ तिथि पर अपनी आयु ज्ञात है, तो अपनी सटीक जन्मतिथि की गणना करें।',
    knownAge: 'ज्ञात आयु (वर्ष, महीने, दिन)',
    asOfDate: 'इस तिथि पर आयु',
    calcDobBtn: 'जन्म तिथि की गणना करें',
    estimatedDob: 'गणना की गई जन्म तिथि',
    daysBetweenTitle: 'दो तारीखों के बीच के दिन कैलकुलेटर',
    daysBetweenSubtitle: 'किन्हीं भी दो तारीखों के बीच कुल कैलेंडर दिन, कार्यदिवस और सप्ताहांत के दिन गिनें।',
    includeEndDay: 'अंतिम दिन भी शामिल करें (+1 दिन)',
    calcDaysBtn: 'दिनों की गणना करें',
    calendarDays: 'कैलेंडर दिन',
    weekdaysCount: 'कार्यदिवस (सोम–शुक्र)',
    weekendDaysCount: 'सप्ताहांत (शनि–रवि)',
    leapYearTitle: 'लीप वर्ष आयु कैलकुलेटर',
    leapYearSubtitle: 'लीप दिवस (29 फरवरी) को जन्मे लोगों के जन्मदिन और चार वर्षीय वर्षगांठ की गणना करें।',
    isLeapYear: 'लीप वर्ष स्थिति',
    leapMilestones: 'चार वर्षीय लीप जन्मदिन',
    nextLeapBday: 'अगला आधिकारिक 29 फरवरी जन्मदिन',
    retirementTitle: 'सेवानिवृत्ति आयु कैलकुलेटर',
    retirementSubtitle: 'अपनी सेवानिवृत्ति की समयरेखा बनाएं और लक्ष्य सेवानिवृत्ति तक शेष वर्ष, महीने और दिन जानें।',
    targetRetirementAge: 'लक्ष्य सेवानिवृत्ति आयु',
    calcRetirementBtn: 'सेवानिवृत्ति तिथि की गणना करें',
    retirementDate: 'लक्ष्य सेवानिवृत्ति तिथि',
    timeRemainingUntilRetirement: 'सेवानिवृत्ति तक शेष समय',
    howItWorks: 'कैलकुलेटर कैसे काम करता है',
    faqSectionTitle: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    popularToolsTitle: 'लोकप्रिय आयु और दिनांक उपकरण',
    guideTitle: 'आयु की गणना कैसे करें – संपूर्ण गाइड',
    aboutTitle: 'हमारे बारे में',
    contactTitle: 'संपर्क करें',
    privacyTitle: 'गोपनीयता नीति',
    termsTitle: 'सेवा की शर्तें'
  },
  th: {
    appName: 'เครื่องคำนวณอายุ',
    tagline: 'คำนวณอายุที่แน่นอนของคุณเป็นปี เดือน วัน และวินาทีแบบเรียลไทม์',
    calculateAge: 'เครื่องคำนวณอายุออนไลน์',
    dob: 'วันเกิด',
    ageAsOf: 'อายุ ณ วันที่',
    includeTime: 'ระบุเวลาเกิดที่แน่นอน (ไม่บังคับ)',
    timeOfBirth: 'เวลาเกิด (เวลาท้องถิ่น)',
    targetTime: 'เวลาเป้าหมาย',
    calculateBtn: 'คำนวณอายุ',
    resetBtn: 'ล้างค่า',
    printBtn: 'พิมพ์',
    copyBtn: 'คัดลอก',
    copiedBtn: 'คัดลอกแล้ว!',
    exactAge: 'อายุที่แน่นอนของคุณ',
    years: 'ปี',
    months: 'เดือน',
    days: 'วัน',
    hours: 'ชั่วโมง',
    minutes: 'นาที',
    seconds: 'วินาที',
    weeks: 'สัปดาห์',
    totalDaysLived: 'จำนวนวันทั้งหมดที่ใช้ชีวิต',
    totalWeeksLived: 'จำนวนสัปดาห์ทั้งหมด',
    nextBirthday: 'วันเกิดครั้งถัดไป',
    daysRemaining: 'วันที่เหลือ',
    turningAge: 'จะอายุครบ',
    happyBirthday: '🎉 สุขสันต์วันเกิดวันนี้!',
    timeBreakdown: 'รายละเอียดเวลาแบบครบถ้วน',
    liveSeconds: 'จำนวนวินาทีสะสมแบบเรียลไทม์',
    heartbeats: 'อัตราการเต้นของหัวใจ',
    breaths: 'จำนวนครั้งที่หายใจ',
    solarOrbit: 'ความคืบหน้าการโคจรรอบดวงอาทิตย์',
    shareCard: 'แชร์การ์ดอายุของฉัน',
    downloadCard: 'ดาวน์โหลดรูปภาพ (PNG)',
    shareBtn: 'แชร์การ์ดรูปภาพ',
    moreTools: 'เครื่องมือเพิ่มเติม',
    allCalculators: 'เครื่องมือคำนวณอายุและวันที่ทั้งหมด',
    selectLanguage: 'เลือกภาษาของคุณ',
    searchLanguage: 'ค้นหาภาษา...',
    close: 'ปิด',
    bornOn: 'เกิดเมื่อวันที่',
    zodiacSign: 'ราศีสากล',
    chineseZodiac: 'ปีนักษัตรจีน',
    openCalculator: 'เปิดเครื่องคำนวณ',
    heroTitle: 'เครื่องคำนวณอายุ (Age Calculator)',
    heroDesc: 'คำนวณอายุจริงของคุณเป็นปี เดือน วัน พร้อมนับถอยหลังสู่วันเกิดครั้งถัดไปและแสดงวินาทีสะสมแบบเรียลไทม์',
    dateDiffTitle: 'เครื่องคำนวณส่วนต่างวันที่',
    dateDiffSubtitle: 'ค้นหาความแตกต่างและระยะเวลาที่แน่นอนระหว่างวันที่สองวันในอดีตหรืออนาคต',
    startDate: 'จากวันที่ (เริ่มต้น)',
    endDate: 'ถึงวันที่ (สิ้นสุด)',
    calcDiffBtn: 'คำนวณความต่าง',
    exactDuration: 'ระยะเวลาตามปฏิทินที่แน่นอน',
    between: 'ระหว่าง',
    and: 'และ',
    totalDays: 'จำนวนวันทั้งหมด',
    totalWeeks: 'จำนวนสัปดาห์ทั้งหมด',
    totalHours: 'จำนวนชั่วโมงทั้งหมด',
    totalMinutes: 'จำนวนนาทีทั้งหมด',
    ageDiffTitle: 'เครื่องคำนวณความต่างของอายุ',
    ageDiffSubtitle: 'เปรียบเทียบวันเกิดสองคนเพื่อคำนวณช่องว่างอายุที่แน่นอนเป็นปี เดือน และวัน',
    person1: 'วันเกิดของบุคคลที่ 1',
    person2: 'วันเกิดของบุคคลที่ 2',
    person1Label: 'บุคคลที่ 1',
    person2Label: 'บุคคลที่ 2',
    calcAgeDiffBtn: 'คำนวณความต่างของอายุ',
    isOlderThan: 'แก่กว่า',
    byExactGap: 'ด้วยส่วนต่างที่แน่นอน:',
    sameAgeMsg: 'ทั้งสองคนเกิดวันเดียวกันเป๊ะ!',
    bdayTitle: 'เครื่องคำนวณวันเกิดและหมุดหมายสำคัญ',
    bdaySubtitle: 'ตรวจสอบว่าวันเกิดถัดไปของคุณเมื่อไหร่ เหลือกี่วัน และดูวันในสัปดาห์ของวันเกิดสำคัญทุกช่วงวัย',
    bdayCountdownTitle: 'นาฬิกานับถอยหลังสู่วันเกิดแบบเรียลไทม์',
    bdayCountdownSubtitle: 'นับถอยหลังสู่วันเกิดของคุณแบบสดๆ เป็นวัน ชั่วโมง นาที และวินาที',
    milestoneTitle: 'ตารางวันเกิดสำคัญ (Milestone)',
    milestoneAge: 'อายุสำคัญ',
    milestoneYear: 'ปี',
    milestoneDay: 'วันในสัปดาห์',
    milestoneStatus: 'สถานะ',
    celebrated: 'ฉลองแล้ว',
    upcoming: 'เร็วๆ นี้',
    countdownDays: 'วัน',
    countdownHours: 'ชั่วโมง',
    countdownMins: 'นาที',
    countdownSecs: 'วินาที',
    chronologicalTitle: 'เครื่องคำนวณอายุตามลำดับเวลา (Chronological)',
    chronologicalSubtitle: 'คำนวณอายุตามลำดับเวลาที่แน่นอนสำหรับบันทึกทางการแพทย์ การศึกษา และกฎหมาย',
    testDate: 'วันที่ทดสอบ / ประเมิน',
    calcChronologicalBtn: 'คำนวณอายุตามลำดับเวลา',
    decimalAge: 'อายุทศนิยม',
    totalMonths: 'จำนวนเดือนทั้งหมด',
    dobCalcTitle: 'เครื่องคำนวณหาวันเกิด (Date of Birth)',
    dobCalcSubtitle: 'คำนวณวันเกิดที่แน่นอนของคุณ หากคุณทราบอายุของคุณ ณ วันที่ระบุ',
    knownAge: 'อายุที่ทราบ (ปี, เดือน, วัน)',
    asOfDate: 'ณ วันที่',
    calcDobBtn: 'คำนวณวันเกิด',
    estimatedDob: 'วันเกิดที่คำนวณได้',
    daysBetweenTitle: 'เครื่องคำนวณจำนวนวันระหว่างวันที่',
    daysBetweenSubtitle: 'นับจำนวนวันตามปฏิทิน วันทำการ และวันหยุดสุดสัปดาห์ระหว่างสองวันที่ระบุ',
    includeEndDay: 'นับรวมวันสิ้นสุดด้วย (+1 วัน)',
    calcDaysBtn: 'คำนวณวัน',
    calendarDays: 'วันตามปฏิทิน',
    weekdaysCount: 'วันทำการ (จันทร์–ศุกร์)',
    weekendDaysCount: 'วันหยุดสุดสัปดาห์ (เสาร์–อาทิตย์)',
    leapYearTitle: 'เครื่องคำนวณอายุปีอธิกสุรทิน (29 ก.พ.)',
    leapYearSubtitle: 'คำนวณวันเกิดและหมุดหมาย 4 ปีสำหรับผู้ที่เกิดวันที่ 29 กุมภาพันธ์',
    isLeapYear: 'สถานะปีอธิกสุรทิน',
    leapMilestones: 'วันเกิดรอบ 4 ปี (Leap Birthdays)',
    nextLeapBday: 'วันเกิด 29 ก.พ. รอบถัดไป',
    retirementTitle: 'เครื่องคำนวณอายุเกษียณ',
    retirementSubtitle: 'วางแผนเส้นทางเกษียณและคำนวณปี เดือน วันที่เหลือจนกว่าจะถึงเป้าหมายเกษียณ',
    targetRetirementAge: 'อายุเป้าหมายในการเกษียณ',
    calcRetirementBtn: 'คำนวณวันเกษียณ',
    retirementDate: 'วันที่เกษียณเป้าหมาย',
    timeRemainingUntilRetirement: 'เวลาที่เหลือก่อนเกษียณ',
    howItWorks: 'วิธีใช้งานเครื่องคำนวณ',
    faqSectionTitle: 'คำถามที่พบบ่อย (FAQ)',
    popularToolsTitle: 'เครื่องมือยอดนิยม',
    guideTitle: 'วิธีคำนวณอายุ – คู่มือฉบับสมบูรณ์',
    aboutTitle: 'เกี่ยวกับเรา',
    contactTitle: 'ติดต่อเรา',
    privacyTitle: 'นโยบายความเป็นส่วนตัว',
    termsTitle: 'ข้อกำหนดการใช้งาน'
  },
  de: {
    appName: 'Altersrechner',
    tagline: 'Berechnen Sie Ihr genaues Alter in Jahren, Monaten, Tagen und Live-Sekunden.',
    calculateAge: 'Online Altersrechner',
    dob: 'Geburtsdatum',
    ageAsOf: 'Alter zum Stichtag',
    includeTime: 'Genaue Geburtszeit einbeziehen (Optional)',
    timeOfBirth: 'Geburtszeit',
    targetTime: 'Zielzeit',
    calculateBtn: 'Alter Berechnen',
    resetBtn: 'Zurücksetzen',
    printBtn: 'Drucken',
    copyBtn: 'Kopieren',
    copiedBtn: 'Kopiert!',
    exactAge: 'Ihr Genaues Alter',
    years: 'Jahre',
    months: 'Monate',
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    weeks: 'Wochen',
    totalDaysLived: 'Gesamte Gelebte Tage',
    totalWeeksLived: 'Gesamte Wochen',
    nextBirthday: 'Nächster Geburtstag',
    daysRemaining: 'Tage verbleibend',
    turningAge: 'Wird',
    happyBirthday: '🎉 Alles Gute zum Geburtstag!',
    timeBreakdown: 'Detaillierte Zeitaufschlüsselung',
    liveSeconds: 'Gelebte Sekunden in Echtzeit',
    heartbeats: 'Herzschläge',
    breaths: 'Atemzüge',
    solarOrbit: 'Fortschritt des Sonnenjahres',
    shareCard: 'Meine Alterskarte Teilen',
    downloadCard: 'Bild Herunterladen (PNG)',
    shareBtn: 'Bildkarte Teilen',
    moreTools: 'Weitere Rechner',
    allCalculators: 'Alle Alters- & Datumsrechner',
    selectLanguage: 'Wählen Sie Ihre Sprache',
    searchLanguage: 'Sprache suchen...',
    close: 'Schließen',
    bornOn: 'Geboren am',
    zodiacSign: 'Sternzeichen',
    chineseZodiac: 'Chinesisches Sternzeichen',
    openCalculator: 'Rechner Öffnen',
    heroTitle: 'Altersrechner',
    heroDesc: 'Berechnen Sie Ihr exaktes Alter in Jahren, Monaten und Tagen. Finden Sie Ihren nächsten Geburtstag und Live-Sekunden.',
    dateDiffTitle: 'Datumsdifferenz-Rechner',
    dateDiffSubtitle: 'Ermitteln Sie die exakte Zeitdifferenz und Dauer zwischen zwei Daten in Jahren, Monaten, Tagen und Stunden.',
    startDate: 'Startdatum (Von)',
    endDate: 'Enddatum (Bis)',
    calcDiffBtn: 'Differenz Berechnen',
    exactDuration: 'Exakte Kalenderdauer',
    between: 'Zwischen',
    and: 'und',
    totalDays: 'Gesamte Tage',
    totalWeeks: 'Gesamte Wochen',
    totalHours: 'Gesamte Stunden',
    totalMinutes: 'Gesamte Minuten',
    ageDiffTitle: 'Altersunterschied-Rechner',
    ageDiffSubtitle: 'Vergleichen Sie zwei Geburtsdaten, um den genauen Altersabstand in Jahren, Monaten und Tagen zu berechnen.',
    person1: 'Geburtsdatum Person 1',
    person2: 'Geburtsdatum Person 2',
    person1Label: 'Erste Person',
    person2Label: 'Zweite Person',
    calcAgeDiffBtn: 'Altersunterschied Berechnen',
    isOlderThan: 'ist älter als',
    byExactGap: 'mit einem exakten Abstand von:',
    sameAgeMsg: 'Beide Personen haben das exakt gleiche Geburtsdatum!',
    bdayTitle: 'Geburtstags- & Meilenstein-Rechner',
    bdaySubtitle: 'Erfahren Sie, wann Ihr nächster Geburtstag ist, wie viele Tage verbleiben und an welchen Wochentagen Ihre Meilensteine liegen.',
    bdayCountdownTitle: 'Live-Geburtstags-Countdown',
    bdayCountdownSubtitle: 'Echtzeit-Countdown mit Tagen, Stunden, Minuten und Sekunden bis zu Ihrem nächsten Geburtstag.',
    milestoneTitle: 'Meilenstein-Geburtstagsübersicht',
    milestoneAge: 'Meilenstein-Alter',
    milestoneYear: 'Jahr',
    milestoneDay: 'Wochentag',
    milestoneStatus: 'Status',
    celebrated: 'Gefeiert',
    upcoming: 'Bevorstehend',
    countdownDays: 'Tage',
    countdownHours: 'Stunden',
    countdownMins: 'Minuten',
    countdownSecs: 'Sekunden',
    chronologicalTitle: 'Chronologischer Altersrechner',
    chronologicalSubtitle: 'Berechnen Sie das exakte chronologische Alter für medizinische, schulische und rechtliche Dokumente.',
    testDate: 'Test- / Stichtagsdatum',
    calcChronologicalBtn: 'Chronologisches Alter Berechnen',
    decimalAge: 'Dezimalalter',
    totalMonths: 'Gesamte Monate',
    dobCalcTitle: 'Geburtsdatum-Rechner',
    dobCalcSubtitle: 'Berechnen Sie Ihr Geburtsdatum anhand Ihres Alters an einem bestimmten Stichtag.',
    knownAge: 'Bekanntes Alter (Jahre, Monate, Tage)',
    asOfDate: 'Zum Stichtag',
    calcDobBtn: 'Geburtsdatum Berechnen',
    estimatedDob: 'Berechnetes Geburtsdatum',
    daysBetweenTitle: 'Tage-Zwischen-Zwei-Daten-Rechner',
    daysBetweenSubtitle: 'Zählen Sie Kalendertage, Arbeitstage (Mo–Fr) und Wochenendtage zwischen zwei Daten.',
    includeEndDay: 'Enddatum mitzählen (+1 Tag)',
    calcDaysBtn: 'Tage Berechnen',
    calendarDays: 'Kalendertage',
    weekdaysCount: 'Arbeitstage (Mo–Fr)',
    weekendDaysCount: 'Wochenendtage (Sa–So)',
    leapYearTitle: 'Schaltjahr-Altersrechner',
    leapYearSubtitle: 'Berechnen Sie Geburtstage und 4-Jahres-Meilensteine für am 29. Februar Geborene.',
    isLeapYear: 'Schaltjahr-Status',
    leapMilestones: 'Schaltjahr-Geburtstage (alle 4 Jahre)',
    nextLeapBday: 'Nächster 29. Februar Geburtstag',
    retirementTitle: 'Rentenaltersrechner',
    retirementSubtitle: 'Planen Sie Ihren Ruhestand und berechnen Sie verbleibende Jahre, Monate und Tage bis zur Rente.',
    targetRetirementAge: 'Ziel-Rentenalter',
    calcRetirementBtn: 'Rentendatum Berechnen',
    retirementDate: 'Ziel-Rentendatum',
    timeRemainingUntilRetirement: 'Verbleibende Zeit bis zur Rente',
    howItWorks: 'So Funktioniert der Rechner',
    faqSectionTitle: 'Häufig Gestellte Fragen (FAQ)',
    popularToolsTitle: 'Beliebte Alters- & Datums-Tools',
    guideTitle: 'Wie man das Alter berechnet – Anleitung',
    aboutTitle: 'Über Uns',
    contactTitle: 'Kontakt',
    privacyTitle: 'Datenschutz',
    termsTitle: 'Nutzungsbedingungen'
  },
  es: {
    appName: 'Calculadora de Edad',
    tagline: 'Calcula tu edad exacta en años, meses, días y segundos en vivo.',
    calculateAge: 'Calculadora de Edad en Línea',
    dob: 'Fecha de Nacimiento',
    ageAsOf: 'Edad a la Fecha',
    includeTime: 'Incluir Hora Exacta de Nacimiento (Opcional)',
    timeOfBirth: 'Hora de Nacimiento',
    targetTime: 'Hora Objetivo',
    calculateBtn: 'Calcular Edad',
    resetBtn: 'Restablecer',
    printBtn: 'Imprimir',
    copyBtn: 'Copiar',
    copiedBtn: '¡Copiado!',
    exactAge: 'Tu Edad Exacta',
    years: 'Años',
    months: 'Meses',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    weeks: 'Semanas',
    totalDaysLived: 'Total de Días Vividos',
    totalWeeksLived: 'Total de Semanas',
    nextBirthday: 'Próximo Cumpleaños',
    daysRemaining: 'días restantes',
    turningAge: 'Cumpliendo',
    happyBirthday: '🎉 ¡Feliz Cumpleaños Hoy!',
    timeBreakdown: 'Desglose Completo del Tiempo',
    liveSeconds: 'Segundos Totales en Vivo',
    heartbeats: 'Latidos',
    breaths: 'Respiraciones',
    solarOrbit: 'Progreso Orbital Solar',
    shareCard: 'Tarjeta de Mi Edad',
    downloadCard: 'Descargar Imagen (PNG)',
    shareBtn: 'Compartir Tarjeta',
    moreTools: 'Más Herramientas',
    allCalculators: 'Todas las Calculadoras',
    selectLanguage: 'Elige tu Idioma',
    searchLanguage: 'Buscar idioma...',
    close: 'Cerrar',
    bornOn: 'Nacido el',
    zodiacSign: 'Signo Zodiacal',
    chineseZodiac: 'Zodíaco Chino',
    openCalculator: 'Abrir Calculadora',
    heroTitle: 'Calculadora de Edad',
    heroDesc: 'Calcula tu edad exacta en años, meses y días. Descubre tu próximo cumpleaños y segundos totales vividos.',
    dateDiffTitle: 'Calculadora de Diferencia de Fechas',
    dateDiffSubtitle: 'Calcula la diferencia exacta de tiempo y duración entre dos fechas del calendario en años, meses y días.',
    startDate: 'Fecha Inicial (Desde)',
    endDate: 'Fecha Final (Hasta)',
    calcDiffBtn: 'Calcular Diferencia',
    exactDuration: 'Duración Exacta del Calendario',
    between: 'Entre',
    and: 'y',
    totalDays: 'Total de Días',
    totalWeeks: 'Total de Semanas',
    totalHours: 'Total de Horas',
    totalMinutes: 'Total de Minutos',
    ageDiffTitle: 'Calculadora de Diferencia de Edad',
    ageDiffSubtitle: 'Compara dos fechas de nacimiento para calcular la diferencia exacta de edad en años, meses y días.',
    person1: 'Fecha de Nacimiento Persona 1',
    person2: 'Fecha de Nacimiento Persona 2',
    person1Label: 'Primera Persona',
    person2Label: 'Segunda Persona',
    calcAgeDiffBtn: 'Calcular Diferencia de Edad',
    isOlderThan: 'es mayor que',
    byExactGap: 'por una diferencia exacta de:',
    sameAgeMsg: '¡Ambas personas tienen exactamente la misma fecha de nacimiento!',
    bdayTitle: 'Calculadora de Cumpleaños y Fechas Clave',
    bdaySubtitle: 'Descubre cuándo es tu próximo cumpleaños, cuántos días faltan y los días de la semana de tus cumpleaños clave.',
    bdayCountdownTitle: 'Cuenta Regresiva de Cumpleaños en Vivo',
    bdayCountdownSubtitle: 'Cuenta regresiva en tiempo real con días, horas, minutos y segundos restantes hasta tu próximo cumpleaños.',
    milestoneTitle: 'Calendario de Cumpleaños Clave',
    milestoneAge: 'Edad Clave',
    milestoneYear: 'Año',
    milestoneDay: 'Día de la Semana',
    milestoneStatus: 'Estado',
    celebrated: 'Celebrado',
    upcoming: 'Próximo',
    countdownDays: 'Días',
    countdownHours: 'Horas',
    countdownMins: 'Minutos',
    countdownSecs: 'Segundos',
    chronologicalTitle: 'Calculadora de Edad Cronológica',
    chronologicalSubtitle: 'Calcula la edad cronológica exacta para admisiones escolares, evaluaciones clínicas y registros legales.',
    testDate: 'Fecha de Prueba / Evaluación',
    calcChronologicalBtn: 'Calcular Edad Cronológica',
    decimalAge: 'Edad Decimal',
    totalMonths: 'Total de Meses',
    dobCalcTitle: 'Calculadora de Fecha de Nacimiento',
    dobCalcSubtitle: 'Calcula tu fecha exacta de nacimiento conociendo tu edad en una fecha de referencia determinada.',
    knownAge: 'Edad Conocida (Años, Meses, Días)',
    asOfDate: 'A la Fecha',
    calcDobBtn: 'Calcular Fecha de Nacimiento',
    estimatedDob: 'Fecha de Nacimiento Calculada',
    daysBetweenTitle: 'Calculadora de Días Entre Fechas',
    daysBetweenSubtitle: 'Cuenta el número exacto de días naturales, días laborales (lun–vie) y fines de semana entre dos fechas.',
    includeEndDay: 'Incluir fecha final en el conteo (+1 día)',
    calcDaysBtn: 'Calcular Días',
    calendarDays: 'Días Naturales',
    weekdaysCount: 'Días Laborables (Lun–Vie)',
    weekendDaysCount: 'Días de Fin de Semana (Sáb–Dom)',
    leapYearTitle: 'Calculadora de Edad para Años Bisiestos',
    leapYearSubtitle: 'Calcula cumpleaños e hitos de 4 años para los nacidos el 29 de febrero.',
    isLeapYear: 'Estado de Año Bisiesto',
    leapMilestones: 'Cumpleaños Bisiestos Cuatrienales',
    nextLeapBday: 'Próximo Cumpleaños Oficial 29 de Feb',
    retirementTitle: 'Calculadora de Edad de Jubilación',
    retirementSubtitle: 'Planifica tu jubilación y calcula los años, meses y días restantes hasta tu fecha objetivo.',
    targetRetirementAge: 'Edad Objetivo de Jubilación',
    calcRetirementBtn: 'Calcular Fecha de Jubilación',
    retirementDate: 'Fecha Objetivo de Jubilación',
    timeRemainingUntilRetirement: 'Tiempo Restante para la Jubilación',
    howItWorks: 'Cómo Funciona la Calculadora',
    faqSectionTitle: 'Preguntas Frecuentes (FAQ)',
    popularToolsTitle: 'Herramientas Populares',
    guideTitle: 'Cómo Calcular la Edad – Guía de Precisión',
    aboutTitle: 'Sobre Nosotros',
    contactTitle: 'Contacto',
    privacyTitle: 'Política de Privacidad',
    termsTitle: 'Términos de Servicio'
  }
};

// Build complete dictionaries
const DICTIONARIES = {};
for (const lang of LANGUAGES) {
  DICTIONARIES[lang] = { ...BASE_EN, ...(TRANSLATIONS_MAP[lang] || {}) };
}

// Generate src/lib/i18n/dictionaries.ts
const dictCode = `// AUTO-GENERATED - Complete translation dictionaries for all 39 languages
export type TranslationKey =
  | 'appName'
  | 'tagline'
  | 'calculateAge'
  | 'dob'
  | 'ageAsOf'
  | 'includeTime'
  | 'timeOfBirth'
  | 'targetTime'
  | 'calculateBtn'
  | 'resetBtn'
  | 'printBtn'
  | 'copyBtn'
  | 'copiedBtn'
  | 'exactAge'
  | 'years'
  | 'months'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'weeks'
  | 'totalDaysLived'
  | 'totalWeeksLived'
  | 'nextBirthday'
  | 'daysRemaining'
  | 'turningAge'
  | 'happyBirthday'
  | 'timeBreakdown'
  | 'liveSeconds'
  | 'heartbeats'
  | 'breaths'
  | 'solarOrbit'
  | 'shareCard'
  | 'downloadCard'
  | 'shareBtn'
  | 'moreTools'
  | 'allCalculators'
  | 'selectLanguage'
  | 'searchLanguage'
  | 'close'
  | 'bornOn'
  | 'zodiacSign'
  | 'chineseZodiac'
  | 'openCalculator'
  | 'heroTitle'
  | 'heroDesc'
  | 'dateDiffTitle'
  | 'dateDiffSubtitle'
  | 'startDate'
  | 'endDate'
  | 'calcDiffBtn'
  | 'exactDuration'
  | 'between'
  | 'and'
  | 'totalDays'
  | 'totalWeeks'
  | 'totalHours'
  | 'totalMinutes'
  | 'ageDiffTitle'
  | 'ageDiffSubtitle'
  | 'person1'
  | 'person2'
  | 'person1Label'
  | 'person2Label'
  | 'calcAgeDiffBtn'
  | 'isOlderThan'
  | 'byExactGap'
  | 'sameAgeMsg'
  | 'bdayTitle'
  | 'bdaySubtitle'
  | 'bdayCountdownTitle'
  | 'bdayCountdownSubtitle'
  | 'milestoneTitle'
  | 'milestoneAge'
  | 'milestoneYear'
  | 'milestoneDay'
  | 'milestoneStatus'
  | 'celebrated'
  | 'upcoming'
  | 'countdownDays'
  | 'countdownHours'
  | 'countdownMins'
  | 'countdownSecs'
  | 'chronologicalTitle'
  | 'chronologicalSubtitle'
  | 'testDate'
  | 'calcChronologicalBtn'
  | 'decimalAge'
  | 'totalMonths'
  | 'dobCalcTitle'
  | 'dobCalcSubtitle'
  | 'knownAge'
  | 'asOfDate'
  | 'calcDobBtn'
  | 'estimatedDob'
  | 'daysBetweenTitle'
  | 'daysBetweenSubtitle'
  | 'includeEndDay'
  | 'calcDaysBtn'
  | 'calendarDays'
  | 'weekdaysCount'
  | 'weekendDaysCount'
  | 'leapYearTitle'
  | 'leapYearSubtitle'
  | 'isLeapYear'
  | 'leapMilestones'
  | 'nextLeapBday'
  | 'retirementTitle'
  | 'retirementSubtitle'
  | 'targetRetirementAge'
  | 'calcRetirementBtn'
  | 'retirementDate'
  | 'timeRemainingUntilRetirement'
  | 'howItWorks'
  | 'faqSectionTitle'
  | 'popularToolsTitle'
  | 'guideTitle'
  | 'aboutTitle'
  | 'contactTitle'
  | 'privacyTitle'
  | 'termsTitle';

export const TRANSLATIONS: Record<string, Partial<Record<TranslationKey, string>>> = ${JSON.stringify(DICTIONARIES, null, 2)};

export function getTranslation(lang: string, key: TranslationKey, fallback?: string): string {
  const code = (lang || 'en').toLowerCase().split('-')[0];
  const dict = TRANSLATIONS[code] || TRANSLATIONS['en'];
  return (dict && dict[key]) || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) || fallback || key;
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/lib/i18n/dictionaries.ts'), dictCode, 'utf-8');
console.log('✓ Successfully generated src/lib/i18n/dictionaries.ts');
