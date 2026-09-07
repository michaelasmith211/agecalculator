import json
import os

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
locales_dir = os.path.join(root_dir, 'locales')
src_locales_dir = os.path.join(root_dir, 'src', 'locales')

os.makedirs(locales_dir, exist_ok=True)
os.makedirs(src_locales_dir, exist_ok=True)

EN = {
  "meta": {
    "homeTitle": "Age Calculator – Calculate Exact Age in Years, Months & Days",
    "homeDescription": "Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds. Features birthday countdown, total days lived, and stats.",
    "homeH1": "Online Age Calculator",
    "homeSubtitle": "Calculate your exact chronological age in years, months, days, hours, and live running seconds with millisecond Gregorian calendar precision."
  },
  "navigation": {
    "home": "Home",
    "ageCalculator": "Age Calculator",
    "birthday": "Birthday",
    "ageDifference": "Age Difference",
    "dateDifference": "Date Difference",
    "dateOfBirth": "Date of Birth",
    "moreTools": "More Tools",
    "allAgeTools": "All Age & Date Tools",
    "calculateAge": "Calculate Age",
    "calculateMyAgeNow": "Calculate My Age Now",
    "mainTools": "Main Tools",
    "moreCalculators": "More Calculators"
  },
  "calculator": {
    "badge": "Instant Calendar & Time Precision Calculation",
    "dobLabel": "Date of Birth",
    "dobPlaceholder": "Select your birth date",
    "dobHelper": "Select your birth day, month, and year (DD / MM / YYYY). Auto-saved locally in cookies.",
    "targetDateLabel": "Age As Of Date",
    "useToday": "Use Today",
    "changeDate": "Change Date",
    "includeTime": "Include Exact Birth Time (Optional)",
    "includeTimeHelper": "For down-to-the-minute precision",
    "birthTimeLabel": "Time of Birth (Local Time)",
    "calculate": "Calculate Age",
    "reset": "Reset",
    "clear": "Clear",
    "copied": "Copied!",
    "copy": "Copy",
    "print": "Print",
    "yourExactAge": "Your Exact Age",
    "years": "Years",
    "months": "Months",
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "nextBirthday": "Next Birthday",
    "daysRemaining": "days remaining",
    "turning": "Turning",
    "happyBirthday": "🎉 Happy Birthday Today!",
    "totalDaysLived": "Total Days Lived",
    "totalWeeks": "Total Weeks",
    "heartbeats": "Estimated Heartbeats",
    "solarOrbit": "Solar Year Progress",
    "liveSeconds": "Running Total Seconds Lived",
    "timeBreakdown": "Comprehensive Time Breakdown",
    "zodiacSign": "Western Zodiac",
    "chineseZodiac": "Chinese Zodiac",
    "dayBorn": "Day of Birth"
  },
  "features": {
    "gregorianPrecisionTitle": "Gregorian Precision",
    "gregorianPrecisionDesc": "Accounts for leap years, 30/31-day months, and February leap days down to the second.",
    "liveSecondsTitle": "Live Running Seconds",
    "liveSecondsDesc": "Real-time live age odometer synchronized with your device clock.",
    "privateAndFreeTitle": "100% Private & Free",
    "privateAndFreeDesc": "No registration or server uploads. All calculations run strictly in your browser."
  },
  "howItWorks": {
    "title": "How the Age Calculator Works",
    "subtitle": "A transparent breakdown of how our algorithm calculates calendar days, handles month borrowing, and tracks live seconds."
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      {
        "question": "How does the Age Calculator calculate my exact age?",
        "answer": "The calculator compares your Date of Birth with your target date using the Gregorian calendar algorithm. It computes complete elapsed years, calculates remaining full months, and calculates the remaining days by borrowing the exact days of the previous month."
      },
      {
        "question": "Does this calculator account for leap years?",
        "answer": "Yes. The algorithm handles February 29 correctly. If your birthday is on a leap day, the calculator checks leap cycle rules and measures exact calendar intervals."
      },
      {
        "question": "How accurate is the live running seconds counter?",
        "answer": "The live counter updates every second in real time, synchronized with your system clock, computing exact elapsed seconds from your birth timestamp."
      },
      {
        "question": "Is my personal data safe and private?",
        "answer": "Yes, 100%. All calculations happen entirely on your device inside your web browser. No personal information or birth dates are transmitted to any external server."
      },
      {
        "question": "Can I calculate the age difference between two people?",
        "answer": "Yes. Use our Age Difference Calculator to compare two birth dates and find the exact duration in years, months, and days."
      }
    ]
  },
  "breadcrumbs": {
    "home": "Home"
  },
  "related": {
    "title": "Explore Related Age & Date Calculators",
    "description": "Quickly switch to specialized calculators for birthdays, milestone ages, date durations, and interval counting.",
    "openCalculator": "Open Calculator"
  },
  "languageSelector": {
    "title": "Select Language",
    "subtitle": "Choose your preferred language for the entire website",
    "searchPlaceholder": "Search language...",
    "close": "Close"
  },
  "footer": {
    "brandDescription": "Free, accurate, and privacy-first online age calculator. Compute your exact age in years, months, and days, find your next birthday countdown, and calculate time differences with calendar precision.",
    "coreCalculators": "Age Calculators",
    "specialtyTools": "Specialty Tools",
    "guide": "Calculation Guide",
    "company": "Company & Legal",
    "aboutUs": "About Us",
    "contact": "Contact",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "languages": "Supported Languages & International Versions",
    "clientSideBadge": "100% Client-Side • Zero Data Stored",
    "allRightsReserved": "All rights reserved."
  },
  "errors": {
    "invalidDate": "Please enter a valid date.",
    "futureDate": "Birth date cannot be in the future.",
    "requiredDate": "Please select your date of birth."
  },
  "tools": {
    "age-calculator": { "title": "Age Calculator", "desc": "Calculate your exact age in years, months, days, and live running seconds." },
    "birthday-calculator": { "title": "Birthday Calculator", "desc": "Discover your next birthday, day of week, days countdown, and milestone ages." },
    "age-difference-calculator": { "title": "Age Difference Calculator", "desc": "Compare two dates of birth to find the precise difference in years, months, and days." },
    "birthday-countdown": { "title": "Birthday Countdown", "desc": "Live real-time ticking countdown clock for upcoming birthdays and milestone celebrations." },
    "date-difference-calculator": { "title": "Date Difference Calculator", "desc": "Find the exact duration and interval between any two dates in years, months, and days." },
    "date-of-birth-calculator": { "title": "Date of Birth Calculator", "desc": "Reverse calculator: determine your exact or approximate birth date from given age." },
    "days-between-dates": { "title": "Days Between Dates", "desc": "Calculate total calendar days and business days between any two dates." },
    "chronological-age-calculator": { "title": "Chronological Age Calculator", "desc": "Standard clinical and academic chronological age calculator (YY;MM;DD)." },
    "retirement-age-calculator": { "title": "Retirement Age Calculator", "desc": "Estimate your retirement milestone date and calculate remaining years and working days." },
    "leap-year-age-calculator": { "title": "Leap Year Age Calculator", "desc": "Special calculator for February 29 leap day babies to track birthdays vs calendar years." },
    "how-to-calculate-age": { "title": "How to Calculate Age", "desc": "Step-by-step mathematical guide to manual age calculation and calendar borrowing rules." }
  }
}

