'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  resultText?: string;
  className?: string;
}

export default function SocialShare({
  title = 'Age Calculator – Calculate Your Exact Age',
  description = 'Fast, accurate, and free online Age Calculator in years, months, and days.',
  url,
  resultText,
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? url ? `${SITE_CONFIG.domain}${url}` : window.location.href
    : `${SITE_CONFIG.domain}${url || '/'}`;

  const defaultText = resultText
    ? `${resultText} — Calculated on ${SITE_CONFIG.name}`
    : `${title}: ${description}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(defaultText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${defaultText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: defaultText,
          url: shareUrl
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Share This Tool or Result
            </div>
            <p className="text-[11px] text-slate-500">
              Help friends and family calculate their exact age & milestone countdowns
            </p>
          </div>
        </div>

        {/* Native Web Share Button (Mobile-First) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via Apps</span>
          </button>
        )}
      </div>

      {/* Social Icons Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 transition-colors"
          aria-label="Share on X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X / Twitter</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
          aria-label="Share on Facebook"
        >
          <svg className="w-3.5 h-3.5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
          <span>LinkedIn</span>
        </a>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors ml-auto cursor-pointer"
          aria-label="Copy URL link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
