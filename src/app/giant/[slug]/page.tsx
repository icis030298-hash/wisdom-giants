import { notFound } from 'next/navigation';
import QuoteCard from '@/components/QuoteCard';
import AIGiantChat from '@/components/AIGiantChat';
import AdSpace from '@/components/AdSpace';
import GiantAvatar from '@/components/GiantAvatar';
import { BookOpen, Award, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { giantsData } from '@/data/giants';

interface GiantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GiantPage({ params }: GiantPageProps) {
  const { slug } = await params;
  
  // Find giant from local data instead of Supabase
  const giant = giantsData.find(g => g.slug === slug);

  if (!giant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-navy-dark text-slate-200 selection:bg-gold-antique/30 selection:text-gold-antique">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-navy-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gold-antique hover:gap-4 transition-all w-fit group">
            <ArrowLeft size={20} />
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] font-bold">돌아가기</span>
          </Link>
          <div className="font-serif text-lg gold-text-gradient opacity-0 md:opacity-100 transition-opacity">Shoulders of Giants</div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </nav>

      {/* Hero Section - The Exhibit Header */}
      <header className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-gold-antique/5 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-12 inline-block relative">
            <div className="absolute inset-0 bg-gold-antique blur-3xl opacity-20 animate-pulse" />
            <GiantAvatar slug={giant.slug} category={giant.category} size={240} className="relative z-10 border-4 border-gold-antique/30" />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <span className="px-4 py-1.5 bg-gold-antique/10 border border-gold-antique/30 text-gold-antique text-[10px] rounded-full uppercase tracking-[0.4em] font-bold mb-8 inline-block">
              {giant.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight tracking-tight">
              {giant.headline}
            </h1>
            <div className="w-24 h-[1px] bg-gold-antique mx-auto mb-8 opacity-50" />
            <p className="text-xl md:text-2xl font-serif italic text-slate-400 max-w-2xl mx-auto leading-relaxed">
              &quot;{giant.quote.split('\n')[0]}&quot;
            </p>
          </div>
        </div>
      </header>

      {/* Main Exhibition Content */}
      <div className="container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: The Narrative */}
          <div className="lg:col-span-7 space-y-24">
            <section className="space-y-12">
              <div className="flex items-center gap-6 text-gold-antique border-b border-white/5 pb-6">
                <Award size={32} strokeWidth={1.5} />
                <h2 className="text-3xl font-serif">가장 어두웠던 고통</h2>
              </div>
              <div className="text-xl leading-[1.8] text-slate-300 font-light font-sans whitespace-pre-wrap first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-gold-antique first-letter:leading-none">
                {giant.pain}
              </div>
            </section>

            <AdSpace slot="mid-content" />

            <section className="space-y-12">
              <div className="flex items-center gap-6 text-gold-antique border-b border-white/5 pb-6">
                <ShieldCheck size={32} strokeWidth={1.5} />
                <h2 className="text-3xl font-serif">극적인 극복 과정</h2>
              </div>
              <div className="text-xl leading-[1.8] text-slate-300 font-light font-sans whitespace-pre-wrap">
                {giant.recovery}
              </div>
            </section>

            <section className="bg-white/5 p-10 md:p-16 rounded-[3rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-antique/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-6 text-gold-antique">
                  <BookOpen size={32} strokeWidth={1.5} />
                  <h2 className="text-3xl font-serif">현대인에게 주는 지혜</h2>
                </div>
                <div className="grid gap-10">
                  {giant.lessons.map((lesson, i) => (
                    <div key={i} className="group/lesson">
                      <h3 className="text-2xl font-serif text-gold-antique mb-4 flex items-center gap-4">
                        <span className="text-sm font-sans font-bold opacity-30 group-hover/lesson:opacity-100 transition-opacity">0{i + 1}</span>
                        {lesson.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed font-light pl-10 border-l border-gold-antique/10">
                        {lesson.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Interaction & Social */}
          <aside className="lg:col-span-5 space-y-16">
            <div className="sticky top-32 space-y-16">
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-slate-500 font-bold mb-8 text-center">Wisdom Archive</h3>
                <QuoteCard quote={giant.quote} author={giant.name} />
              </section>

              <AdSpace slot="sidebar-bottom" />
            </div>
          </aside>
        </div>
      </div>

      {/* Interactive Mentor Section */}
      <section className="py-32 bg-black/40 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block p-4 rounded-full bg-gold-antique/10 text-gold-antique mb-8 animate-bounce">
                <Sparkles size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">거인과의 대화</h2>
              <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                {giant.name}의 철학이 담긴 AI 페르소나와 직접 대화해 보세요. <br />
                당신의 고민에 대한 답을 거인의 어깨 위에서 찾아보실 수 있습니다.
              </p>
            </div>
            
            <div className="glass-panel rounded-[3rem] p-4 border-white/10 shadow-2xl">
              <AIGiantChat giantName={giant.name} persona={giant.persona} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-white/5 text-center bg-navy-dark">
        <Link href="/" className="font-serif text-2xl gold-text-gradient mb-4 inline-block">Shoulders of Giants</Link>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] font-bold mt-4">WISDOM MUSEUM • PREMIUM EXPERIENCE</p>
      </footer>
    </main>
  );
}
