import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Test" });
  const title = `${t("title").replace(/<br\s*\/?>/gi, " ")} | Giants Wisdom`;
  const description = t("subtitle");
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
