import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const metaMap: Record<string, { title: string; description: string }> = {
    ko: {
      title: '내 대화 목록 | Giants Wisdom',
      description: '역사 속 위인들과 나눈 대화를 확인하세요.'
    },
    en: {
      title: 'My Conversations | Giants Wisdom',
      description: 'View your conversations with historical giants.'
    },
    de: {
      title: 'Meine Gespräche | Giants Wisdom',
      description: 'Sehen Sie Ihre Gespräche mit historischen Persönlichkeiten.'
    },
    ja: {
      title: '私の会話 | Giants Wisdom',
      description: '歴史上の偉人との会話を確認しましょう。'
    },
    es: {
      title: 'Mis Conversaciones | Giants Wisdom',
      description: 'Ve tus conversaciones con figuras históricas.'
    },
    fr: {
      title: 'Mes Conversations | Giants Wisdom',
      description: 'Consultez vos conversations avec les grandes figures historiques.'
    },
    it: {
      title: 'Le Mie Conversazioni | Giants Wisdom',
      description: 'Visualizza le tue conversazioni con le figure storiche.'
    },
    pt: {
      title: 'Minhas Conversas | Giants Wisdom',
      description: 'Veja suas conversas com as grandes figuras históricas.'
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

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