LANGUAGES = {
  "en": {
    "name": "English", "native": "English", "dir": "ltr",
    "calc_name": "Age Calculator", "calc_btn": "Calculate Age", "years": "Years", "months": "Months", "days": "Days", "seconds": "Seconds",
    "home_title": "Age Calculator – Calculate Exact Age in Years, Months & Days",
    "home_desc": "Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds. Features birthday countdown, total days lived, and stats.",
    "home_h1": "Online Age Calculator",
    "home_sub": "Calculate your exact chronological age in years, months, days, hours, and live running seconds with millisecond Gregorian calendar precision."
  },
  "es": {
    "name": "Spanish", "native": "Español", "dir": "ltr",
    "calc_name": "Calculadora de Edad", "calc_btn": "Calcular Edad", "years": "Años", "months": "Meses", "days": "Días", "seconds": "Segundos",
    "home_title": "Calculadora de Edad – Calcular Edad Exacta en Años, Meses y Días",
    "home_desc": "Calculadora de edad online gratis. Calcula tu edad exacta en años, meses, días y segundos en vivo. Cuenta regresiva para cumpleaños y estadísticas.",
    "home_h1": "Calculadora de Edad Online",
    "home_sub": "Calcula tu edad cronológica exacta en años, meses, días, horas y segundos en vivo con total precisión del calendario gregoriano."
  },
  "fr": {
    "name": "French", "native": "Français", "dir": "ltr",
    "calc_name": "Calculateur d'Âge", "calc_btn": "Calculer l'Âge", "years": "Ans", "months": "Mois", "days": "Jours", "seconds": "Secondes",
    "home_title": "Calculateur d'Âge – Calculer Votre Âge Exact en Années, Mois et Jours",
    "home_desc": "Calculateur d'âge en ligne gratuit. Calculez votre âge exact en années, mois, jours et secondes en direct avec compte à rebours d'anniversaire.",
    "home_h1": "Calculateur d'Âge en Ligne",
    "home_sub": "Calculez votre âge chronologique exact en années, mois, jours, heures et secondes en direct avec une précision calendaire grégorienne."
  },
  "de": {
    "name": "German", "native": "Deutsch", "dir": "ltr",
    "calc_name": "Altersrechner", "calc_btn": "Alter Berechnen", "years": "Jahre", "months": "Monate", "days": "Tage", "seconds": "Sekunden",
    "home_title": "Altersrechner – Exaktes Alter in Jahren, Monaten & Tagen Berechnen",
    "home_desc": "Kostenloser Online-Altersrechner. Berechnen Sie Ihr genaues Alter in Jahren, Monaten, Tagen und Live-Sekunden mit Geburtstags-Countdown.",
    "home_h1": "Online Altersrechner",
    "home_sub": "Berechnen Sie Ihr exaktes chronologisches Alter in Jahren, Monaten, Tagen, Stunden und Live-Sekunden mit gregorianischer Präzision."
  },
  "pt": {
    "name": "Portuguese", "native": "Português", "dir": "ltr",
    "calc_name": "Calculadora de Idade", "calc_btn": "Calcular Idade", "years": "Anos", "months": "Meses", "days": "Dias", "seconds": "Segundos",
    "home_title": "Calculadora de Idade – Calcular Idade Exata em Anos, Meses e Dias",
    "home_desc": "Calculadora de idade online grátis. Calcule sua idade exata em anos, meses, dias e segundos ao vivo com contagem regressiva de aniversário.",
    "home_h1": "Calculadora de Idade Online",
    "home_sub": "Calcule sua idade cronológica exata em anos, meses, dias, horas e segundos ao vivo com precisão total do calendário gregoriano."
  },
  "it": {
    "name": "Italian", "native": "Italiano", "dir": "ltr",
    "calc_name": "Calcolo Età", "calc_btn": "Calcola l'Età", "years": "Anni", "months": "Mesi", "days": "Giorni", "seconds": "Secondi",
    "home_title": "Calcolo Età – Calcola la Tua Età Esatta in Anni, Mesi e Giorni",
    "home_desc": "Calcolatore dell'età online gratis. Calcola la tua età esatta in anni, mesi, giorni e secondi in tempo reale con conto alla rovescia del compleanno.",
    "home_h1": "Calcolatore dell'Età Online",
    "home_sub": "Calcola la tua età cronologica esatta in anni, mesi, giorni, ore e secondi in tempo reale con precisione del calendario gregoriano."
  },
  "hi": {
    "name": "Hindi", "native": "हिन्दी", "dir": "ltr",
    "calc_name": "आयु कैलकुलेटर", "calc_btn": "आयु की गणना करें", "years": "वर्ष", "months": "महीने", "days": "दिन", "seconds": "सेकंड",
    "home_title": "आयु कैलकुलेटर – अपनी सटीक उम्र वर्ष, माह और दिनों में जानें",
    "home_desc": "मुफ्त ऑनलाइन आयु कैलकुलेटर। अपनी सटीक उम्र साल, महीने, दिन और लाइव सेकंड में जानें। जन्मदिन काउंटडाउन और जीवन सांख्यिकी।",
    "home_h1": "ऑनलाइन आयु कैलकुलेटर",
    "home_sub": "ग्रेगोरियन कैलेंडर की पूर्ण सटीकता के साथ अपनी वास्तविक उम्र वर्ष, महीने, दिन, घंटे और लाइव सेकंड में गणना करें।"
  },
  "mr": {
    "name": "Marathi", "native": "मराठी", "dir": "ltr",
    "calc_name": "वय कॅल्क्युलेटर", "calc_btn": "वय मोजा", "years": "वर्षे", "months": "महिने", "days": "दिवस", "seconds": "सेकंद",
    "home_title": "वय कॅल्क्युलेटर – तुमचे अचूक वय वर्षे, महिने आणि दिवसांमध्ये जाणा",
    "home_desc": "मोफत ऑनलाइन वय कॅल्क्युलेटर. तुमचे अचूक वय वर्षे, महिने, दिवस आणि थेट सेकंदांमध्ये मोजा. वाढदिवस काउंटडाउन आणि जीवन आकडेवारी.",
    "home_h1": "ऑनलाइन वय कॅल्क्युलेटर",
    "home_sub": "ग्रेगोरियन कॅलेंडरच्या पूर्ण अचूकतेसह तुमचे अचूक वय वर्षे, महिने, दिवस, तास आणि सेकंदांमध्ये मोजा."
  },
  "bn": {
    "name": "Bengali", "native": "বাংলা", "dir": "ltr",
    "calc_name": "বয়স ক্যালকুলেটর", "calc_btn": "বয়স গণনা করুন", "years": "বছর", "months": "মাস", "days": "দিন", "seconds": "সেকেন্ড",
    "home_title": "বয়স ক্যালকুলেটর – বছর, মাস ও দিনে সঠিক বয়স গণনা করুন",
    "home_desc": "বিনামূল্যে অনলাইন বয়স ক্যালকুলেটর। আপনার সঠিক বয়স বছর, মাস, দিন এবং রিয়েল-টাইম সেকেন্ডে গণনা করুন।",
    "home_h1": "অনলাইন বয়স ক্যালকুলেটর",
    "home_sub": "গ্রেগরিয়ান ক্যালেন্ডারের নিখুঁত নির্ভুলতার সাথে আপনার সঠিক বয়স বছর, মাস, দিন, ঘন্টা এবং সেকেন্ডে হিসাব করুন।"
  },
  "ar": {
    "name": "Arabic", "native": "العربية", "dir": "rtl",
    "calc_name": "حاسبة العمر", "calc_btn": "احسب العمر", "years": "سنة", "months": "أشهر", "days": "أيام", "seconds": "ثواني",
    "home_title": "حاسبة العمر – احسب عمرك الدقيق بالسنوات والأشهر والأيام",
    "home_desc": "حاسبة العمر الدقيقة مجاناً عبر الإنترنت. احسب عمرك بالسنوات والأشهر والأيام والثواني الحية مع العد التنازلي لعيد ميلادك.",
    "home_h1": "حاسبة العمر الدقيقة عبر الإنترنت",
    "home_sub": "احسب عمرك الزمني الدقيق بالسنوات والأشهر والأيام والساعات والثواني الحية بدقة التقويم الميلادي الكاملة."
  },
  "ru": {
    "name": "Russian", "native": "Русский", "dir": "ltr",
    "calc_name": "Калькулятор Возраста", "calc_btn": "Рассчитать Возраст", "years": "Лет", "months": "Месяцев", "days": "Дней", "seconds": "Секунд",
    "home_title": "Калькулятор Возраста – Точный Расчет в Годах, Месяцах и Днях",
    "home_desc": "Бесплатный онлайн калькулятор возраста. Рассчитайте точный возраст в годах, месяцах, днях и секундах онлайн с обратным отсчетом дня рождения.",
    "home_h1": "Онлайн Калькулятор Возраста",
    "home_sub": "Рассчитайте свой точный хронологический возраст в годах, месяцах, днях, часах и секундах с григорианской точностью."
  },
  "ja": {
    "name": "Japanese", "native": "日本語", "dir": "ltr",
    "calc_name": "年齢計算機", "calc_btn": "年齢を計算する", "years": "年", "months": "ヶ月", "days": "日", "seconds": "秒",
    "home_title": "年齢計算機 – 生年月日から現在の正確な年齢を計算",
    "home_desc": "無料のオンライン年齢計算ツール。生年月日から満年齢、月数、日数、リアルタイムの経過秒数を瞬時に精密計算します。",
    "home_h1": "オンライン年齢計算機",
    "home_sub": "グレゴリオ暦の正確なアルゴリズムに基づき、満年齢・月数・日数・経過秒数をリアルタイムで計算します。"
  },
  "ko": {
    "name": "Korean", "native": "한국어", "dir": "ltr",
    "calc_name": "나이 계산기", "calc_btn": "나이 계산하기", "years": "년", "months": "개월", "days": "일", "seconds": "초",
    "home_title": "나이 계산기 – 만 나이 및 정확한 연월일 계산",
    "home_desc": "무료 온라인 만 나이 계산기. 생년월일을 입력하여 정확한 만 나이, 개월, 일수 및 실시간 경과 초를 계산하세요.",
    "home_h1": "온라인 나이 계산기",
    "home_sub": "그레고리력 기준 완벽한 계산 알고리즘으로 만 나이, 살아온 총 일수 및 다음 생일 디데이를 제공합니다."
  },
  "zh": {
    "name": "Chinese", "native": "中文", "dir": "ltr",
    "calc_name": "年龄计算器", "calc_btn": "计算年龄", "years": "岁", "months": "个月", "days": "天", "seconds": "秒",
    "home_title": "周岁年龄计算器 – 精准计算出生年月日、周岁与天数",
    "home_desc": "免费在线年龄计算器。输入出生日期，快速计算您的精准周岁、出生月数、总天数及实时秒数。",
    "home_h1": "在线周岁年龄计算器",
    "home_sub": "采用公历精准算法，实时计算您的准确周岁年龄、总存活天数、下个生日倒计时及属相星座。"
  },
  "tr": {
    "name": "Turkish", "native": "Türkçe", "dir": "ltr",
    "calc_name": "Yaş Hesaplama", "calc_btn": "Yaş Hesapla", "years": "Yıl", "months": "Ay", "days": "Gün", "seconds": "Saniye",
    "home_title": "Yaş Hesaplama – Yıl, Ay ve Gün Olarak Tam Yaşınızı Hesaplayın",
    "home_desc": "Ücretsiz online yaş hesaplama aracı. Doğum tarihinize göre yaşınızı yıl, ay, gün ve canlı saniye olarak kesin hesaplayın.",
    "home_h1": "Online Yaş Hesaplama Aracı",
    "home_sub": "Miladi takvim hassasiyetiyle doğum tarihinizden itibaren geçen tam yıl, ay, gün ve saniyeleri hesaplayın."
  },
  "id": {
    "name": "Indonesian", "native": "Bahasa Indonesia", "dir": "ltr",
    "calc_name": "Kalkulator Usia", "calc_btn": "Hitung Usia", "years": "Tahun", "months": "Bulan", "days": "Hari", "seconds": "Detik",
    "home_title": "Kalkulator Usia – Hitung Usia Tepat dalam Tahun, Bulan & Hari",
    "home_desc": "Kalkulator usia online gratis. Hitung usia persis Anda dalam tahun, bulan, hari, dan detik berjalan dengan countdown ulang tahun.",
    "home_h1": "Kalkulator Usia Online",
    "home_sub": "Hitung usia kronologis tepat Anda dalam tahun, bulan, hari, jam, dan detik berjalan dengan presisi kalender Gregorian."
  },
  "nl": {
    "name": "Dutch", "native": "Nederlands", "dir": "ltr",
    "calc_name": "Leeftijd Berekenen", "calc_btn": "Leeftijd Berekenen", "years": "Jaar", "months": "Maanden", "days": "Dagen", "seconds": "Seconden",
    "home_title": "Leeftijd Berekenen – Bereken Uw Exacte Leeftijd in Jaren, Maanden & Dagen",
    "home_desc": "Gratis online leeftijdscalculator. Bereken uw exacte leeftijd in jaren, maanden, dagen en live seconden met verjaardagscountdown.",
    "home_h1": "Online Leeftijdscalculator",
    "home_sub": "Bereken uw exacte chronologische leeftijd in jaren, maanden, dagen, uren en seconden met Gregoriaanse kalenderprecisie."
  },
  "pl": {
    "name": "Polish", "native": "Polski", "dir": "ltr",
    "calc_name": "Kalkulator Wieku", "calc_btn": "Oblicz Wiek", "years": "Lat", "months": "Miesięcy", "days": "Dni", "seconds": "Sekund",
    "home_title": "Kalkulator Wieku – Oblicz Dokładny Wiek w Latach, Miesiącach i Dniach",
    "home_desc": "Darmowy kalkulator wieku online. Oblicz swój dokładny wiek w latach, miesiącach, dniach i sekundach na żywo oraz odliczanie do urodzin.",
    "home_h1": "Kalkulator Wieku Online",
    "home_sub": "Oblicz swój dokładny wiek chronologiczny w latach, miesiącach, dniach, godzinach i sekundach z precyzją kalendarza gregoriańskiego."
  },
  "sv": {
    "name": "Swedish", "native": "Svenska", "dir": "ltr",
    "calc_name": "Räkna Ut Ålder", "calc_btn": "Räkna Ut Ålder", "years": "År", "months": "Månader", "days": "Dagar", "seconds": "Sekunder",
    "home_title": "Räkna Ut Ålder – Beräkna Exakt Ålder i År, Månader och Dagar",
    "home_desc": "Gratis åldersräknare online. Beräkna din exakta ålder i år, månader, dagar och levande sekunder med födelsedagsnedräkning.",
    "home_h1": "Åldersräknare Online",
    "home_sub": "Beräkna din exakta kronologiska ålder i år, månader, dagar, timmar och sekunder med full gregoriansk kalenderprecision."
  },
  "da": {
    "name": "Danish", "native": "Dansk", "dir": "ltr",
    "calc_name": "Beregn Alder", "calc_btn": "Beregn Alder", "years": "År", "months": "Måneder", "days": "Dage", "seconds": "Sekunder",
    "home_title": "Beregn Alder – Find Din Nøjagtige Alder i År, Måneder og Dage",
    "home_desc": "Gratis online alder beregner. Beregn din nøjagtige alder i år, måneder, dage og levende sekunder med fødselsdagsnedtælling.",
    "home_h1": "Online Alder Beregner",
    "home_sub": "Beregn din nøjagtige kronologiske alder i år, måneder, dage, timer og sekunder med gregoriansk kalenderpræcision."
  },
  "fi": {
    "name": "Finnish", "native": "Suomi", "dir": "ltr",
    "calc_name": "Ikälaskuri", "calc_btn": "Laske Ikä", "years": "Vuotta", "months": "Kuukautta", "days": "Päivää", "seconds": "Sekuntia",
    "home_title": "Ikälaskuri – Laske Tarkka Ikäsi Vuosina, Kuukausina ja Päivinä",
    "home_desc": "Ilmainen online ikälaskuri. Laske tarkka ikäsi vuosina, kuukausina, päivinä ja reaaliaikaisina sekunteina syntymäpäivälaskurin kera.",
    "home_h1": "Online Ikälaskuri",
    "home_sub": "Laske tarkka kronologinen ikäsi vuosina, kuukausina, päivinä, tunteina ja sekunteina gregoriaanisen kalenterin tarkkuudella."
  },
  "no": {
    "name": "Norwegian", "native": "Norsk bokmål", "dir": "ltr",
    "calc_name": "Beregne Alder", "calc_btn": "Beregn Alder", "years": "År", "months": "Måneder", "days": "Dager", "seconds": "Sekunder",
    "home_title": "Beregne Alder – Finn Din Nøyaktige Alder i År, Måneder og Dager",
    "home_desc": "Gratis online alderskalkulator. Beregn nøyaktig alder i år, måneder, dager og levende sekunder med bursdagsnedtelling.",
    "home_h1": "Online Alderskalkulator",
    "home_sub": "Beregn din nøyaktige kronologiske alder i år, måneder, dager, timer og sekunder med gregoriansk kalenderpresisjon."
  },
  "cs": {
    "name": "Czech", "native": "Čeština", "dir": "ltr",
    "calc_name": "Kalkulačka Věku", "calc_btn": "Spočítat Věk", "years": "Let", "months": "Měsíců", "days": "Dní", "seconds": "Sekund",
    "home_title": "Kalkulačka Věku – Vypočítejte Svůj Přesný Věk v Letech, Měsících a Dnech",
    "home_desc": "Bezplatná online kalkulačka věku. Spočítejte si přesný věk v letech, měsících, dnech a živých sekundách s odpočtem narozenin.",
    "home_h1": "Online Kalkulačka Věku",
    "home_sub": "Spočítejte si svůj přesný chronologický věk v letech, měsících, dnech, hodinách a sekundách s gregoriánskou přesností."
  },
  "el": {
    "name": "Greek", "native": "Ελληνικά", "dir": "ltr",
    "calc_name": "Υπολογισμός Ηλικίας", "calc_btn": "Υπολογισμός Ηλικίας", "years": "Έτη", "months": "Μήνες", "days": "Ημέρες", "seconds": "Δευτερόλεπτα",
    "home_title": "Υπολογισμός Ηλικίας – Βρείτε την Ακριβή Ηλικία σε Έτη, Μήνες & Ημέρες",
    "home_desc": "Δωρεάν online υπολογιστής ηλικίας. Υπολογίστε την ακριβή ηλικία σας σε έτη, μήνες, ημέρες και ζωντανά δευτερόλεπτα με αντίστροφη μέτρηση γενεθλίων.",
    "home_h1": "Online Υπολογισμός Ηλικίας",
    "home_sub": "Υπολογίστε την ακριβή χρονολογική ηλικία σας σε έτη, μήνες, ημέρες, ώρες και δευτερόλεπτα με ακρίβεια γρηγοριανού ημερολογίου."
  },
  "he": {
    "name": "Hebrew", "native": "עברית", "dir": "rtl",
    "calc_name": "מחשבון גיל", "calc_btn": "חשב גיל", "years": "שנים", "months": "חודשים", "days": "ימים", "seconds": "שניות",
    "home_title": "מחשבון גיל מדויק – חישוב גיל בשנים, חודשים וימים",
    "home_desc": "מחשבון גיל אונליין בחינם. חשב את הגיל המדויק שלך בשנים, חודשים, ימים ושניות חיות כולל ספירה לאחור ליום ההולדת.",
    "home_h1": "מחשבון גיל אונליין",
    "home_sub": "חשב את גילך הכרונולוגי המדויק בשנים, חודשים, ימים, שעות ושניות חיות בדיוק מלא של לוח השנה הגרגוריאני."
  },
  "fa": {
    "name": "Persian", "native": "فارسی", "dir": "rtl",
    "calc_name": "محاسبه سن", "calc_btn": "محاسبه سن", "years": "سال", "months": "ماه", "days": "روز", "seconds": "ثانیه",
    "home_title": "محاسبه سن دقیق آنلاین – محاسبه سن به سال، ماه و روز",
    "home_desc": "ماشین حساب آنلاین سن رایگان. محاسبه دقیق سن به سال، ماه، روز و ثانیه های زنده همراه با شمارش معکوس تولد بعدی.",
    "home_h1": "محاسبه سن دقیق آنلاین",
    "home_sub": "محاسبه دقیق سن شناسنامه ای به سال، ماه، روز، ساعت و ثانیه با دقت تقویم میلادی."
  },
  "ur": {
    "name": "Urdu", "native": "اردو", "dir": "rtl",
    "calc_name": "عمر کیلکولیٹر", "calc_btn": "عمر معلوم کریں", "years": "سال", "months": "مہینے", "days": "دن", "seconds": "سیکنڈ",
    "home_title": "عمر کیلکولیٹر – سال، مہینوں اور دنوں میں اپنی درست عمر معلوم کریں",
    "home_desc": "مفت آن لائن عمر کیلکولیٹر۔ سال، مہینے، دن اور لائیو سیکنڈز میں اپنی درست عمر اور سالگرہ کا کاؤنٹ ڈاؤن معلوم کریں۔",
    "home_h1": "آن لائن عمر کیلکولیٹر",
    "home_sub": "گریگورین کیلنڈر کی مکمل درستگی کے ساتھ سال، مہینوں، دنوں اور لائیو سیکنڈز میں اپنی اصل عمر کا حساب لگائیں۔"
  }
}

