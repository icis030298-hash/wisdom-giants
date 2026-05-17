export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative w-24 h-24 mb-8">
        {/* Animated outer ring */}
        <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        
        {/* Pulsing center icon container */}
        <div className="absolute inset-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8 text-black"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 animate-pulse">
          Giants Wisdom
        </h2>
        <p className="text-muted-foreground text-sm tracking-widest uppercase animate-pulse delay-75">
          Summoning Timeless Wisdom...
        </p>
      </div>
      
      {/* Skeleton-like background elements for texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
