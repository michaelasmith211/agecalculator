import type { NextConfig } from 'next';

// Note: For Next.js static exports ('output: export'), server redirects/headers are not executed at runtime.
// HTTPS enforcement and security headers are handled via:
// 1. GitHub Pages "Enforce HTTPS" setting (Settings > Pages > Custom domain)
// 2. CSP 'upgrade-insecure-requests' and client-side upgrade script in src/app/layout.tsx
// 3. public/_headers, public/_redirects, and public/.htaccess for edge/CDN layers
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
