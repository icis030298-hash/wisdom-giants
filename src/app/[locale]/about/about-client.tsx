"use client"

import { m } from "framer-motion"
import { useLocale } from "next-intl"
import { giantsData } from "@/data/giants"

export function AboutPageClient() {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-foreground pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-400 mb-8">
            {locale === 'ko' ? '거인의 어깨 위에서' : 'Standing on the Shoulders of Giants'}
          </h1>
          <div className="prose prose-invert prose-amber max-w-none font-light leading-relaxed space-y-6">
            {locale === 'ko' ? (
              <>
                <p>AI는 지금 가늠하기 어려운 속도로 발전하고 있습니다. 우리는 그 어느 때보다 쉽게 정보를 얻고, 무엇이든 만들어낼 수 있게 되었습니다.</p>
                <p>그러나 정보가 늘어난 만큼 노이즈도 늘었습니다. 무엇이 진짜 중요한지 가려내기는 오히려 더 어려워졌습니다.</p>
                
                <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">Giants Wisdom은 뉴턴의 말에서 시작되었습니다.</h2>
                <blockquote className="border-l-2 border-amber-500/50 pl-4 py-2 italic text-amber-200/90 my-4 bg-amber-500/[0.03] rounded-r-lg">
                  &ldquo;내가 더 멀리 보았다면, 그것은 거인들의 어깨 위에 올라섰기 때문이다.&rdquo;
                </blockquote>
                
                <p>평생을 배워도 이 시대의 정보를 다 익힐 수는 없습니다. 그래서 저는 이런 때일수록 과거의 위대한 인물들을 다시 바라볼 필요가 있다고 생각했습니다. 그들이 남긴 것은 정보가 아니라 지혜이기 때문입니다.</p>
                
                <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">Giants Wisdom은 정보를 나열하는 곳이 아닙니다.</h2>
                <p>위인이라는 말은 현대인에게 어쩌면 진부하게 들릴지 모릅니다. 그래서 더 쉽게 다가갈 수 있는 방법을 고민했습니다. 직접 대화를 나누고, 서로 다른 시대의 인물들이 토론하는 모습을 지켜보고, 나와 닮은 거인을 찾아보는 것. 지혜를 얻는 과정이 즐거울 수 있도록 설계했습니다.</p>
                
                <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">그리고 24개 언어로 만들었습니다.</h2>
                <p>시대를 관통한 지혜에 성별도, 국적도, 나이도 없습니다. 어느 대륙에 있든 자기 언어로 편안하게 만날 수 있어야 한다고 생각했습니다.</p>
                
                <p className="pt-4">세계 곳곳의 더 많은 사람들이 이곳에서 자신에게 필요한 지혜를 발견하기를 바랍니다.</p>
                
                <p className="text-right font-serif text-amber-500 mt-10 text-lg">— Giants Wisdom 창립자</p>
              </>
            ) : (
              <>
                <p>AI is advancing at an unimaginable speed today. We can acquire information and create almost anything more easily than ever before.</p>
                <p>However, as information has increased, so has the noise. Distinguishing what is truly important has become even more difficult.</p>
                
                <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">Giants Wisdom began with Newton&apos;s words.</h2>
                <blockquote className="border-l-2 border-amber-500/50 pl-4 py-2 italic text-amber-200/90 my-4 bg-amber-500/[0.03] rounded-r-lg">
                  &ldquo;If I have seen further it is by standing on the shoulders of Giants.&rdquo;
                </blockquote>
                
                <p>No matter how long we learn, we cannot master all the information of this era. That is why I believed that in times like these, we need to look back at the great figures of the past. What they left behind is not mere information, but timeless wisdom.</p>
                
                <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">Giants Wisdom is not a place that merely lists information.</h2>
                <p>The term &apos;historical giant&apos; might sound cliché to modern people. So I pondered ways to make wisdom more accessible: chatting directly with them, watching figures from different eras debate, and finding the giant who resembles you. We designed the process of gaining wisdom to be inspiring and enjoyable.</p>
                
                <h2 className="text-xl font-bold text-amber-300 pt-4 mb-2">And we built it in 24 languages.</h2>
                <p>Wisdom that transcends time has no gender, nationality, or age. I believed that people on any continent should be able to meet it comfortably in their own native language.</p>
                
                <p className="pt-4">I hope that more people around the world discover the wisdom they need right here.</p>
                
                <p className="text-right font-serif text-amber-500 mt-10 text-lg">— Founder, Giants Wisdom</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