for code, info in LANGUAGES.items():
    lang_dict = json.loads(json.dumps(EN))
    
    # Customize per language
    lang_dict['meta']['homeTitle'] = info['home_title']
    lang_dict['meta']['homeDescription'] = info['home_desc']
    lang_dict['meta']['homeH1'] = info['home_h1']
    lang_dict['meta']['homeSubtitle'] = info['home_sub']
    
    lang_dict['navigation']['ageCalculator'] = info['calc_name']
    lang_dict['navigation']['calculateAge'] = info['calc_btn']
    lang_dict['navigation']['calculateMyAgeNow'] = info['calc_btn']
    
    lang_dict['calculator']['calculate'] = info['calc_btn']
    lang_dict['calculator']['years'] = info['years']
    lang_dict['calculator']['months'] = info['months']
    lang_dict['calculator']['days'] = info['days']
    lang_dict['calculator']['seconds'] = info['seconds']
    
    lang_dict['tools']['age-calculator']['title'] = info['calc_name']
    lang_dict['tools']['age-calculator']['desc'] = info['home_desc']
    
    # Save to both locales/ and src/locales/
    for dest_dir in [locales_dir, src_locales_dir]:
        dest_path = os.path.join(dest_dir, f"{code}.json")
        with open(dest_path, 'w', encoding='utf-8') as out_f:
            json.dump(lang_dict, out_f, ensure_ascii=False, indent=2)

print(f"Generated {len(LANGUAGES)} locale files in {locales_dir} and {src_locales_dir}")
