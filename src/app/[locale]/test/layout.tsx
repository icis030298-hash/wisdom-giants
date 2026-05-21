import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const metaMap: Record<string, { title: string; description: string }> = {
    ko: {
      title: '나와 닮은 위인 찾기 | Giants Wisdom',
      description: '15가지 질문으로 나와 가장 닮은 역사 속 위인을 찾아보세요.'
    },
    en: {
      title: 'Find Your Historical Match | Giants Wisdom',
      description: 'Answer 15 questions to discover which historical giant resembles you most.'
    },
    de: {
      title: 'Finden Sie Ihren historischen Zwilling | Giants Wisdom',
      description: 'Beantworten Sie 15 Fragen und entdecken Sie Ihre historische Persönlichkeit.'
    },
    ja: {
      title: '歴史上の偉人を探す | Giants Wisdom',
      description: '15の質問に答えて、あなたに最も似た歴史上の偉人を見つけましょう。'
    },
    es: {
      title: 'Encuentra tu Gemelo Histórico | Giants Wisdom',
      description: 'Responde 15 preguntas y descubre qué figura histórica se parece más a ti.'
    },
    fr: {
      title: 'Trouvez Votre Jumeau Historique | Giants Wisdom',
      description: 'Répondez à 15 questions et découvrez votre personnage historique.'
    },
    it: {
      title: 'Trova il Tuo Gemello Storico | Giants Wisdom',
      description: 'Rispondi a 15 domande e scopri quale figura storica ti somiglia di più.'
    },
    pt: {
      title: 'Encontre Seu Gêmeo Histórico | Giants Wisdom',
      description: 'Responda 15 perguntas e descubra qual figura histórica mais se parece com você.'
    }
  }
  const { locale } = await params;
  const meta = metaMap[locale] || metaMap['en'];
  return {
    ...meta,
    openGraph: {
      ...meta,
    },
    twitter: {
      card: 'summary_large_image',
      ...meta,
    }
  };
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
