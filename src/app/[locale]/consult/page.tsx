import { ConsultClient } from "@/components/consult-client"
import { Navigation } from "@/components/navigation"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const titles: Record<string, string> = {
    ko: "고민 상담 | 거인의 지혜",
    en: "Get Advice | Giants Wisdom",
    de: "Beratung | Giants Wisdom",
    ja: "お悩み相談 | 偉人の知恵",
    es: "Consultar | Sabiduría de Gigantes",
    fr: "Consulter | La Sagesse des Géants",
    it: "Consulta | Saggezza dei Giganti",
    pt: "Consultar | Sabedoria dos Gigantes"
  };
  
  const descs: Record<string, string> = {
    ko: "당신의 고통은 혼자가 아닙니다. 역사상 가장 위대한 사람들도 똑같이 겪었고, 이겨냈습니다.",
    en: "Your struggles are not alone. The greatest minds in history faced the exact same struggles and overcame them.",
    de: "Ihr Schmerz ist nicht allein. Die größten Denker der Geschichte standen vor denselben Sorgen und haben sie überstanden.",
    ja: "あなたの苦しみは一人だけのものではありません。歴史上の偉人たちも同じように悩み、そして乗り越えてきました。",
    es: "Su dolor no es solitario. Las mentes más grandes de la historia pasaron por lo mismo y lo superaron.",
    fr: "Votre souffrance n'est pas solitaire. Les plus grands esprits de l'histoire ont connu les mêmes épreuves et les ont surmontées.",
    it: "Il tuo dolore non è isolato. Le più grandi menti della storia hanno affrontato le stesse difficoltà e le hanno superate.",
    pt: "Sua dor não é solitária. As maiores mentes da história enfrentaram exatamente os mesmos problemas e os superaram."
  };
  
  const l = (locale === 'ko' || locale === 'en' || locale === 'de' || locale === 'ja' || locale === 'es' || locale === 'fr' || locale === 'it' || locale === 'pt') ? locale : 'en';

  return {
    title: titles[l],
    description: descs[l],
    alternates: {
      canonical: `/${l}/consult`
    }
  };
}

export default async function ConsultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <Navigation />
      <ConsultClient locale={locale} />
    </>
  );
}
