"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Quote, MessageSquare } from "lucide-react";
import AdSpace from "@/components/AdSpace";
import GiantAvatar from "@/components/GiantAvatar";
import { giantsData, Giant } from "@/data/giants";

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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-antique/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 border border-gold-antique/30 text-gold-antique text-[10px] rounded-full uppercase tracking-[0.4em] font-bold mb-8">
            The Museum of wisdom
          </span>
          <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight tracking-tighter">
            Shoulders of <br />
            <span className="gold-text-gradient italic font-normal">Giants</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-sans leading-relaxed font-light">
            역사의 거인들이 남긴 발자취를 따라 당신의 답을 찾아보세요. <br />
            10명의 위대한 멘토가 당신을 기다리고 있습니다.
          </p>
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

