import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import QuoteCard from '@/components/QuoteCard';
import AIGiantChat from '@/components/AIGiantChat';
import AdSpace from '@/components/AdSpace';
import { BookOpen, Award, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

interface GiantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GiantPage({ params }: GiantPageProps) {
  const { slug } = await params;
  
  const { data: giant } = await supabase
    .from('giants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!giant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-navy-dark text-slate-200">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8">
        <Link href="/" className="flex items-center gap-2 text-gold-antique hover:gap-4 transition-all w-fit">
          <ArrowLeft size={20} />
          <span className="font-sans uppercase tracking-widest text-xs font-bold">돌아가기</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-12 pb-24 text-center max-w-4xl">
        <div className="flex justify-center mb-8">
          <span className="px-4 py-1.5 bg-gold-antique/10 border border-gold-antique/30 text-gold-antique text-xs rounded-full uppercase tracking-[0.3em] font-bold">
            {giant.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
          {giant.headline}
        </h1>
        <div className="w-24 h-1 bg-gold-antique mx-auto mb-12 opacity-50" />
      </header>

      {/* Quote Section */}
      <section className="bg-navy-light/20 py-12">
        <div className="container mx-auto px-6">
          <QuoteCard quote={giant.quote} author={giant.name} />
        </div>
      </section>

      <AdSpace slot="after-quote" className="container mx-auto px-6" />

      {/* Long-form Content */}
      <section className="container mx-auto px-6 py-24 max-w-3xl">
        <article className="space-y-16">
          {/* Pain Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gold-antique mb-4">
              <Award size={28} />
              <h2 className="text-2xl font-serif">가장 어두웠던 고통</h2>
            </div>
            <div className="text-lg leading-relaxed text-slate-300 font-sans whitespace-pre-wrap first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-gold-antique">
              {giant.pain}
            </div>
          </div>

          <AdSpace slot="mid-content" />

          {/* Recovery Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gold-antique mb-4">
              <ShieldCheck size={28} />
              <h2 className="text-2xl font-serif">극적인 극복 과정</h2>
            </div>
            <div className="text-lg leading-relaxed text-slate-300 font-sans whitespace-pre-wrap">
              {giant.recovery}
            </div>
          </div>

          {/* Lessons Section */}
          <div className="space-y-8 bg-navy-light/30 p-10 rounded-3xl border border-gold-antique/10">
            <div className="flex items-center gap-4 text-gold-antique mb-4">
              <BookOpen size={28} />
              <h2 className="text-2xl font-serif">현대인에게 주는 3가지 시사점</h2>
            </div>
            <div className="space-y-8">
              {giant.lessons.map((lesson: { title: string; content: string }, i: number) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-xl font-serif text-gold-antique">{i + 1}. {lesson.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{lesson.content}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <AdSpace slot="before-chat" className="container mx-auto px-6" />

      {/* AI Chat Section */}
      <section className="py-24 premium-gradient">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">거인과의 대화</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            {giant.name}의 철학으로 당신의 고민에 대한 답을 찾아보세요.
            실시간 AI 멘토링이 당신을 기다립니다.
          </p>
        </div>
        <div className="container mx-auto px-6">
          <AIGiantChat giantName={giant.name} persona={giant.persona} />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-gold-antique/10 text-center">
        <Link href="/" className="font-serif text-xl gold-text-gradient">거인의 어깨</Link>
        <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-4">wisdom giants • premium wisdom platform</p>
      </footer>
    </main>
  );
}

