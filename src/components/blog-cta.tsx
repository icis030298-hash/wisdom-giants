"use client"

import { Link } from "@/i18n/routing"
import { trackCTAEvent } from "@/lib/analytics"
import { MessageSquare, Dna } from "lucide-react"

export function BlogCTA({ giantSlug, locale, giantName, chatHref }: { giantSlug: string, locale: string, giantName: string, chatHref: string }) {
  const isKo = locale === 'ko'
  
  return (
    <div className="max-w-3xl mx-auto mt-16 mb-24 px-4 sm:px-6">
      <div className="p-8 rounded-3xl glass-card border border-white/5 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              {isKo ? `${giantName}의 지혜가 더 필요하신가요?` : `Need more wisdom from ${giantName}?`}
            </h3>
            <p className="text-muted-foreground">
              {isKo 
                ? '거인과 직접 대화를 나누거나, 내 안의 거인 DNA를 확인해보세요.' 
                : 'Chat directly with the giant or discover your hidden potential.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <Link
              href={chatHref}
              onClick={() => trackCTAEvent('blog_post', 'chat', locale, giantSlug)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all group w-full sm:w-auto"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isKo ? '실시간 대화하기' : 'Chat Now'}
            </Link>
            
            <Link
              href="/?mode=match"
              onClick={() => trackCTAEvent('blog_post', 'dna', locale, giantSlug)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-foreground hover:bg-white/5 transition-all group w-full sm:w-auto font-medium"
            >
              <Dna className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              {isKo ? 'DNA 테스트' : 'DNA Test'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
