"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Quote, RefreshCw, Download } from "lucide-react"
import Image from "next/image"
import { giants } from "@/lib/giants-data"
import { toPng } from "html-to-image"
import { useRef } from "react"
import { useTranslations } from "next-intl"

export function QuoteSection() {
  const t = useTranslations("QuoteSection")
  const tg = useTranslations("Giants")
  const tc = useTranslations("GiantsGrid")
  
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const quotes = useMemo(() => giants.map(g => ({ 
    id: g.id,
    quote: tg(`${g.id}.quote`), 
    author: tg(`${g.id}.name`), 
    title: tg(`${g.id}.headline`),
    category: g.category,
    imageUrl: g.imageUrl 
  })), [tg])
  
  const nextQuote = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % (quotes?.length || 1))
      setIsAnimating(false)
    }, 300)
  }, [quotes?.length])

  const downloadImage = async () => {
    if (cardRef.current === null) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 4,
        backgroundColor: '#020617'
      });
      
      const link = document.createElement('a');
      link.download = `wisdom-quote-${quotes[currentQuote].author.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextQuote()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [nextQuote])
  
  const quote = quotes[currentQuote]
  
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden" ref={cardRef}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-full translate-x-1/4 translate-y-1/4" />
          
          <div className="relative z-10">
            {/* Label */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-400/80 font-medium tracking-wide uppercase">{t("label")}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={nextQuote}
                  className="p-2 rounded-lg glass hover:bg-amber-500/10 text-muted-foreground hover:text-amber-400 transition-all"
                  aria-label="Next quote"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={downloadImage}
                  className="p-2 rounded-lg glass hover:bg-amber-500/10 text-muted-foreground hover:text-amber-400 transition-all"
                  aria-label="Download quote"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Quote */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8 text-balance">
                &ldquo;{quote.quote}&rdquo;
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  <Image 
                    src={quote.imageUrl} 
                    alt={quote.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-serif text-lg font-semibold text-foreground">{quote.author}</div>
                  <div className="text-sm text-amber-400/80">{tc(`categories.${quote.category}`)}</div>
                </div>
              </div>
            </div>
            
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAnimating(true)
                    setTimeout(() => {
                      setCurrentQuote(i)
                      setIsAnimating(false)
                    }, 300)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentQuote % 5 === i 
                      ? 'bg-amber-400 w-6' 
                      : 'bg-amber-500/20 hover:bg-amber-500/40'
                  }`}
                  aria-label={`Go to quote ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
