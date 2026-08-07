import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const metaMap: Record<string, { title: string; description: string }> = {
    ko: {
      title: '내 대화 목록',
      description: '과거의 지혜를 빌려 현재의 문제를 해결하세요. 역사 속 위인들과 나눈 대화 기록을 한눈에 확인하고 이어서 대화를 진행해 보세요.'
    },
    en: {
      title: 'My Conversations',
      description: 'View and resume your past conversations with historical giants and discover their wisdom.'
    },
    de: {
      title: 'Meine Gespräche',
      description: 'Sehen Sie Ihre Gespräche mit historischen Persönlichkeiten und führen Sie diese jederzeit fort.'
    },
    ja: {
      title: '私の会話',
      description: '過去の知恵を借りて現在の問題を解決しましょう。歴史上の偉人との会話記録を一覧で確認し、いつでも会話を再開できます。'
    },
    es: {
      title: 'Mis Conversaciones',
      description: 'Revisa y continúa tus conversaciones anteriores con las grandes figuras históricas del pasado.'
    },
    fr: {
      title: 'Mes Conversations',
      description: 'Consultez et reprenez vos conversations avec les grandes figures historiques du passé.'
    },
    it: {
      title: 'Le Mie Conversazioni',
      description: 'Visualizza e riprendi le tue conversazioni con le grandi figure storiche del passato.'
    },
    pt: {
      title: 'Minhas Conversas',
      description: 'Veja e retome suas conversas anteriores com as grandes figuras históricas do passado.'
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

export default async function ChatsLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metaMap: Record<string, { title: string; description: string }> = {
    ko: { title: '내 대화 목록', description: '과거의 지혜를 빌려 현재의 문제를 해결하세요. 역사 속 위인들과 나눈 대화 기록을 한눈에 확인하고 이어서 대화를 진행해 보세요.' },
    en: { title: 'My Conversations', description: 'View and resume your past conversations with historical giants and discover their wisdom.' },
    de: { title: 'Meine Gespräche', description: 'Sehen Sie Ihre Gespräche mit historischen Persönlichkeiten und führen Sie diese jederzeit fort.' },
    ja: { title: '私の会話', description: '過去の知恵を借りて現在の問題を解決しましょう。歴史上の偉人との会話記録を一覧で確認し、いつでも会話を再開できます。' },
    es: { title: 'Mis Conversaciones', description: 'Revisa y continúa tus conversaciones anteriores con las grandes figuras históricas del pasado.' },
    fr: { title: 'Mes Conversations', description: 'Consultez et reprenez vos conversations avec les grandes figures historiques du passé.' },
    it: { title: 'Le Mie Conversazioni', description: 'Visualizza e riprendi le tue conversazioni con le grandi figure storiche del passato.' },
    pt: { title: 'Minhas Conversas', description: 'Veja e retome suas conversas anteriores com as grandes figuras históricas do passado.' }
  }
  const meta = metaMap[locale] || metaMap['en'];
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${meta.title} | Giants Wisdom`,
    "description": meta.description,
    "url": `https://www.giantswisdom.com/${locale}/chats`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
