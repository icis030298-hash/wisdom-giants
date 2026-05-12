import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "거인의 어깨 (Wisdom Giants) | 위인의 지혜와 AI 멘토링",
  description: "역사적 위인들의 삶과 철학을 통해 현대인의 고민을 해결하는 고품질 지혜 플랫폼. 스티브 잡스부터 마르쿠스 아우렐리우스까지, 거인들의 어깨 위에서 세상을 바라보세요.",
  keywords: ["위인", "지혜", "자기계발", "AI 멘토링", "스티브 잡스", "철학", "명언"],
  openGraph: {
    title: "거인의 어깨 (Wisdom Giants)",
    description: "역사적 위인들의 지혜를 현대적으로 재해석한 프리미먼 콘텐츠 플랫폼",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased selection:bg-gold-antique/30 selection:text-gold-antique">
        {children}
      </body>
    </html>
  );
}

