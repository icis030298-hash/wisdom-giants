import { buildSEOAlternates, isLocaleIndexed } from "@/config/locale-status";
import { giantsData } from "@/data/giants";
import type { Metadata, Viewport } from "next";
import { notoSansDevanagari } from "../fonts";
import Script from "next/script";
import { LazyMotion, domAnimation } from "framer-motion";
import "../globals.css";
import Footer from "@/components/footer";
import { CookieBanner, ConsentScripts } from "@/components/cookie-banner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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
    robots: { index: isLocaleIndexed(locale), follow: isLocaleIndexed(locale) },
    metadataBase: new URL('https://www.giantswisdom.com'),
    alternates: buildSEOAlternates('/', locale),
    // Sub-page titles carry the brand, not the localized phrase: they read
    // better short, and the localized keyword is already covered by keywords
    // below and by the home <title>.
    title: {
      default: t('metaTitle'),
      template: '%s | Giants Wisdom'
    },
    description: t('metaDescription', { count: giantsData.length }),
    keywords,
    authors: [{ name: 'Giants Wisdom Team' }],

    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription', { count: giantsData.length }),
      // siteName is the site attribution a social card prints above the
      // thumbnail, not a page title. Localizing it would make one site look
      // like 24 different ones to Kakao, Facebook and LinkedIn.
      siteName: 'Giants Wisdom',
      type: 'website',
      locale: locale,
      images: [{
        url: 'https://www.giantswisdom.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: `Giants Wisdom — ${t('mainTitle')}`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@GiantsWisdom',
      creator: '@GiantsWisdom',
      images: ['https://www.giantswisdom.com/og-default.jpg'],
      title: t('metaTitle'),
      description: t('metaDescription', { count: giantsData.length }),
    },

    verification: {
      other: {
        'naver-site-verification': '967c249957c0ad91791c0e80631c8bc40ced1ed7',
      }
    },
    other: {
      "google-adsense-account": "ca-pub-2081809442345110",
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#FAF7F0',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
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
    <html lang={locale} dir={['ar', 'fa', 'he'].includes(locale) ? 'rtl' : 'ltr'} className={`${notoSansDevanagari.variable} motion-safe:scroll-smooth overflow-x-hidden`} suppressHydrationWarning>
      <head>
        {/* Pretendard arrived through an @import at the top of globals.css,
            which made the browser fetch globals.css, parse it, fetch the CDN
            stylesheet, parse that, and only then fetch the subset -- three
            serial round trips before the first glyph could be drawn in the
            right face. As a link here the stylesheet request starts alongside
            globals.css rather than after it, and the preconnect opens the CDN
            connection while that is in flight. Self-hosting would remove the
            third party altogether; that is a separate change. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
        />

        {/* Google Consent Mode v2 — gtag.js보다 먼저 동기 실행되어야 함 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;

              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });

              try {
                var c = JSON.parse(localStorage.getItem('giants_cookie_consent'));
                if (c) {
                  gtag('consent', 'update', {
                    analytics_storage: c.analytics ? 'granted' : 'denied',
                    ad_storage: c.advertising ? 'granted' : 'denied',
                    ad_user_data: c.advertising ? 'granted' : 'denied',
                    ad_personalization: c.advertising ? 'granted' : 'denied'
                  });
                }
              } catch (e) {}

              gtag('js', new Date());
              gtag('config', 'G-MKP0G1YD64');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen overflow-x-hidden">

            {/* Kakao SDK Setup */}
            <Script
              src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
              integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            {/* Google Analytics 4 — 항상 로드. 실제 계측 여부는 위 Consent Mode가 제어 */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-MKP0G1YD64"
              strategy="afterInteractive"
            />
            <div className="flex-grow">
              <LazyMotion features={domAnimation}>
                {children}
              </LazyMotion>
            </div>
            <ConsentScripts />
            <Footer />
            <CookieBanner />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
