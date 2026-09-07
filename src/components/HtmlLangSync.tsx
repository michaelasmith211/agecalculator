'use client';

import { useEffect } from 'react';

interface HtmlLangSyncProps {
  locale: string;
  dir: 'ltr' | 'rtl';
}

export default function HtmlLangSync({ locale, dir }: HtmlLangSyncProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir]);

  return null;
}
