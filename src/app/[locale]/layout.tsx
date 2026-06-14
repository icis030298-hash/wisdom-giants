import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nanum_Myeongjo } from "next/font/google";
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

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKorean = locale === 'ko';
  const isGerman = locale === 'de';
  const isJapanese = locale === 'ja';
  const isSpanish = locale === 'es';
  const isFrench = locale === 'fr';
  const isItalian = locale === 'it';
  const isPortuguese = locale === 'pt';

  let title = 'Giants Wisdom | AI Historical Mentors & Wisdom Archive';
  let description = "Chat with 140+ history's greatest minds using AI. Answer 15 questions and find the historical giant you most resemble.";
  let keywords = 'AI Chat, Historical Figures, Wisdom, Mentorship, History, Philosophy, Education, Giants Wisdom';

  if (isKorean) {
    title = 'Giants Wisdom | AI 역사 위인 멘토';
    description = '역사를 바꾼 140여 명의 위인들과 AI로 대화하세요. 15가지 질문으로 나와 가장 닮은 역사 속 위인을 찾아보세요.';
    keywords = 'AI 챗, 역사 위인, 지혜, 멘토십, 역사, 철학, 교육, 거인들의 지혜, 위인 찾기';
  } else if (isGerman) {
    title = 'Giants Wisdom | KI Historische Mentoren & Weisheitsarchiv';
    description = 'Chatte mit 140+ der größten Köpfe der Geschichte per KI. Beantworte 15 Fragen und finde deinen historischen Zwilling.';
    keywords = 'KI Chat, Historische Persönlichkeiten, Weisheit, Geschichte, Philosophie, Giants Wisdom';
  } else if (isJapanese) {
    title = 'Giants Wisdom | AI歴史偉人メンター＆知恵アーカイブ';
    description = 'AIで歴史上の偉大な先人140人以上と対話しましょう。15の質問に答えて、あなたに最も似ている歴史上の偉人を見つけてください。';
    keywords = 'AIチャット, 歴史的人物, 知恵, メンターシップ, 歴史, 哲学, 教育, Giants Wisdom, 歴史の偉人';
  } else if (isSpanish) {
    title = 'Giants Wisdom | Mentores Históricos con IA';
    description = 'Conversa con más de 140 grandes figuras de la historia mediante IA. Descubre tu doble histórico con 15 preguntas y encuentra la figura histórica más parecida a ti.';
    keywords = 'Chat IA, Figuras Históricas, Sabiduría, Historia, Filosofía, Giants Wisdom';
  } else if (isFrench) {
    title = 'Giants Wisdom | Mentors Historiques IA';
    description = "Conversez avec plus de 140 grandes figures de l'histoire grâce à l'IA. Découvrez votre jumeau historique en 15 questions.";
    keywords = 'Chat IA, Figures Historiques, Sagesse, Histoire, Philosophie, Giants Wisdom';
  } else if (isItalian) {
    title = 'Giants Wisdom | Mentori Storici con IA';
    description = "Conversa con oltre 140 grandi figure della storia grazie all'IA. Scopri il tuo gemello storico in 15 domande.";
    keywords = 'Chat IA, Figure Storiche, Saggezza, Storia, Filosofia, Giants Wisdom, Italia';
  } else if (isPortuguese) {
    title = 'Giants Wisdom | Mentores Históricos com IA';
    description = 'Converse com mais de 140 grandes figuras da história com IA. Descubra seu gêmeo histórico em 15 perguntas.';
    keywords = 'Chat IA, Figuras Históricas, Sabedoria, História, Filosofia, Giants Wisdom, Brasil';
  }

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
      default: title,
      template: `%s | Giants Wisdom`
    },
    description,
    keywords,
    authors: [{ name: 'Giants Wisdom Team' }],

    openGraph: {
      title,
      description,
      type: 'website',
      images: [{
        url: 'https://www.giantswisdom.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Giants Wisdom - AI Historical Mentors & Wisdom Archive'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://www.giantswisdom.com/og-default.jpg'],
      title,
      description,
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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${playfair.variable} ${nanumMyeongjo.variable} bg-background scroll-smooth overflow-x-hidden`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
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
              strategy="beforeInteractive"
            />
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
