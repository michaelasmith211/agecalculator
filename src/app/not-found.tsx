import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, Cake, Users, Home, AlertCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found (404) – Age Calculator',
  description: 'The requested page could not be found. Return to our popular age and birthday calculation tools.',
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wider mb-2">
        Error 404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>

      <p className="mt-3 text-base text-slate-600 max-w-md mx-auto leading-relaxed">
        The page you are looking for may have been moved, renamed, or is temporarily unavailable.
      </p>

      <div className="mt-10 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <Link
          href="/"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xs transition-all group flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Homepage</div>
            <div className="text-xs text-slate-500">Go to main page</div>
          </div>
        </Link>

        <Link
          href="/age-calculator"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xs transition-all group flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Age Calculator</div>
            <div className="text-xs text-slate-500">Calculate exact age</div>
          </div>
        </Link>

        <Link
          href="/birthday-calculator"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-pink-300 hover:shadow-xs transition-all group flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Birthday Calculator</div>
            <div className="text-xs text-slate-500">Find next birthday</div>
          </div>
        </Link>

        <Link
          href="/age-difference-calculator"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all group flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Age Difference</div>
            <div className="text-xs text-slate-500">Compare two people</div>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
