'use client';

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Quote as QuoteIcon } from 'lucide-react';

interface QuoteCardProps {
  quote: string;
  author: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (cardRef.current === null) return;
    
    try {
      // Create a blob and download
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 4, // Higher quality for sharing
        backgroundColor: '#0f172a' // Ensure navy background
      });
      
      const link = document.createElement('a');
      link.download = `wisdom-${author.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 my-16">
      <div 
        ref={cardRef}
        className="relative w-[360px] aspect-[9/16] overflow-hidden bg-navy-dark border border-gold-antique/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-12 text-center rounded-[2rem]"
      >
        {/* Premium Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-gold-antique blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        {/* Framing Borders */}
        <div className="absolute inset-6 border border-gold-antique/10 rounded-[1.5rem] pointer-events-none" />
        <div className="absolute top-10 left-10 w-12 h-12 border-t border-l border-gold-antique/40" />
        <div className="absolute bottom-10 right-10 w-12 h-12 border-b border-r border-gold-antique/40" />

        <div className="relative z-10 flex flex-col items-center gap-10">
          <div className="w-16 h-16 rounded-full bg-gold-antique/10 flex items-center justify-center text-gold-antique mb-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <QuoteIcon size={32} fill="currentColor" className="opacity-80" />
          </div>
          
          <div className="space-y-8">
            <p className="text-3xl md:text-4xl font-serif text-slate-100 leading-[1.4] tracking-tight italic px-4">
              {quote}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-[1px] bg-gold-antique/30" />
              <p className="text-sm font-sans tracking-[0.4em] text-gold-antique uppercase font-bold">
                {author}
              </p>
              <div className="w-8 h-[1px] bg-gold-antique/30" />
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="absolute bottom-16 left-0 w-full text-center">
          <div className="inline-block px-4 py-1 border border-gold-antique/10 rounded-full">
            <p className="text-[9px] tracking-[0.5em] text-slate-500 uppercase font-bold">
              Wisdom Giants • Series 01
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <button 
            onClick={downloadImage}
            className="flex items-center gap-3 px-8 py-4 bg-gold-antique text-navy-dark font-bold rounded-full hover:scale-105 transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
          >
            <Download size={20} />
            <span>이미지로 저장하기 (9:16)</span>
          </button>
          <button className="p-4 border border-gold-antique/30 rounded-full text-gold-antique hover:bg-gold-antique/10 transition-all active:scale-95">
            <Share2 size={24} />
          </button>
        </div>
        <p className="text-xs text-slate-500 font-light tracking-wide">인스타그램 스토리 공유에 최적화된 고해상도 이미지입니다.</p>
      </div>
    </div>
  );
};

export default QuoteCard;
