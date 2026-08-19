import "./globals.css";
import Link from 'next/link';
import { Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className="font-sans antialiased min-h-screen overflow-x-hidden flex items-center justify-center"
        style={{ background: "var(--rd-bg-base)", color: "var(--rd-text-body)" }}
      >
        <div className="relative w-full max-w-lg px-6 py-12 text-center flex flex-col items-center justify-center">
          {/* Icon Header. Same treatment as the localised 404 — the two screens
              are the same screen to a visitor, so they cannot drift apart. */}
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
            Page Not Found
          </h2>

          <p className="rd-body-lg mb-10 max-w-md">
            The page you requested has vanished into history, or the address is incorrect.
            <br />
            Return to the Hall of Wisdom and meet the great giants.
          </p>

          <Link
            href="/"
            className="flex items-center gap-3 px-8 py-4 rd-bg-accent border font-bold text-lg hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)", transitionDuration: "120ms" }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Hall of Giants</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </Link>
        </div>
      </body>
    </html>
  );
}
