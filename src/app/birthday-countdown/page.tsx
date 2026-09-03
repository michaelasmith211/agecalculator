import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles, PartyPopper } from 'lucide-react';
import BirthdayCountdown from '@/components/calculators/BirthdayCountdown';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Birthday Countdown – Live Real-Time Birthday Countdown Clock',
  description:
    'Real-time live ticking countdown clock to your next birthday. Track exact days, hours, minutes, and seconds remaining until your next milestone celebration.',
  alternates: {
    canonical: '/birthday-countdown/'
  },
  openGraph: {
    title: 'Birthday Countdown Clock – Live Real-Time Timer',
    description: 'Real-time live ticking countdown clock to your next birthday with second-by-second countdown.',
    url: `${SITE_CONFIG.domain}/birthday-countdown/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Countdown – Live Ticking Clock',
    description: 'Track exact days, hours, minutes, and seconds remaining until your next milestone birthday.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How does the Live Birthday Countdown work?',
    answer:
      'The countdown measures the exact real-time duration in milliseconds between the current browser second and midnight (00:00:00) on your next birthday date, updating continuously at 60 frames per second.'
  },
  {
    question: 'Does the countdown adjust for time zones?',
    answer:
      'Yes. The countdown operates using your device’s local system clock and midnight boundary, ensuring an accurate countdown wherever you are in the world.'
  },
  {
    question: 'What happens on my birthday?',
    answer:
      'When your birthday arrives, the countdown triggers a celebration greeting wishing you a Happy Birthday and confirming the new age milestone you are celebrating!'
  },
  {
    question: 'Can I share my birthday countdown with friends and family?',
    answer:
      'Yes! Use the Social Share buttons below the countdown to share your personalized countdown milestone with friends across WhatsApp, X (Twitter), Facebook, or via direct link.'
  }
];

export default function BirthdayCountdownPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Birthday Countdown Clock"
        description="Live real-time ticking countdown timer to next birthday."
        url="/birthday-countdown/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Birthday Countdown', item: '/birthday-countdown/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Birthday Countdown', href: '/birthday-countdown/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Birthday Countdown Clock
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Real-time live ticking countdown clock: watch the seconds, minutes, hours, and days tick down until your next birthday.
            </p>
          </div>

          <BirthdayCountdown />

          <AdSlot slotId="bcount-mid" format="horizontal" />

          {/* Educational Content */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Anticipating Birthday Celebrations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Counting down to a birthday builds excitement for milestone celebrations, allows friends and families to plan surprise parties well in advance, and provides an instant visual metric of life’s precious moments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Real-Time Ticking</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Smooth 1-second interval refresh powered by your device’s hardware clock.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <PartyPopper className="w-4 h-4 text-pink-600" />
                  <span>Party Planning</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track exact weeks and days remaining to coordinate party invitations and bookings.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Birthday Greeting</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Celebration fireworks and birthday confirmation banner activate on the big day.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Want to see a calendar table of all milestone birthdays?</span>
              <Link
                href="/birthday-calculator/"
                className="font-bold text-purple-700 hover:text-purple-800 inline-flex items-center gap-1"
              >
                <span>Milestone Birthday Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Birthday Countdown – Live Ticking Clock"
            url="/birthday-countdown/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />

          {/* Related Tools Internal Linking Grid */}
          <RelatedCalculators currentSlug="/birthday-countdown" />
        </div>
      </div>
    </>
  );
}
