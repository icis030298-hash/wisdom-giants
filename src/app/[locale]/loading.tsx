// Route-transition fallback. This used to be a fixed inset-0 z-50 overlay with
// a "Summoning Timeless Wisdom..." headline — a full screen the reader hit on
// every navigation, for seconds on any ISR miss, and in English for the 20
// locales the text was never translated into. A 3px bar at the top of the
// viewport covers nothing, needs no words, and so needs no translations.
export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes rd-loading-slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div
        role="progressbar"
        aria-label="Loading"
        className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
        style={{ height: "3px", background: "var(--rd-divider-faint)" }}
      >
        <div
          className="h-full w-1/2"
          style={{
            background: "var(--rd-accent-brown)",
            animation: "rd-loading-slide 1.2s ease-in-out infinite",
          }}
        />
      </div>
    </>
  )
}
