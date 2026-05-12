import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, BookOpen, Quote, MessageSquare, Sparkles } from "lucide-react";
import AdSpace from "@/components/AdSpace";
import GiantAvatar from "@/components/GiantAvatar";

export default async function Home() {
  const { data: giants } = await supabase
    .from('giants')
    .select('*')
    .order('created_at', { ascending: false });

  const categories = [
    { name: "성취", slug: "achievement", icon: <Sparkles size={24} />, color: "from-amber-500/20 to-amber-900/20", textColor: "text-amber-500", desc: "한계를 뛰어넘은 성공의 공식" },
    { name: "회복", slug: "recovery", icon: <BookOpen size={24} />, color: "from-emerald-500/20 to-emerald-900/20", textColor: "text-emerald-500", desc: "고통을 희망으로 바꾼 회복력" },
    { name: "지혜", slug: "wisdom", icon: <Quote size={24} />, color: "from-blue-500/20 to-blue-900/20", textColor: "text-blue-500", desc: "시대를 관통하는 삶의 철학" },
    { name: "창의", slug: "creativity", icon: <MessageSquare size={24} />, color: "from-purple-500/20 to-purple-900/20", textColor: "text-purple-500", desc: "세상을 바꾼 영감의 기원" },
  ];

  return (
    <main className="min-h-screen bg-navy-dark text-slate-200 selection:bg-gold-antique/30 selection:text-gold-antique">
      {/* Hero Section - The Museum Entry */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-antique/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <header className="mb-12">
            <span className="inline-block px-4 py-1.5 border border-gold-antique/30 text-gold-antique text-[10px] rounded-full uppercase tracking-[0.4em] font-bold mb-8 animate-fade-in">
              Premium Wisdom Platform
            </span>
            <h1 className="text-6xl md:text-9xl font-serif mb-8 leading-tight tracking-tighter">
              Shoulders of <br />
              <span className="gold-text-gradient italic font-normal">Giants</span>
            </h1>
            <div className="w-24 h-[1px] bg-gold-antique mx-auto mb-10 opacity-50" />
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-sans leading-relaxed font-light">
              거인들의 어깨 위에서 세상을 바라보세요. <br />
              역사적 위인들의 고통과 극복의 서사가 당신의 고민에 답을 드립니다.
            </p>
          </header>
          
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-5 bg-gold-antique text-navy-dark font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              박물관 입장하기
            </button>
            <button className="px-10 py-5 border border-gold-antique/20 text-gold-antique font-medium rounded-full hover:bg-gold-antique/5 transition-all backdrop-blur-sm">
              AI 멘토 소개
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-px h-12 bg-gradient-to-t from-gold-antique to-transparent" />
        </div>
      </section>

      <AdSpace slot="header-bottom" className="container mx-auto px-6 mb-24" />

      {/* Categories - The Galleries */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm uppercase tracking-[0.5em] text-gold-antique mb-4">The Galleries</h2>
          <h3 className="text-4xl font-serif">지혜의 관문</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className={`group relative overflow-hidden p-10 rounded-[2rem] border border-white/5 bg-gradient-to-br ${cat.color} hover:border-gold-antique/30 transition-all duration-500 cursor-pointer`}>
              <div className={`w-14 h-14 rounded-2xl bg-navy-dark/50 flex items-center justify-center mb-8 ${cat.textColor} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                {cat.icon}
              </div>
              <h3 className="text-2xl font-serif mb-3">{cat.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{cat.desc}</p>
              <div className={`text-[10px] uppercase tracking-widest font-bold ${cat.textColor} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2`}>
                탐험하기 <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Giants - The Exhibits */}
      <section className="py-32 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm uppercase tracking-[0.5em] text-gold-antique mb-4">Featured Exhibits</h2>
              <h3 className="text-5xl font-serif leading-tight">오늘의 거인</h3>
            </div>
            <Link href="/explore" className="text-gold-antique border-b border-gold-antique/30 pb-1 text-sm tracking-widest uppercase font-bold hover:border-gold-antique transition-colors">
              전체 전시 보기
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {giants?.map((giant) => (
              <Link href={`/giant/${giant.slug}`} key={giant.id} className="group block">
                <div className="relative glass-panel rounded-[3rem] p-10 md:p-14 overflow-hidden border-white/5 group-hover:border-gold-antique/20 transition-all duration-700">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold-antique blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                      <GiantAvatar slug={giant.slug} size={180} className="relative z-10 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="inline-block px-3 py-1 bg-white/5 text-gold-antique text-[10px] rounded-full uppercase tracking-widest font-bold mb-6">
                        {giant.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-serif mb-6 group-hover:text-gold-antique transition-colors duration-500">
                        {giant.name}
                      </h3>
                      <p className="text-slate-400 text-lg line-clamp-2 mb-8 font-light italic">
                        &quot;{giant.quote.split('\n')[0]}&quot;
                      </p>
                      <div className="flex items-center justify-center md:justify-start text-gold-antique font-bold gap-3 text-sm tracking-widest uppercase">
                        <span>상세 서사 보기</span>
                        <div className="w-8 h-px bg-gold-antique/30 group-hover:w-12 transition-all duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSpace slot="footer-top" className="container mx-auto px-6 py-20" />

      {/* Footer */}
      <footer className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="mb-12">
            <h4 className="font-serif text-3xl gold-text-gradient mb-6">Shoulders of Giants</h4>
            <div className="w-12 h-[1px] bg-gold-antique mx-auto opacity-30" />
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-12 leading-relaxed font-light">
            역사의 위대한 발자취는 우리에게 가장 강력한 이정표가 됩니다. <br />
            거인들의 어깨 위에서 당신의 가능성을 발견하세요.
          </p>
          <div className="flex justify-center gap-8 mb-16 text-slate-600">
            <Link href="#" className="hover:text-gold-antique transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gold-antique transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gold-antique transition-colors">Contact</Link>
          </div>
          <p className="text-[10px] text-slate-700 uppercase tracking-[0.4em] font-bold">
            © 2026 wisdom giants • premium museum platform
          </p>
        </div>
      </footer>
    </main>
  );
}

