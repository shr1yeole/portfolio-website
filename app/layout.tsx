import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shravan Yeole | Creative Developer & Motion Designer',
  description: 'Portfolio of Shravan Yeole — Creative Developer, Graphic Designer, Motion Graphics Artist & Video Editor. Building digital experiences through creativity and technology.',
  keywords: [
    'Shravan Yeole',
    'Creative Developer',
    'Graphic Designer',
    'Motion Graphics Artist',
    'Video Editor',
    'Flutter Developer',
    'Frontend Developer',
    'Pune',
    'India',
    'Brand Identity',
    'Social Media Creatives',
    'Meta Ads',
    'WordPress',
  ],
  authors: [{ name: 'Shravan Yeole' }],
  creator: 'Shravan Yeole',
  openGraph: {
    title: 'Shravan Yeole | Creative Developer & Motion Designer',
    description: 'Portfolio of Shravan Yeole — Creative Developer, Graphic Designer, Motion Graphics Artist & Video Editor from Pune, India.',
    url: 'https://shravan.dev',
    siteName: 'Shravan Yeole Portfolio',
    images: [
      {
        url: 'https://res.cloudinary.com/your-cloud-name/image/upload/q_auto,f_auto/portfolio/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Shravan Yeole Creative Portfolio Cover',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shravan Yeole | Creative Developer & Motion Designer',
    description: 'Creative Developer, Graphic Designer, Motion Graphics Artist & Video Editor from Pune, India.',
    images: ['https://res.cloudinary.com/your-cloud-name/image/upload/q_auto,f_auto/portfolio/og-cover.jpg'],
    creator: '@shravan_yeole',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans select-none">
        {children}
      </body>
    </html>
  );
}
