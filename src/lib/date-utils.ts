/**
 * Date and Age Calculation Engine
 * 100% Client-side, Timezone-safe, Calendar-accurate algorithms.
 */

export interface CalendarDate {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 31
}

export interface CalendarTime {
  hours: number;   // 0 - 23
  minutes: number; // 0 - 59
  seconds?: number; // 0 - 59
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  remainingDaysInWeek: number;
  totalMonthsApprox: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  dayOfWeekBorn: string;
  nextBirthdayDate: CalendarDate;
  nextBirthdayDayOfWeek: string;
  daysUntilNextBirthday: number;
  ageTurningNext: number;
  isBirthdayToday: boolean;
  zodiacSign: string;
  chineseZodiac: string;
  birthDateFormatted: string;
  targetDateFormatted: string;
  birthTimeFormatted?: string;
  targetTimeFormatted?: string;
  exactElapsedSeconds?: number;
}

export interface LifeStats {
  estimatedHeartbeats: number;
  estimatedBreaths: number;
  estimatedBlinks: number;
  estimatedHoursSlept: number;
  estimatedDaysSlept: number;
  sunOrbitProgressPercent: number;
  ageOnMercury: number;
  ageOnVenus: number;
  ageOnMars: number;
  ageOnJupiter: number;
}

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  remainingDays: number;
  businessDays: number;
  weekendDays: number;
  totalHours: number;
  isSameDay: boolean;
  isEndBeforeStart: boolean;
}

export interface ChronologicalAgeResult {
  chronologicalYears: number;
  chronologicalMonths: number;
  chronologicalDays: number;
  standardNotation: string; // e.g. "8;5;12" or "8y 5m 12d"
  totalDays: number;
  adjustedAge?: {
    years: number;
    months: number;
    days: number;
    standardNotation: string;
    weeksPremature: number;
  };
}

export interface ReverseDobResult {
  estimatedBirthDate: CalendarDate;
  formattedDate: string;
  dayOfWeek: string;
  notes: string;
}

export interface AgeDifferenceResult {
  olderPerson: 'A' | 'B' | 'same';
  differenceYears: number;
  differenceMonths: number;
  differenceDays: number;
  totalDaysDifference: number;
  totalWeeksDifference: number;
  summary: string;
}

export interface RetirementResult {
  retirementDate: CalendarDate;
  formattedRetirementDate: string;
  yearsRemaining: number;
  monthsRemaining: number;
  daysRemaining: number;
  totalDaysRemaining: number;
  workingDaysRemaining: number;
  isAlreadyRetired: boolean;
}

