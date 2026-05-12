import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, BookOpen, Quote, MessageSquare, Sparkles } from "lucide-react";
import AdSpace from "@/components/AdSpace";

export const runtime = 'edge';

export default async function Home() {
  const { data: giants } = await supabase
    .from('giants')
    .select('*')
    .order('created_at', { ascending: false });

  const categories = [
    { name: "성취", icon: <Sparkles size={20} />, color: "bg-amber-500/10 text-amber-500" },
    { name: "회복", icon: <BookOpen size={20} />, color: "bg-emerald-500/10 text-emerald-500" },
    { name: "지혜", icon: <Quote size={20} />, color: "bg-blue-500/10 text-blue-500" },
    { name: "창의", icon: <MessageSquare size={20} />, color: "bg-purple-500/10 text-purple-500" },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden premium-gradient pt-16">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-antique blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            거인의 어깨에 <br />
            <span className="gold-text-gradient">지혜의 뿌리를 내리다</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            역사적 위인들의 가장 어두웠던 순간과 극적인 극복의 서사. <br />
            이제 그들의 페르소나와 직접 대화하며 당신의 고민을 해결하세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-gold-antique text-navy-dark font-bold rounded-full hover:scale-105 transition-all shadow-xl">
              지혜 탐험하기
            </button>
            <button className="px-8 py-4 border border-gold-antique/30 text-gold-antique font-medium rounded-full hover:bg-gold-antique/5 transition-all">
              AI 멘토 소개
            </button>
          </div>
        </div>
      </section>

      <AdSpace slot="header-bottom" className="container mx-auto px-6" />

      {/* Categories */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-serif">카테고리별 지혜</h2>
          <div className="h-[1px] flex-1 bg-gold-antique/20 mx-8 hidden md:block" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl hover:border-gold-antique/50 transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-serif mb-2">{cat.name}</h3>
              <p className="text-slate-500 text-sm">깊이 있는 {cat.name}의 통찰</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Giants */}
      <section className="py-20 bg-navy-light/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif mb-12">오늘의 거인</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {giants?.map((giant) => (
              <Link href={`/giant/${giant.slug}`} key={giant.id} className="group">
                <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="aspect-video relative overflow-hidden bg-navy-dark">
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl font-serif text-gold-antique opacity-10 uppercase tracking-widest">{giant.name}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-gold-antique/10 text-gold-antique text-[10px] rounded-full uppercase tracking-widest font-bold">
                        {giant.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif mb-4 group-hover:text-gold-antique transition-colors">{giant.headline}</h3>
                    <p className="text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                      {giant.pain}
                    </p>
                    <div className="flex items-center text-gold-antique font-medium gap-2">
                      <span>서사 읽기</span>
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSpace slot="footer-top" className="container mx-auto px-6" />

      {/* Footer */}
      <footer className="py-20 border-t border-gold-antique/10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-2xl mb-4 gold-text-gradient">거인의 어깨 (Wisdom Giants)</p>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            우리는 과거의 위대한 지혜를 현대적으로 재해석하여, 
            사용자들이 더 나은 삶을 선택할 수 있도록 돕습니다.
          </p>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">
            © 2026 wisdom giants. all rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

