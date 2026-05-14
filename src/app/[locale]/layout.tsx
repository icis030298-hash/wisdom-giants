import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "../globals.css";
import Footer from "@/components/footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shoulders of Giants | AI Historical Mentors & Wisdom Archive',
  description: 'Converse with history\'s greatest minds. Get AI-powered advice from 40+ historical figures including Steve Jobs, Napoleon, and King Sejong. Explore their life stories and timeless wisdom.',
  keywords: 'AI Chat, Historical Figures, Wisdom, Mentorship, History, Philosophy, Education, Steve Jobs, Napoleon, King Sejong',
  authors: [{ name: 'Shoulders of Giants Team' }],
  openGraph: {
    title: 'Shoulders of Giants | AI Historical Mentors',
    description: 'A mystical journey through history. Converse with the greatest minds who shaped our world.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#020617',
  colorScheme: 'dark',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} bg-background scroll-smooth`}>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
