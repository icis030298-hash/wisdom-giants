import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t border-white/5 bg-navy-dark">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Top Logo & Slogan */}
        <Link href="/" className="font-serif text-xl gold-text-gradient mb-2 transition-opacity hover:opacity-80">
          Shoulders of Giants
        </Link>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-bold mb-10">
          WISDOM MUSEUM PLATFORM
        </p>
        
        {/* Links Area */}
        <div className="flex items-center justify-center gap-6 mb-8 text-[11px] font-medium">
          <Link href="#" className="text-slate-400 hover:text-gold-antique transition-colors duration-300">
            이용약관
          </Link>
          <span className="text-slate-800">|</span>
          <Link href="#" className="text-slate-400 hover:text-gold-antique transition-colors duration-300">
            개인정보처리방침
          </Link>
          <span className="text-slate-800">|</span>
          <Link href="#" className="text-slate-400 hover:text-gold-antique transition-colors duration-300">
            문의하기
          </Link>
        </div>
        
        {/* Copyright */}
        <p className="text-[10px] text-slate-600 font-sans tracking-widest opacity-80">
          &copy; 2026 Shoulders of Giants. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
