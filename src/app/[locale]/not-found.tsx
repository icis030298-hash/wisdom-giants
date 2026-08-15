import "../globals.css";
import Link from 'next/link';
import { Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';
import { nanumMyeongjo } from "../fonts";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div
      className={`font-sans antialiased min-h-screen overflow-x-hidden flex items-center justify-center ${nanumMyeongjo.variable}`}
      style={{ background: "var(--rd-bg-base)", color: "var(--rd-text-body)" }}
    >
      <div className="relative w-full max-w-lg px-6 py-12 text-center flex flex-col items-center justify-center">
        {/* Icon Header. The blur wash, the glow shadow and the pinging dot are
            gone — a 404 does not need to announce itself three times. */}
        <div
          className="mb-8 w-20 h-20 flex items-center justify-center border rd-hairline rd-accent"
          style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}
        >
          <HelpCircle className="w-10 h-10" />
        </div>

        <h1
          className="text-8xl font-serif mb-4 select-none"
          style={{ color: "var(--rd-accent-brown)", fontWeight: "var(--rd-display-weight)", letterSpacing: "var(--rd-display-tracking)" }}
        >
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-serif font-bold rd-text-ink mb-4">
          {t('title')}
        </h2>

        <p className="rd-body-lg mb-10 max-w-md">
          {t('desc')}
          <br />
          {t('sub')}
        </p>

        <Link
          href="/"
          className="flex items-center gap-3 px-8 py-4 rd-bg-accent border font-bold text-lg hover:opacity-90 transition-opacity"
          style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)", transitionDuration: "120ms" }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
          <Sparkles className="w-4 h-4 opacity-70" />
        </Link>
      </div>
    </div>
  );
}
