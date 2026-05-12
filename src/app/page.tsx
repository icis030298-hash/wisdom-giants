"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Quote, MessageSquare, ChevronDown } from "lucide-react";
import AdSpace from "@/components/AdSpace";
import GiantAvatar from "@/components/GiantAvatar";
import { giantsData } from "@/data/giants";

type Category = '전체' | '성취' | '역경' | '지혜' | '창의';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('전체');

  const filteredGiants = activeCategory === '전체' 
    ? giantsData 
    : giantsData.filter(giant => giant.category === activeCategory);

  const filterTabs: { name: Category; icon: React.ReactNode }[] = [
    { name: '전체', icon: <Sparkles size={16} /> },
    { name: '성취', icon: <Sparkles size={16} /> },
    { name: '역경', icon: <BookOpen size={16} /> },
    { name: '지혜', icon: <Quote size={16} /> },
    { name: '창의', icon: <MessageSquare size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-navy-dark text-slate-200 selection:bg-gold-antique/30 selection:text-gold-antique">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Visual Effects: Glow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold-antique/10 blur-[120px] rounded-full opacity-30" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-navy-light/20 blur-[100px] rounded-full opacity-20" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gold-muted/10 blur-[100px] rounded-full opacity-10" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 border border-gold-antique/30 text-gold-antique text-[10px] rounded-full uppercase tracking-[0.4em] font-bold mb-8">
            THE MUSEUM OF WISDOM
          </span>
          
          <h1 className="text-6xl md:text-9xl font-serif mb-6 leading-tight tracking-tighter">
            Shoulders of <br />
            <span className="gold-text-gradient italic font-normal drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">Giants</span>
          </h1>

          {/* Isaac Newton Quote */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold-antique/40 mb-4" />
            <p className="text-slate-400 italic text-lg md:text-xl font-light tracking-wide max-w-2xl">
              &quot;내가 더 멀리 보았다면, 그것은 거인들의 어깨 위에 올라섰기 때문이다.&quot;
            </p>
            <div className="w-px h-6 bg-gold-antique/20 mt-4" />
          </div>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-12 font-sans leading-relaxed font-light">
            역사의 거인들이 남긴 발자취를 따라 당신의 답을 찾아보세요. <br />
            <span className="text-slate-300 font-medium">40인의 위대한 멘토</span>가 당신의 질문을 기다립니다.
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">Discover</span>
            <div className="animate-bounce p-2 rounded-full border border-white/10 bg-white/5">
              <ChevronDown size={20} className="text-gold-antique" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-50 bg-navy-dark/80 backdrop-blur-xl border-y border-white/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveCategory(tab.name)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === tab.name
                    ? 'bg-gold-antique text-navy-dark shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AdSpace slot="top-grid" className="container mx-auto px-6 my-12" />

      {/* Museum Grid */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredGiants.map((giant) => (
            <Link 
              href={`/giant/${giant.slug}`} 
              key={giant.id}
              className="group block"
            >
              <div className="relative glass-panel rounded-[2.5rem] p-8 h-full flex flex-col items-center text-center border-white/5 group-hover:border-gold-antique/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden">
                {/* Avatar */}
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-gold-antique blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                  <GiantAvatar 
                    slug={giant.slug} 
                    category={giant.category} 
                    size={140} 
                    className="relative z-10 group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                <span className="px-3 py-1 bg-white/5 text-gold-antique text-[9px] rounded-full uppercase tracking-widest font-bold mb-4">
                  {giant.category}
                </span>
                
                <h3 className="text-xl md:text-2xl font-serif mb-3 group-hover:text-gold-antique transition-colors">
                  {giant.name}
                </h3>
                
                <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed mb-6 line-clamp-2">
                  {giant.shortDescription}
                </p>

                <div className="mt-auto pt-4 flex items-center gap-2 text-gold-antique font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  전시 관람하기 <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdSpace slot="bottom-grid" className="container mx-auto px-6 mb-24" />

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 text-center">
        <h4 className="font-serif text-2xl gold-text-gradient mb-4">Shoulders of Giants</h4>
        <p className="text-slate-600 text-xs uppercase tracking-[0.4em] font-bold">wisdom museum platform</p>
      </footer>
    </main>
  );
}

