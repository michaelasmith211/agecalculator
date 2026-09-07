import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Cake,
  Users,
  CalendarRange,
  Calculator,
  Timer,
  Briefcase,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ALL_CALCULATORS } from '@/lib/constants';

interface RelatedCalculatorsProps {
  currentSlug?: string;
  title?: string;
  description?: string;
  limit?: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  '/age-calculator': <Calendar className="w-5 h-5 text-blue-600" />,
  '/birthday-calculator': <Cake className="w-5 h-5 text-pink-600" />,
  '/age-difference-calculator': <Users className="w-5 h-5 text-indigo-600" />,
  '/date-of-birth-calculator': <Calendar className="w-5 h-5 text-amber-600" />,
  '/days-between-dates': <CalendarRange className="w-5 h-5 text-teal-600" />,
  '/date-difference-calculator': <Clock className="w-5 h-5 text-violet-600" />,
  '/chronological-age-calculator': <Calculator className="w-5 h-5 text-cyan-600" />,
  '/retirement-age-calculator': <Briefcase className="w-5 h-5 text-orange-600" />,
  '/leap-year-age-calculator': <Sparkles className="w-5 h-5 text-emerald-600" />,
  '/birthday-countdown': <Timer className="w-5 h-5 text-purple-600" />
};

export default function RelatedCalculators({
  currentSlug,
  title = 'Explore Related Age & Date Calculators',
  description = 'Quickly switch to specialized calculators for birthdays, milestone ages, date durations, and interval counting.',
  limit = 6
}: RelatedCalculatorsProps) {
  const filtered = ALL_CALCULATORS.filter((calc) => calc.href !== currentSlug).slice(0, limit);

  return (
    <section className="mt-14 pt-10 border-t border-slate-200">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-slate-600">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((calc) => (
          <Link
            key={calc.href}
            href={`${calc.href}/`}
            className="group p-5 bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3.5 transition-colors">
                {ICON_MAP[calc.href] || <Calendar className="w-5 h-5 text-blue-600" />}
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base">
                {calc.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                {calc.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700 gap-1">
              <span>Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
