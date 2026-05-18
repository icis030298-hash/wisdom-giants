import "./globals.css";
import Link from 'next/link';
import { Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#020617] text-[#f8fafc] font-sans antialiased min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="relative w-full max-w-lg px-6 py-12 text-center flex flex-col items-center justify-center z-10">
          {/* Subtle Golden Glow Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none -z-10" />
          
          {/* Icon Header */}
          <div className="mb-8 w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)] relative">
            <HelpCircle className="w-10 h-10 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          {/* Large Glowing Title */}
          <h1 className="text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.25)] select-none">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
            Page Not Found
          </h2>

          <p className="text-sm md:text-base text-muted-foreground/80 mb-10 max-w-md leading-relaxed font-normal">
            The page you requested has vanished into history, or the address is incorrect.
            <br />
            Return to the Hall of Wisdom and meet the great giants.
          </p>

          <Link
            href="/"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Hall of Giants</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </Link>
        </div>
      </body>
    </html>
  );
}
