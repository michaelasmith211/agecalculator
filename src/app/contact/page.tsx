'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: 'Company', href: '/' },
          { name: 'Contact', href: '/contact' }
        ]}
      />

      <div className="max-w-2xl mx-auto mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            We value your feedback, feature suggestions, and questions about our date calculation algorithms.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-emerald-950">Thank You for Reaching Out!</h2>
            <p className="text-sm text-emerald-800">
              Your message has been received. Our team will review your feedback and get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="c-name" className="block text-sm font-bold text-slate-800 mb-1">
                Your Name
              </label>
              <input
                id="c-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl text-slate-900 font-medium text-sm transition-all"
              />
            </div>

            <div>
              <label htmlFor="c-email" className="block text-sm font-bold text-slate-800 mb-1">
                Your Email Address
              </label>
              <input
                id="c-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl text-slate-900 font-medium text-sm transition-all"
              />
            </div>

            <div>
              <label htmlFor="c-msg" className="block text-sm font-bold text-slate-800 mb-1">
                Message / Feedback
              </label>
              <textarea
                id="c-msg"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or bug reports..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl text-slate-900 font-medium text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all text-base"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
