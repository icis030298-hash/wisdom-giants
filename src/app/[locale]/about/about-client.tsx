"use client"

import { m } from "framer-motion"
import { useLocale } from "next-intl"

export function AboutPageClient() {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-foreground pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* CEO Column Placeholder (User will fill this in) */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">
            {locale === 'ko' ? '운영자 소개' : 'About the Creator'}
          </h1>
          <div className="prose prose-invert prose-amber max-w-none font-light leading-relaxed space-y-6">
            {locale === 'ko' ? (
              <>
                <p>안녕하세요, 거인들의 지혜 프로젝트 운영자입니다.</p>
                <p>세상은 유례없이 빠르게 발전하고 있지만, 역설적으로 우리는 그 어느 때보다 깊은 고립감과 불안을 느끼며 살아갑니다. 밤잠을 설치며 인생의 방향을 고민하던 어느 날, 저는 우연히 펼친 오래된 역사책 속에서 놀라운 위안을 얻었습니다. 수백, 수천 년 전의 위인들 역시 지금의 우리와 똑같은 두려움에 떨었고, 실패에 좌절했으며, 뼈를 깎는 고독 속에서 자신의 길을 개척해 나갔다는 사실이었습니다.</p>
                <p>저는 이 깨달음을 혼자만의 것으로 남겨두고 싶지 않았습니다. 시대를 초월한 거인들의 철학과 생생한 경험은, 오늘날 우리가 직면한 멘탈 위기를 극복할 가장 강력한 해독제가 될 수 있다고 믿었습니다. '거인들의 지혜'는 단순한 인물 백과사전이 아닙니다. 상처받고 지친 당신이 언제든 찾아와 마음을 기댈 수 있는, 시공간을 초월한 멘토링 공간입니다.</p>
                <p>앞으로 이 플랫폼은 전 세계 모든 이들의 든든한 멘탈 멘토가 될 것입니다. 당신이 삶의 무게에 짓눌려 길을 잃었을 때, 아인슈타인의 유쾌한 조언이, 링컨의 묵묵한 위로가, 마르쿠스 아우렐리우스의 단단한 철학이 당신의 영혼을 다시 일으켜 세울 것입니다. 우리는 결코 혼자가 아닙니다. 수많은 거인들이 이미 그 길을 걸었고, 이제 이 곳에서 당신의 손을 잡아줄 것입니다. 당신의 찬란한 내일을 온 마음을 다해 응원합니다.</p>
              </>
            ) : (
              <>
                <p>Hello, I am the creator of the Giants Wisdom project.</p>
                <p>The world is advancing at an unprecedented pace, yet paradoxically, we are living with a deeper sense of isolation and anxiety than ever before. One night, tossing and turning with worries about my future, I found unexpected solace in an old history book. I realized that the great figures of hundreds and thousands of years ago trembled with the exact same fears, despaired over painful failures, and forged their paths through agonizing solitude, just as we do today.</p>
                <p>I did not want to keep this profound realization to myself. I firmly believed that the timeless philosophy and vivid experiences of these historical giants could be the most powerful antidote to the mental health crises we face today. 'Giants Wisdom' is not just a biographical encyclopedia. It is a mentoring sanctuary transcending time and space, where you can always come to lean on when your heart is weary.</p>
                <p>Moving forward, this platform will evolve into a steadfast mental mentor for people all around the world. When you are crushed by the weight of life and lose your way, Einstein's cheerful advice, Lincoln's silent comfort, and Marcus Aurelius's unyielding philosophy will raise your spirit once again. We are never truly alone. Countless giants have already walked the path you are on, and now they are here to hold your hand. I am cheering for your brilliant tomorrow with all my heart.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
