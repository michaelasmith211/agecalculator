export const SITE_CONFIG = {
  name: 'Age Calculator',
  domain: 'https://agecalculators.dev',
  tagline: 'Calculate Your Exact Age in Years, Months, and Days',
  description: 'Fast, accurate, and free online Age Calculator. Calculate your exact age, next birthday, total days lived, age differences, and date intervals instantly in your browser.',
  author: 'Age Calculator Team',
  twitterHandle: '@agecalculators',
  gaId: 'G-HT87NWEHNT',
  currentYear: 2026,
};

export interface NavItem {
  title: string;
  href: string;
  description: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Age Calculator',
    href: '/age-calculator',
    description: 'Calculate exact age in years, months, days, hours, and minutes.'
  },
  {
    title: 'Birthday',
    href: '/birthday-calculator',
    description: 'Find your next birthday, days countdown, and milestone ages.'
  },
  {
    title: 'Age Difference',
    href: '/age-difference-calculator',
    description: 'Calculate the exact age difference between two people.'
  },
  {
    title: 'Date Difference',
    href: '/date-difference-calculator',
    description: 'Find the duration and interval between any two dates.'
  },
  {
    title: 'Date of Birth',
    href: '/date-of-birth-calculator',
    description: 'Estimate your birth date from your current age.'
  }
];

export const ALL_CALCULATORS: NavItem[] = [
  {
    title: 'Age Calculator',
    href: '/age-calculator',
    description: 'Calculate exact age from date of birth with detailed breakdown in months, weeks, days, hours, and seconds.'
  },
  {
    title: 'Birthday Calculator',
    href: '/birthday-calculator',
    description: 'Discover your next birthday, day of week, days countdown, and future milestone birthdays.'
  },
  {
    title: 'Age Difference Calculator',
    href: '/age-difference-calculator',
    description: 'Compare two dates of birth to find the precise difference in years, months, and days.'
  },
  {
    title: 'Date of Birth Calculator',
    href: '/date-of-birth-calculator',
    description: 'Reverse calculator: determine your exact or approximate birth date from given age in years, months, and days.'
  },
  {
    title: 'Days Between Dates',
    href: '/days-between-dates',
    description: 'Calculate the total days, business days, and calendar span between two dates with inclusive/exclusive options.'
  },
  {
    title: 'Date Difference Calculator',
    href: '/date-difference-calculator',
    description: 'Comprehensive duration calculator between two points in time across various units.'
  },
  {
    title: 'Chronological Age Calculator',
    href: '/chronological-age-calculator',
    description: 'Standard clinical and academic chronological age calculator (YY;MM;DD) with premature birth adjustments.'
  },
  {
    title: 'Retirement Age Calculator',
    href: '/retirement-age-calculator',
    description: 'Estimate your retirement milestone date and calculate remaining years, months, and working days.'
  },
  {
    title: 'Leap Year Age Calculator',
    href: '/leap-year-age-calculator',
    description: 'Special calculator for February 29 leap day babies to track leap birthdays vs calendar years.'
  },
  {
    title: 'Birthday Countdown',
    href: '/birthday-countdown',
    description: 'Live real-time ticking countdown clock for upcoming birthdays and milestone celebrations.'
  }
];

export const RESOURCE_LINKS: NavItem[] = [
  {
    title: 'How to Calculate Age',
    href: '/how-to-calculate-age',
    description: 'Step-by-step mathematical guide to manual age calculation, leap years, and calendar borrowing rules.'
  },
  {
    title: 'Age Calculation Guide',
    href: '/how-to-calculate-age#guide',
    description: 'In-depth reference for calendar systems, Gregorian leap years, and timezone safety.'
  },
  {
    title: 'Frequently Asked Questions',
    href: '/#faq',
    description: 'Common questions and answers regarding age calculations and accuracy.'
  }
];

export const COMPANY_LINKS: NavItem[] = [
  {
    title: 'About Us',
    href: '/about',
    description: 'Learn about our precision-engineered, privacy-first date calculation utilities.'
  },
  {
    title: 'Contact',
    href: '/contact',
    description: 'Get in touch for feedback, suggestions, or questions.'
  },
  {
    title: 'Privacy Policy',
    href: '/privacy-policy',
    description: 'Our zero-data-collection, 100% client-side calculation privacy commitment.'
  },
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'Terms of use and calculation accuracy guidelines.'
  }
];
