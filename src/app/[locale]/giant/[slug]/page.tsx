import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { giants } from "@/lib/giants-data";
import { GiantDetailClient } from "@/components/giant-detail-client";
import { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const giant = giants.find(g => g.slug === slug);
  
  if (!giant) return {};

  // We need messages to get the translated name and headline for SEO
  const messages = await getMessages({ locale });
  const giantData = (messages.Giants as any)[giant.id];

  return {
    title: `${giantData.name} | ${giantData.headline} - Shoulders of Giants`,
    description: `${giantData.shortDescription} Explore the wisdom, struggles, and recovery of ${giantData.name}. "${giantData.quote}"`,
    openGraph: {
      title: `${giantData.name} - Shoulders of Giants`,
      description: giantData.headline,
      images: [giant.imageUrl],
    },
  };
}

export default async function GiantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const giant = giants.find(g => g.slug === slug);
  if (!giant) notFound();

  const messages = await getMessages({ locale });
  
  const translations = {
    giantDetail: messages.GiantDetail,
    giants: (messages.Giants as any)[giant.id],
    giantsGrid: messages.GiantsGrid
  };

  return <GiantDetailClient giant={giant} translations={translations} />;
}
