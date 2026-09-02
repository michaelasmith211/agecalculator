import { describe, it, expect } from 'vitest';
import {
  isLeapYear,
  getDaysInMonth,
  isValidDate,
  parseDateString,
  calculateAge,
  calculateAgeDifference,
  calculateDateOfBirthFromAge,
  calculateDaysBetweenDates,
  calculateChronologicalAge,
  calculateRetirement,
  calculateLeapYearInfo
} from '../lib/date-utils';

describe('Date Utilities & Leap Year Engine', () => {
  it('correctly identifies leap years and common years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1600)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
  });

  it('correctly gets days in each month for leap and non-leap years', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
    expect(getDaysInMonth(2023, 2)).toBe(28);
    expect(getDaysInMonth(2024, 1)).toBe(31);
    expect(getDaysInMonth(2024, 4)).toBe(30);
  });

  it('validates dates properly and rejects invalid dates', () => {
    expect(isValidDate(2024, 2, 29)).toBe(true);
    expect(isValidDate(2023, 2, 29)).toBe(false);
    expect(isValidDate(2024, 4, 31)).toBe(false);
    expect(isValidDate(2024, 2, 30)).toBe(false);
    expect(isValidDate(2024, 13, 1)).toBe(false);
  });

  it('parses date strings safely', () => {
    expect(parseDateString('2000-01-15')).toEqual({ year: 2000, month: 1, day: 15 });
    expect(parseDateString('2023-02-29')).toBeNull();
    expect(parseDateString('invalid')).toBeNull();
  });
});

describe('Core Age Calculation Logic', () => {
  it('matches prompt exact example: Jan 15, 2000 on Sept 2, 2026 -> 26y 7m 18d', () => {
    const dob = { year: 2000, month: 1, day: 15 };
    const target = { year: 2026, month: 9, day: 2 };
    const res = calculateAge(dob, target);

    expect(res.years).toBe(26);
    expect(res.months).toBe(7);
    expect(res.days).toBe(18);
    expect(res.totalDays).toBe(9727);
  });

  it('handles same birth date and target date', () => {
    const dob = { year: 2020, month: 5, day: 10 };
    const target = { year: 2020, month: 5, day: 10 };
    const res = calculateAge(dob, target);

    expect(res.years).toBe(0);
    expect(res.months).toBe(0);
    expect(res.days).toBe(0);
    expect(res.totalDays).toBe(0);
    expect(res.isBirthdayToday).toBe(true);
  });

  it('handles birthday already passed this year', () => {
    const dob = { year: 1990, month: 3, day: 15 };
    const target = { year: 2026, month: 9, day: 2 };
    const res = calculateAge(dob, target);

    expect(res.years).toBe(36);
    expect(res.months).toBe(5);
    expect(res.days).toBe(18);
    expect(res.nextBirthdayDate.year).toBe(2027);
    expect(res.ageTurningNext).toBe(37);
  });

  it('handles birthday not yet reached this year', () => {
    const dob = { year: 1990, month: 11, day: 20 };
    const target = { year: 2026, month: 9, day: 2 };
    const res = calculateAge(dob, target);

    expect(res.years).toBe(35);
    expect(res.months).toBe(9);
    expect(res.days).toBe(13);
    expect(res.nextBirthdayDate.year).toBe(2026);
    expect(res.ageTurningNext).toBe(36);
  });

  it('handles month day borrowing with differing month lengths', () => {
    // Born March 31, target April 30
    const dob = { year: 2020, month: 3, day: 31 };
    const target = { year: 2020, month: 4, day: 30 };
    const res = calculateAge(dob, target);

    expect(res.years).toBe(0);
    expect(res.months).toBe(0);
    expect(res.days).toBe(30);
  });

  it('handles February 29 birthdays in leap and common years', () => {
    const dob = { year: 2000, month: 2, day: 29 };
    // Target on non-leap year Feb 28, 2025
    const target = { year: 2025, month: 2, day: 28 };
    const res = calculateAge(dob, target);
    expect(res.years).toBe(24);
    expect(res.months).toBe(11);
    expect(res.days).toBe(30);
  });

  it('throws error when target date is before birth date', () => {
    const dob = { year: 2026, month: 1, day: 1 };
    const target = { year: 2020, month: 1, day: 1 };
    expect(() => calculateAge(dob, target)).toThrow();
  });
});

describe('Age Difference Calculation', () => {
  it('matches prompt exact example: Person A Jan 1, 1990 & Person B June 15, 1995 -> 5y 5m 14d', () => {
    const dobA = { year: 1990, month: 1, day: 1 };
    const dobB = { year: 1995, month: 6, day: 15 };
    const res = calculateAgeDifference(dobA, dobB);

    expect(res.olderPerson).toBe('A');
    expect(res.differenceYears).toBe(5);
    expect(res.differenceMonths).toBe(5);
    expect(res.differenceDays).toBe(14);
  });
});

describe('Reverse Date of Birth Calculator', () => {
  it('reverses age correctly', () => {
    const asOf = { year: 2026, month: 9, day: 2 };
    const res = calculateDateOfBirthFromAge(26, 7, 18, asOf);
    expect(res.estimatedBirthDate).toEqual({ year: 2000, month: 1, day: 15 });
  });
});

describe('Days Between Dates Calculator', () => {
  it('calculates exact days and business days', () => {
    const start = { year: 2026, month: 9, day: 1 };
    const end = { year: 2026, month: 9, day: 8 };
    const exclusive = calculateDaysBetweenDates(start, end, false);
    expect(exclusive.totalDays).toBe(7);
    expect(exclusive.totalWeeks).toBe(1);

    const inclusive = calculateDaysBetweenDates(start, end, true);
    expect(inclusive.totalDays).toBe(8);
  });
});

describe('Chronological Age & Retirement Tools', () => {
  it('calculates chronological notation', () => {
    const dob = { year: 2015, month: 4, day: 10 };
    const testDate = { year: 2023, month: 9, day: 22 };
    const res = calculateChronologicalAge(dob, testDate);
    expect(res.standardNotation).toBe('8;5;12');
  });

  it('calculates retirement accurately', () => {
    const dob = { year: 1970, month: 5, day: 15 };
    const asOf = { year: 2026, month: 5, day: 15 };
    const res = calculateRetirement(dob, 65, asOf);
    expect(res.yearsRemaining).toBe(9);
    expect(res.isAlreadyRetired).toBe(false);
  });

  it('calculates leap year baby details', () => {
    const dob = { year: 2000, month: 2, day: 29 };
    const asOf = { year: 2026, month: 9, day: 2 };
    const res = calculateLeapYearInfo(dob, asOf);
    expect(res.isLeapYearBaby).toBe(true);
    expect(res.calendarAge).toBe(26);
    expect(res.leapYearAge).toBe(6); // 2004, 2008, 2012, 2016, 2020, 2024
    expect(res.nextFeb29Date).toEqual({ year: 2028, month: 2, day: 29 });
  });
});
