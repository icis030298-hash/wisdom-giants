import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nanum_Myeongjo, Noto_Sans_KR, Noto_Sans_Devanagari } from "next/font/google";
import Script from "next/script";
import { LazyMotion, domAnimation } from "framer-motion";
import "../globals.css";
import Footer from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

const notoSans = Noto_Sans_KR({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '700'],
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'brand'
  });

  const keywordsMap: Record<string, string> = {
    ko: 'AI 챗, 역사 위인, 지혜, 멘토십, 역사, 철학, 교육, 거인들의 지혜, 거인의 어깨, 위인 찾기',
    en: 'AI Chat, Historical Figures, Wisdom, Mentorship, History, Philosophy, Education, Giants Wisdom, Shoulders of Giants',
    de: 'KI Chat, Historische Persönlichkeiten, Weisheit, Geschichte, Philosophie, Giants Wisdom, Auf den Schultern der Riesen',
    ja: 'AIチャット, 歴史的人物, 知恵, メンターシップ, 歴史, 哲学, 教育, Giants Wisdom, 巨인의 어깨, 歴史の偉人',
    es: 'Chat IA, Figuras Históricas, Sabiduría, Historia, Filosofía, Giants Wisdom, Hombros de Gigantes',
    fr: 'Chat IA, Figures Historiques, Sagesse, Histoire, Philosophie, Giants Wisdom, Sur les Épaules des Géants',
    it: 'Chat IA, Figure Storiche, Saggezza, Storia, Filosofia, Giants Wisdom, Sulle Spalle dei Giganti',
    pt: 'Chat IA, Figuras Históricas, Sabedoria, História, Filosofia, Giants Wisdom, Nos Ombros dos Gigantes'
  };

  const keywords = keywordsMap[locale] || keywordsMap['en'];

  return {
    metadataBase: new URL('https://www.giantswisdom.com'),
    alternates: {
      canonical: locale === 'ko' ? '/' : `/${locale}`,
      languages: {
        'ko-KR': '/ko',
        'en-US': '/en',
        'de-DE': '/de',
        'ja-JP': '/ja',
        'es-ES': '/es',
        'fr-FR': '/fr',
        'it-IT': '/it',
        'pt-BR': '/pt',
        'ar-SA': '/ar',
        'hi-IN': '/hi',
        'ru-RU': '/ru',
        'zh-CN': '/zh',
        'x-default': '/'
      }
    },
    title: {
      default: t('metaTitle'),
      template: `%s | ${t('mainTitle')}`
    },
    description: t('metaDescription'),
    keywords,
    authors: [{ name: 'Giants Wisdom Team' }],

    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      siteName: t('mainTitle'),
      type: 'website',
      locale: locale,
      images: [{
        url: 'https://www.giantswisdom.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: `${t('mainTitle')} - AI Historical Mentors & Wisdom Archive`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@GiantsWisdom',
      creator: '@GiantsWisdom',
      images: ['https://www.giantswisdom.com/og-default.jpg'],
      title: t('metaTitle'),
      description: t('metaDescription'),
    },

    verification: {
      other: {
        'naver-site-verification': '967c249957c0ad91791c0e80631c8bc40ced1ed7',
      }
    },
    other: {
      "google-adsense-account": "ca-pub-2081809442345110",
    },
    icons: {
      icon: '/icon.svg',
      apple: '/icon.svg',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#020617',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
    <html lang={locale} dir={['ar', 'fa', 'he'].includes(locale) ? 'rtl' : 'ltr'} className={`${playfair.variable} ${nanumMyeongjo.variable} ${notoSans.variable} ${notoSansDevanagari.variable} bg-background scroll-smooth overflow-x-hidden`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* Google AdSense Auto Ads Setup */}
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2081809442345110"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            {/* Google Analytics 4 Setup */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-MKP0G1YD64"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-MKP0G1YD64', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
            {/* Kakao SDK Setup */}
            <Script
              src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
              integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <div className="flex-grow">
              <LazyMotion features={domAnimation}>
                {children}
              </LazyMotion>
            </div>
            <Footer />
            <CookieBanner />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
