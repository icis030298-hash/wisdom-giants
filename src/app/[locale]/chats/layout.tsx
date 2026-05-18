import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Chats" });
  const title = `${t("title")} | Giants Wisdom`;
  const description = t("description");
  
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

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
