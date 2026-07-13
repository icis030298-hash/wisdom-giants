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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-400 mb-8">
            {locale === 'ko' ? '500명의 삶을 컴파일하며 발견한 것: 시련을 넘어선 위대한 지혜' : 'What I Discovered Compiling 500 Lives: Great Wisdom Beyond Trials'}
          </h1>
          <div className="prose prose-invert prose-amber max-w-none font-light leading-relaxed space-y-6">
            {locale === 'ko' ? (
              <>
                <p>지난 몇 달간, 500명에 달하는 역사적 거인들의 삶을 24개 언어의 데이터베이스로 구축하는 거대한 파이프라인과 씨름했다. 런타임 에러, 85MB가 넘는 방대한 JSON 데이터 파싱, 그리고 수없이 마주했던 서버 배포 실패까지. 모니터 앞에서의 시간은 끝없는 문제 해결의 연속이었다.</p>
                <p>하지만 밤을 새워가며 그들의 trials(시련)와 overcoming(극복) 필드에 쌓인 데이터의 오염을 걷어내고 정제하던 어느 새벽, 나는 모니터에 떠오른 것이 단순한 문자열이 아니라 치열하게 살아낸 인간의 궤적이라는 사실을 깨달았다.</p>
                <p>존 F. 케네디의 데이터를 교정할 때였다. 그의 시련(Trials) 필드에는 '쿠바 미사일 위기'라는 단어가 새겨져 있었다. 핵전쟁의 시곗바늘이 자정을 향해 가던 13일간의 피 말리는 압박감. 전 세계의 운명이 자신의 결정 하나에 달려있던 그 숨 막히는 고립감 속에서도, 그는 이성을 잃지 않는 서늘한 결단력으로 기어이 평화를 끌어냈다.</p>
                <p>세종대왕의 서사를 빚어낼 때는 숙연해지기까지 했다. 한글 창제는 그저 위대한 문화적 업적이 아니었다. 그것은 기득권 세력의 맹렬한 반대와 서서히 시력을 잃어가는 육체적 고통 속에서 홀로 싸워야 했던 고독한 투쟁이었다. 그럼에도 불구하고 백성의 눈을 뜨게 하겠다는 굽히지 않는 애민정신으로 기어이 세상에 없던 빛을 만들어낸 그의 기록은, 시대를 관통하는 묵직한 울림을 주었다.</p>
                <p>이 거대한 시스템을 설계하며 분명하게 깨달은 것이 있다. 역사를 바꾼 500명의 거인 중 단 한 명도 처음부터 완벽하지 않았다는 사실이다. 그들은 매일 우리와 똑같이 절망하고, 고립되었으며, 앞이 보이지 않는 뼈아픈 시련을 겪었다. 내가 시스템의 얽힌 버그를 잡기 위해 고군분투하듯, 그들 역시 자신의 시대가 던진 벅찬 에러(Error)들을 온몸으로 디버깅(Debugging)하며 앞으로 나아갔던 평범하고도 위대한 사람들이었다.</p>
                <p>Giants Wisdom은 딱딱하고 지루한 역사 사전이 아니다. 24개국의 언어로 500명의 멘토를 현실의 모니터 앞으로 호출해, 오늘날 우리가 직면한 삶의 벽 앞에서 어떻게 나아가야 할지 묻고 답을 얻는 디지털 살롱이다.</p>
                <p>오늘 당신이 마주한 막막한 문제의 해답 역시, 이 거대한 시련과 극복의 데이터베이스 어딘가에 반드시 숨어있을 것이라 확신한다.</p>
                <p className="text-right font-serif text-amber-500 mt-8">- Giants Wisdom Architect</p>
              </>
            ) : (
              <>
                <p>For the past few months, I wrestled with a massive pipeline building a database of the lives of nearly 500 historical giants in 24 languages. Runtime errors, parsing over 85MB of massive JSON data, and countless server deployment failures—my time in front of the monitor was a never-ending series of problem-solving.</p>
                <p>However, one dawn, while staying up all night purifying the polluted data accumulated in their 'trials' and 'overcoming' fields, I realized that what appeared on the monitor were not mere strings of text, but the trajectories of humans who lived fiercely.</p>
                <p>It happened when I was correcting John F. Kennedy's data. The words "Cuban Missile Crisis" were engraved in his Trials field. The blood-drying pressure of 13 days when the hands of the nuclear clock ticked towards midnight. Even in that suffocating isolation where the fate of the entire world depended on his single decision, he managed to draw out peace with a cold determination without losing his reason.</p>
                <p>When crafting the narrative of King Sejong the Great, I even felt solemn. The creation of Hangul was not just a great cultural achievement. It was a lonely struggle that had to be fought alone amidst fierce opposition from vested interests and the physical agony of gradually losing his eyesight. Nevertheless, his record of ultimately creating a light that did not exist in the world with his unyielding love for the people to open their eyes, delivered a heavy resonance that pierces through the ages.</p>
                <p>Designing this massive system, I realized one thing clearly. Not a single one of the 500 giants who changed history was perfect from the beginning. They despaired every day just like us, were isolated, and suffered agonizing trials where they couldn't see the way forward. Just as I struggled to catch tangled bugs in the system, they too were ordinary yet great people who moved forward by debugging the overwhelming 'Errors' thrown at them by their era with their entire beings.</p>
                <p>Giants Wisdom is not a stiff and boring history dictionary. It is a digital salon that summons 500 mentors in 24 languages in front of your real-world monitor, to ask and get answers on how to move forward when faced with the walls of life today.</p>
                <p>I am absolutely certain that the answer to the daunting problem you face today is also hidden somewhere in this massive database of trials and overcoming.</p>
                <p className="text-right font-serif text-amber-500 mt-8">- Giants Wisdom Architect</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
