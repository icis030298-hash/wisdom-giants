'use client';

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';

interface QuoteCardProps {
  quote: string;
  author: string;
  backgroundImage?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (cardRef.current === null) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `${author}-quote.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 my-12">
      <div 
        ref={cardRef}
        className="relative w-[360px] aspect-[9/16] overflow-hidden bg-navy-dark border border-gold-antique/20 shadow-2xl flex flex-col justify-center p-12 text-center"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-antique" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-antique" />
        </div>

        <div className="relative z-10">
          <span className="text-6xl text-gold-antique opacity-50 font-serif mb-8 block">&quot;</span>
          <p className="text-2xl font-serif text-slate-100 leading-relaxed mb-12 italic">
            {quote}
          </p>
          <div className="w-12 h-[1px] bg-gold-antique mx-auto mb-6" />
          <p className="text-lg font-sans tracking-widest text-gold-antique uppercase">
            {author}
          </p>
        </div>

        {/* Branding */}
        <div className="absolute bottom-12 left-0 w-full text-center">
          <p className="text-[10px] tracking-[0.3em] text-slate-500 uppercase">
            wisdom giants • 거인의 어깨
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={downloadImage}
          className="flex items-center gap-2 px-6 py-3 bg-gold-antique text-navy-dark font-bold rounded-full hover:bg-gold-antique/90 transition-all active:scale-95 shadow-lg"
        >
          <Download size={18} />
          <span>이미지로 저장하기</span>
        </button>
        <button className="p-3 border border-gold-antique/30 rounded-full text-gold-antique hover:bg-gold-antique/10 transition-all">
          <Share2 size={20} />
        </button>
      </div>
      <p className="text-xs text-slate-500 italic">9:16 비율로 저장되어 인스타그램 스토리에 최적화되어 있습니다.</p>
    </div>
  );
};

export default QuoteCard;
