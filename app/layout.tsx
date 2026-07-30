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

export const metadata: Metadata = {
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