export interface LeapYearBirthdayInfo {
  isLeapYearBaby: boolean;
  calendarAge: number;
  leapYearAge: number; // Number of Feb 29ths lived
  nextFeb29Date: CalendarDate;
  daysUntilNextFeb29: number;
  pastCelebrations: { year: number; actualDate: string; milestoneAge: number }[];
  upcomingCelebrations: { year: number; actualDate: string; milestoneAge: number }[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Check if a given year is a leap year in the Gregorian calendar
 */
export function isLeapYear(year: number): boolean {
  if (year <= 0) return false;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get number of days in a given month and year
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

/**
 * Validate whether a year, month, and day form a valid calendar date
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  if (year < 1 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  const maxDays = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDays;
}

/**
 * Parse standard YYYY-MM-DD string into CalendarDate without timezone interference
 */
export function parseDateString(dateStr: string): CalendarDate | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (!isValidDate(year, month, day)) return null;
  return { year, month, day };
}

/**
 * Parse HH:MM string into CalendarTime
 */
export function parseTimeString(timeStr: string): CalendarTime | null {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return { hours, minutes, seconds: isNaN(seconds) ? 0 : seconds };
}

/**
 * Convert CalendarDate to standard YYYY-MM-DD string
 */
export function toDateString(date: CalendarDate): string {
  const y = String(date.year).padStart(4, '0');
  const m = String(date.month).padStart(2, '0');
  const d = String(date.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format CalendarTime to 12-hour or 24-hour string (e.g. "08:30 AM")
 */
export function formatDisplayTime(time: CalendarTime): string {
  const h = time.hours;
  const m = String(time.minutes).padStart(2, '0');
  const s = time.seconds !== undefined ? `:${String(time.seconds).padStart(2, '0')}` : '';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 === 0 ? 12 : h % 12;
  return `${displayHours}:${m}${s} ${ampm}`;
}

/**
 * Format CalendarDate to human-readable string (e.g. "September 2, 2026")
 */
export function formatDisplayDate(date: CalendarDate, includeWeekday = false): string {
  if (!isValidDate(date.year, date.month, date.day)) return 'Invalid Date';
  const monthName = MONTH_NAMES[date.month - 1];
  const dateStr = `${monthName} ${date.day}, ${date.year}`;
  if (includeWeekday) {
    const weekday = getDayOfWeek(date.year, date.month, date.day);
    return `${weekday}, ${dateStr}`;
  }
  return dateStr;
}

/**
 * Get current date in user's local timezone as a CalendarDate
 */
export function getTodayCalendarDate(): CalendarDate {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
}

/**
 * Get current system time as a CalendarTime
 */
export function getCurrentSystemTime(): CalendarTime {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  };
}

/**
 * Get Day of Week for a CalendarDate (Sunday = 0, ..., Saturday = 6)
 */
export function getDayOfWeekIndex(year: number, month: number, day: number): number {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCDay();
}

export function getDayOfWeek(year: number, month: number, day: number): string {
  return DAY_NAMES[getDayOfWeekIndex(year, month, day)];
}

/**
 * Compare two dates: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareDates(a: CalendarDate, b: CalendarDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/**
 * Convert CalendarDate to UTC timestamp in milliseconds (midnight UTC)
 */
export function toUtcTimestamp(date: CalendarDate, time?: CalendarTime): number {
  const hours = time?.hours || 0;
  const minutes = time?.minutes || 0;
  const seconds = time?.seconds || 0;
  return Date.UTC(date.year, date.month - 1, date.day, hours, minutes, seconds);
}

/**
 * Get absolute total days between two dates
 */
export function getDaysBetween(start: CalendarDate, end: CalendarDate): number {
  const t1 = toUtcTimestamp(start);
  const t2 = toUtcTimestamp(end);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((t2 - t1) / msPerDay);
}

/**
 * Zodiac Sign Calculation
 */
export function getZodiacSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
  return 'Pisces ♓';
}

/**
 * Chinese Zodiac calculation
 */
export function getChineseZodiac(year: number): string {
  const animals = [
    'Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍',
    'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'
  ];
  const baseYear = 1900;
  const index = ((year - baseYear) % 12 + 12) % 12;
  return animals[index];
}

/**
 * Interactive Life & Biology Statistics
 */
export function calculateLifeStats(totalSeconds: number, daysUntilNextBirthday: number): LifeStats {
  const totalDays = totalSeconds / 86400;
  
  // Heartbeats: ~80 beats per minute average
  const estimatedHeartbeats = Math.round(totalSeconds * (80 / 60));
  // Breaths: ~16 breaths per minute average
  const estimatedBreaths = Math.round(totalSeconds * (16 / 60));
  // Blinks: ~17 blinks per minute average
  const estimatedBlinks = Math.round(totalSeconds * (17 / 60));
  // Sleep: ~8 hours per day (1/3 of life)
  const estimatedHoursSlept = Math.round(totalDays * 8);
  const estimatedDaysSlept = Math.round(totalDays / 3);

  // Solar progress percentage through the current age year
  const daysInYear = 365.2422;
  const daysElapsedInYear = Math.max(0, daysInYear - daysUntilNextBirthday);
  const sunOrbitProgressPercent = Math.min(100, Math.max(0, parseFloat(((daysElapsedInYear / daysInYear) * 100).toFixed(1))));

  // Planetary ages
  const ageOnMercury = parseFloat((totalDays / 87.97).toFixed(2));
  const ageOnVenus = parseFloat((totalDays / 224.7).toFixed(2));
  const ageOnMars = parseFloat((totalDays / 686.98).toFixed(2));
  const ageOnJupiter = parseFloat((totalDays / 4332.59).toFixed(2));

  return {
    estimatedHeartbeats,
    estimatedBreaths,
    estimatedBlinks,
    estimatedHoursSlept,
    estimatedDaysSlept,
    sunOrbitProgressPercent,
    ageOnMercury,
    ageOnVenus,
    ageOnMars,
    ageOnJupiter
  };
}

/**
 * CORE AGE CALCULATION
 * Accurate calendar calculation with month/day/time borrowing.
 */
export function calculateAge(
  birthDate: CalendarDate,
  targetDate: CalendarDate,
  birthTime?: CalendarTime,
  targetTime?: CalendarTime
): AgeResult {
  if (!isValidDate(birthDate.year, birthDate.month, birthDate.day)) {
    throw new Error('Invalid birth date.');
  }
  if (!isValidDate(targetDate.year, targetDate.month, targetDate.day)) {
    throw new Error('Invalid target date.');
  }
  if (compareDates(targetDate, birthDate) < 0) {
    throw new Error('Target date cannot be earlier than birth date.');
  }

  let years = targetDate.year - birthDate.year;
  let months = targetDate.month - birthDate.month;
  let days = targetDate.day - birthDate.day;

  // Handle Day Borrowing
  if (days < 0) {
    months -= 1;
    let prevMonth = targetDate.month - 1;
    let prevYear = targetDate.year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    days += daysInPrevMonth;
  }

  // Handle Month Borrowing
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total Days lived
  const totalDays = getDaysBetween(birthDate, targetDate);
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysInWeek = totalDays % 7;
  const totalMonthsApprox = parseFloat((years * 12 + months + days / 30.4375).toFixed(1));

  // Base date calculations
  let totalHours = totalDays * 24;
  let totalMinutes = totalHours * 60;
  let totalSeconds = totalMinutes * 60;

  // If time was specified, adjust total seconds, minutes, and hours
  if (birthTime && targetTime) {
    const birthSecs = birthTime.hours * 3600 + birthTime.minutes * 60 + (birthTime.seconds || 0);
    const targetSecs = targetTime.hours * 3600 + targetTime.minutes * 60 + (targetTime.seconds || 0);
    const timeDeltaSecs = targetSecs - birthSecs;
    totalSeconds = Math.max(0, totalDays * 86400 + timeDeltaSecs);
    totalMinutes = Math.floor(totalSeconds / 60);
    totalHours = Math.floor(totalSeconds / 3600);
  }

  const dayOfWeekBorn = getDayOfWeek(birthDate.year, birthDate.month, birthDate.day);

  // Next Birthday Calculation
  const bDayInTargetYearMonth = birthDate.month;
  let bDayInTargetYearDay = birthDate.day;

  if (birthDate.month === 2 && birthDate.day === 29 && !isLeapYear(targetDate.year)) {
    bDayInTargetYearDay = 28;
  }

  const bDayThisYear: CalendarDate = {
    year: targetDate.year,
    month: bDayInTargetYearMonth,
    day: bDayInTargetYearDay
  };

  const comp = compareDates(bDayThisYear, targetDate);
  let nextBirthdayYear = targetDate.year;
  let isBirthdayToday = false;

  if (comp === 0) {
    isBirthdayToday = true;
    nextBirthdayYear = targetDate.year;
  } else if (comp < 0) {
    nextBirthdayYear = targetDate.year + 1;
  }

  const nextBirthdayMonth = birthDate.month;
  let nextBirthdayDay = birthDate.day;
  if (birthDate.month === 2 && birthDate.day === 29 && !isLeapYear(nextBirthdayYear)) {
    nextBirthdayDay = 28;
  }

  const nextBirthdayDate: CalendarDate = {
    year: nextBirthdayYear,
    month: nextBirthdayMonth,
    day: nextBirthdayDay
  };

  const daysUntilNextBirthday = isBirthdayToday ? 0 : getDaysBetween(targetDate, nextBirthdayDate);
  const nextBirthdayDayOfWeek = getDayOfWeek(nextBirthdayDate.year, nextBirthdayDate.month, nextBirthdayDate.day);
  const ageTurningNext = isBirthdayToday ? years : years + 1;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingDaysInWeek,
    totalMonthsApprox,
    totalHours,
    totalMinutes,
    totalSeconds,
    dayOfWeekBorn,
    nextBirthdayDate,
    nextBirthdayDayOfWeek,
    daysUntilNextBirthday,
    ageTurningNext,
    isBirthdayToday,
    zodiacSign: getZodiacSign(birthDate.month, birthDate.day),
    chineseZodiac: getChineseZodiac(birthDate.year),
    birthDateFormatted: formatDisplayDate(birthDate),
    targetDateFormatted: formatDisplayDate(targetDate),
    birthTimeFormatted: birthTime ? formatDisplayTime(birthTime) : undefined,
    targetTimeFormatted: targetTime ? formatDisplayTime(targetTime) : undefined,
    exactElapsedSeconds: totalSeconds
  };
}

/**
 * CALCULATE DATE OF BIRTH FROM AGE (REVERSE CALCULATOR)
 */
export function calculateDateOfBirthFromAge(
  ageYears: number,
  ageMonths: number,
  ageDays: number,
  asOfDate: CalendarDate
): ReverseDobResult {
  if (ageYears < 0 || ageMonths < 0 || ageDays < 0) {
    throw new Error('Age values cannot be negative.');
  }
  if (!isValidDate(asOfDate.year, asOfDate.month, asOfDate.day)) {
    throw new Error('Invalid as-of date.');
  }

  let birthYear = asOfDate.year - ageYears;
  let birthMonth = asOfDate.month - ageMonths;
  let birthDay = asOfDate.day - ageDays;

  // Month adjustment
  while (birthMonth <= 0) {
    birthMonth += 12;
    birthYear -= 1;
  }

  // Day adjustment
  while (birthDay <= 0) {
    birthMonth -= 1;
    if (birthMonth <= 0) {
      birthMonth += 12;
      birthYear -= 1;
    }
    const daysInMonth = getDaysInMonth(birthYear, birthMonth);
    birthDay += daysInMonth;
  }

  const maxDays = getDaysInMonth(birthYear, birthMonth);
  if (birthDay > maxDays) {
    birthDay = maxDays;
  }

  const estimatedBirthDate: CalendarDate = {
    year: birthYear,
    month: birthMonth,
    day: birthDay
  };

  const formattedDate = formatDisplayDate(estimatedBirthDate);
  const dayOfWeek = getDayOfWeek(birthYear, birthMonth, birthDay);

  return {
    estimatedBirthDate,
    formattedDate,
    dayOfWeek,
    notes: 'Calculated using standard calendar month borrowing. Due to varying month lengths (28–31 days), results may vary slightly depending on calendar conventions.'
  };
}

/**
 * CALCULATE AGE DIFFERENCE BETWEEN PERSON A AND PERSON B
 */
export function calculateAgeDifference(dobA: CalendarDate, dobB: CalendarDate): AgeDifferenceResult {
  const comp = compareDates(dobA, dobB);
  if (comp === 0) {
    return {
      olderPerson: 'same',
      differenceYears: 0,
      differenceMonths: 0,
      differenceDays: 0,
      totalDaysDifference: 0,
      totalWeeksDifference: 0,
      summary: 'Both persons were born on the exact same date.'
    };
  }

  const earlier = comp < 0 ? dobA : dobB;
  const later = comp < 0 ? dobB : dobA;
  const olderPerson = comp < 0 ? 'A' : 'B';

  const ageDiff = calculateAge(earlier, later);
  const totalDays = getDaysBetween(earlier, later);
  const totalWeeks = Math.floor(totalDays / 7);

  const olderLabel = olderPerson === 'A' ? 'Person A' : 'Person B';
  const youngerLabel = olderPerson === 'A' ? 'Person B' : 'Person A';

  const summary = `${olderLabel} is older than ${youngerLabel} by ${ageDiff.years} year${ageDiff.years === 1 ? '' : 's'}, ${ageDiff.months} month${ageDiff.months === 1 ? '' : 's'}, and ${ageDiff.days} day${ageDiff.days === 1 ? '' : 's'} (${totalDays.toLocaleString()} total days).`;

  return {
    olderPerson,
    differenceYears: ageDiff.years,
    differenceMonths: ageDiff.months,
    differenceDays: ageDiff.days,
    totalDaysDifference: totalDays,
    totalWeeksDifference: totalWeeks,
    summary
  };
}

/**
 * CALCULATE DAYS AND BUSINESS DAYS BETWEEN TWO DATES
 */
export function calculateDaysBetweenDates(
  start: CalendarDate,
  end: CalendarDate,
  inclusive = false
): DateDifferenceResult {
  const comp = compareDates(start, end);
  const isSameDay = comp === 0;
  const isEndBeforeStart = comp > 0;

  const actualStart = isEndBeforeStart ? end : start;
  const actualEnd = isEndBeforeStart ? start : end;

  let totalDays = getDaysBetween(actualStart, actualEnd);
  if (inclusive) {
    totalDays += 1;
  }

  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const totalHours = totalDays * 24;

  let businessDays = 0;
  let weekendDays = 0;

  const loopCount = totalDays;
  const startDateObj = new Date(Date.UTC(actualStart.year, actualStart.month - 1, actualStart.day));
  for (let i = 0; i < loopCount; i++) {
    const curDate = new Date(startDateObj.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = curDate.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
  }

  let ageCalc = { years: 0, months: 0, days: 0 };
  try {
    const res = calculateAge(actualStart, actualEnd);
    ageCalc = { years: res.years, months: res.months, days: res.days };
  } catch {
    // Same day
  }

  return {
    years: ageCalc.years,
    months: ageCalc.months,
    days: ageCalc.days,
    totalDays,
    totalWeeks,
    remainingDays,
    businessDays,
    weekendDays,
    totalHours,
    isSameDay,
    isEndBeforeStart
  };
}

/**
 * CHRONOLOGICAL AGE (CLINICAL / ACADEMIC TESTING FORMAT)
 */
export function calculateChronologicalAge(
  birthDate: CalendarDate,
  testDate: CalendarDate,
  weeksPremature = 0
): ChronologicalAgeResult {
  const age = calculateAge(birthDate, testDate);
  const standardNotation = `${age.years};${age.months};${age.days}`;

  let adjustedAge: ChronologicalAgeResult['adjustedAge'] = undefined;

  if (weeksPremature > 0) {
    const prematureDays = Math.round(weeksPremature * 7);
    let adjDays = age.days - (prematureDays % 30);
    let adjMonths = age.months - Math.floor(prematureDays / 30);
    let adjYears = age.years;

    if (adjDays < 0) {
      adjMonths -= 1;
      adjDays += 30;
    }
    if (adjMonths < 0) {
      adjYears -= 1;
      adjMonths += 12;
    }

    if (adjYears >= 0) {
      adjustedAge = {
        years: adjYears,
        months: adjMonths,
        days: adjDays,
        standardNotation: `${adjYears};${adjMonths};${adjDays}`,
        weeksPremature
      };
    }
  }

  return {
    chronologicalYears: age.years,
    chronologicalMonths: age.months,
    chronologicalDays: age.days,
    standardNotation,
    totalDays: age.totalDays,
    adjustedAge
  };
}

/**
 * RETIREMENT AGE CALCULATOR
 */
export function calculateRetirement(
  birthDate: CalendarDate,
  retirementAgeYears: number,
  asOfDate: CalendarDate = getTodayCalendarDate()
): RetirementResult {
  const retirementYear = birthDate.year + retirementAgeYears;
  const retirementDate: CalendarDate = {
    year: retirementYear,
    month: birthDate.month,
    day: birthDate.day
  };

  const comp = compareDates(retirementDate, asOfDate);
  const isAlreadyRetired = comp <= 0;

  if (isAlreadyRetired) {
    return {
      retirementDate,
      formattedRetirementDate: formatDisplayDate(retirementDate),
      yearsRemaining: 0,
      monthsRemaining: 0,
      daysRemaining: 0,
      totalDaysRemaining: 0,
      workingDaysRemaining: 0,
      isAlreadyRetired: true
    };
  }

  const remainingAge = calculateAge(asOfDate, retirementDate);
  const totalDays = getDaysBetween(asOfDate, retirementDate);
  const workingDays = Math.round(totalDays * (5 / 7));

  return {
    retirementDate,
    formattedRetirementDate: formatDisplayDate(retirementDate),
    yearsRemaining: remainingAge.years,
    monthsRemaining: remainingAge.months,
    daysRemaining: remainingAge.days,
    totalDaysRemaining: totalDays,
    workingDaysRemaining: workingDays,
    isAlreadyRetired: false
  };
}

/**
 * LEAP YEAR BIRTHDAY CALCULATOR
 */
export function calculateLeapYearInfo(
  birthDate: CalendarDate,
  asOfDate: CalendarDate = getTodayCalendarDate()
): LeapYearBirthdayInfo {
  const isLeapBaby = birthDate.month === 2 && birthDate.day === 29;
  const calendarAge = calculateAge(birthDate, asOfDate).years;

  let leapCount = 0;
  const pastCelebrations: LeapYearBirthdayInfo['pastCelebrations'] = [];
  const upcomingCelebrations: LeapYearBirthdayInfo['upcomingCelebrations'] = [];

  for (let y = birthDate.year + 1; y <= asOfDate.year; y++) {
    if (isLeapYear(y)) {
      leapCount++;
      pastCelebrations.push({
        year: y,
        actualDate: `February 29, ${y}`,
        milestoneAge: y - birthDate.year
      });
    }
  }

  let nextFeb29Year = asOfDate.year;
  while (true) {
    if (nextFeb29Year > asOfDate.year && isLeapYear(nextFeb29Year)) {
      break;
    }
    if (nextFeb29Year === asOfDate.year && isLeapYear(nextFeb29Year)) {
      const thisYearFeb29: CalendarDate = { year: nextFeb29Year, month: 2, day: 29 };
      if (compareDates(thisYearFeb29, asOfDate) > 0) {
        break;
      }
    }
    nextFeb29Year++;
  }

  const nextFeb29Date: CalendarDate = { year: nextFeb29Year, month: 2, day: 29 };
  const daysUntilNextFeb29 = getDaysBetween(asOfDate, nextFeb29Date);

  for (let y = nextFeb29Year; y <= nextFeb29Year + 20; y++) {
    if (isLeapYear(y)) {
      upcomingCelebrations.push({
        year: y,
        actualDate: `February 29, ${y}`,
        milestoneAge: y - birthDate.year
      });
    }
  }

  return {
    isLeapYearBaby: isLeapBaby,
    calendarAge,
    leapYearAge: leapCount,
    nextFeb29Date,
    daysUntilNextFeb29,
    pastCelebrations,
    upcomingCelebrations
  };
}
