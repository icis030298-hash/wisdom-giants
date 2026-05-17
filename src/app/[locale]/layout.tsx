import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import Footer from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKorean = locale === 'ko';

  return {
    title: 'Giants Wisdom | AI Historical Mentors & Wisdom Archive',
    description: isKorean
      ? '역사를 바꾼 100인의 위인들과 AI로 대화하세요. 30가지 상황 질문으로 나의 유산 DNA를 분석하고 영혼의 단짝 위인을 찾아보세요.'
      : "Chat with 100+ history's greatest minds using AI. Discover your Heritage DNA through 30 situational questions and find your soul-matched historical giant.",
    keywords: 'AI Chat, Historical Figures, Wisdom, Mentorship, History, Philosophy, Education, Giants Wisdom',
    authors: [{ name: 'Giants Wisdom Team' }],
    openGraph: {
      title: 'Giants Wisdom | AI Historical Mentors',
      description: isKorean
        ? '역사를 바꾼 100인의 위인들과 AI로 대화하세요.'
        : "Chat with 100+ history's greatest minds using AI.",
      type: 'website',
    },
    other: {
      "google-adsense-account": "ca-pub-2081809442345110",
    },
  };
}

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
    <html lang={locale} className={`${playfair.variable} bg-background scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen">
            {process.env.NODE_ENV === 'production' && (
              <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2081809442345110"
                crossOrigin="anonymous"
                strategy="afterInteractive"
              />
            )}
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <CookieBanner />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
