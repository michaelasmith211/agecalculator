import React from 'react';
import { Calendar } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface ReferenceRow {
  birthYear: number;
  generation: string;
  ageBeforeBirthday: number;
  ageAfterBirthday: number;
  milestoneInYear: string;
}

export default function AgeReferenceTable() {
  const currentYear = SITE_CONFIG.currentYear; // 2026

  const sampleYears: ReferenceRow[] = [
    { birthYear: 2020, generation: 'Gen Alpha', ageBeforeBirthday: currentYear - 2020 - 1, ageAfterBirthday: currentYear - 2020, milestoneInYear: 'Early Childhood' },
    { birthYear: 2015, generation: 'Gen Alpha', ageBeforeBirthday: currentYear - 2015 - 1, ageAfterBirthday: currentYear - 2015, milestoneInYear: 'Pre-teen' },
    { birthYear: 2010, generation: 'Gen Z', ageBeforeBirthday: currentYear - 2010 - 1, ageAfterBirthday: currentYear - 2010, milestoneInYear: 'Teenager (16th)' },
    { birthYear: 2005, generation: 'Gen Z', ageBeforeBirthday: currentYear - 2005 - 1, ageAfterBirthday: currentYear - 2005, milestoneInYear: 'Young Adult (21st)' },
    { birthYear: 2000, generation: 'Gen Z / Millennial', ageBeforeBirthday: currentYear - 2000 - 1, ageAfterBirthday: currentYear - 2000, milestoneInYear: 'Mid-20s (26th)' },
    { birthYear: 1995, generation: 'Millennial', ageBeforeBirthday: currentYear - 1995 - 1, ageAfterBirthday: currentYear - 1995, milestoneInYear: 'Turning 31' },
    { birthYear: 1990, generation: 'Millennial', ageBeforeBirthday: currentYear - 1990 - 1, ageAfterBirthday: currentYear - 1990, milestoneInYear: 'Late 30s (36th)' },
    { birthYear: 1985, generation: 'Millennial', ageBeforeBirthday: currentYear - 1985 - 1, ageAfterBirthday: currentYear - 1985, milestoneInYear: 'Turning 41' },
    { birthYear: 1980, generation: 'Gen X', ageBeforeBirthday: currentYear - 1980 - 1, ageAfterBirthday: currentYear - 1980, milestoneInYear: 'Mid-40s (46th)' },
    { birthYear: 1975, generation: 'Gen X', ageBeforeBirthday: currentYear - 1975 - 1, ageAfterBirthday: currentYear - 1975, milestoneInYear: 'Turning 51' },
    { birthYear: 1970, generation: 'Gen X', ageBeforeBirthday: currentYear - 1970 - 1, ageAfterBirthday: currentYear - 1970, milestoneInYear: 'Late 50s (56th)' },
    { birthYear: 1965, generation: 'Gen X / Boomer', ageBeforeBirthday: currentYear - 1965 - 1, ageAfterBirthday: currentYear - 1965, milestoneInYear: 'Turning 61' },
    { birthYear: 1960, generation: 'Baby Boomer', ageBeforeBirthday: currentYear - 1960 - 1, ageAfterBirthday: currentYear - 1960, milestoneInYear: 'Senior / Retirement' },
    { birthYear: 1950, generation: 'Baby Boomer', ageBeforeBirthday: currentYear - 1950 - 1, ageAfterBirthday: currentYear - 1950, milestoneInYear: 'Golden Years (76th)' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs my-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Reference Chart</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Birth Year to Age in {currentYear} Lookup Table
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Exact age depends on whether your birthday has already occurred in {currentYear}.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">Birth Year</th>
              <th className="py-3 px-4">Generation</th>
              <th className="py-3 px-4">Before Birthday</th>
              <th className="py-3 px-4">After Birthday</th>
              <th className="py-3 px-4 rounded-r-lg">Milestone Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sampleYears.map((row) => (
              <tr key={row.birthYear} className="hover:bg-blue-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{row.birthYear}</td>
                <td className="py-3 px-4 text-slate-600">{row.generation}</td>
                <td className="py-3 px-4 text-slate-700 font-semibold">{row.ageBeforeBirthday} Years Old</td>
                <td className="py-3 px-4 text-blue-700 font-bold">{row.ageAfterBirthday} Years Old</td>
                <td className="py-3 px-4 text-slate-600 text-xs">{row.milestoneInYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>* Calculated in calendar year {currentYear}. Exact age varies according to day and month of birth.</span>
      </div>
    </div>
  );
}
