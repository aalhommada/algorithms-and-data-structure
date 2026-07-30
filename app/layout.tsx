import './global.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';

// Self-hosted at build time — no request to Google at runtime.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL (host only, no protocol) at build
// time — it tracks the project's production domain, including a custom one once
// attached. The localhost fallback keeps `next dev`/`next start` working.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  // Without this, Next cannot turn the relative URLs below into the absolute
  // ones Open Graph and canonical tags require.
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | DSA Guide',
    default: 'Algorithms & Data Structures',
  },
  description:
    'Comprehensive guide to Algorithms and Data Structures with Python and TypeScript examples',
  keywords: [
    'algorithms',
    'data structures',
    'python',
    'typescript',
    'leetcode',
    'dsa',
    'programming',
  ],
  authors: [{ name: 'Abdullah Al Hommada', url: 'https://aalhommada.com' }],
  openGraph: {
    title: 'Algorithms & Data Structures Guide',
    description:
      'Master DSA with comprehensive explanations, visualizations, and code examples',
    type: 'website',
    siteName: 'DSA Guide',
    locale: 'en_US',
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: 'Algorithms & Data Structures Guide',
    description:
      'Master DSA with comprehensive explanations, visualizations, and code examples',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
