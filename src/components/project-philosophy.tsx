"use client"

import { useLocale } from "next-intl"
import { BookOpen, Compass, Cpu, Landmark, ShieldCheck } from "lucide-react"

export function ProjectPhilosophy() {
  const locale = useLocale()
  const isKo = locale === "ko"

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-white/5 bg-slate-950/40 relative z-10">
      {isKo ? (
        <div className="space-y-12 animate-fade-in text-slate-300">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Landmark className="w-3.5 h-3.5" />
              철학적 탐구와 기술적 혁신
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-amber-200 to-slate-200 tracking-tight leading-tight">
              인류의 위대한 거인들과 나누는 지혜의 대화
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Giants Wisdom은 역사 속의 위대한 선각자들의 지혜를 현대적인 인공지능(AI) 멀티에이전트 기술과 융합하여, 시공간을 초월한 깊이 있는 인문학적 토론과 대화를 제공하는 글로벌 에듀테크 플랫폼입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {/* Mission Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">1. 프로젝트의 탄생 배경과 인문학적 사명</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                현대 사회는 정보의 과잉과 극단적인 주의력 파편화 시대를 겪고 있습니다. 우리는 매일 수많은 뉴스와 알고리즘에 노출되지만, 복잡한 삶의 본질적인 질문들에 대해 깊이 있게 고찰할 기회는 점점 줄어들고 있습니다. &ldquo;돈으로 행복을 살 수 있을까?&rdquo;, &ldquo;개인의 자유는 어디까지 보장되어야 하는가?&rdquo;와 같은 철학적 아젠다는 인류 역사상 수많은 천재들이 일생을 바쳐 탐구했던 핵심 논제들입니다.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                Giants Wisdom은 이러한 깊은 질문들에 대해, 소크라테스, 니체, 아리스토텔레스, 아우렐리우스 등 101명의 역사적 거인들의 목소리를 빌려 직접 소통하고 탐색할 수 있는 가상 포럼을 제공합니다. 이는 단순한 단답형 질문 검색이 아닌, 역사적 인물들이 지녔던 철학적 사상과 가치관, 고유한 어법과 문체를 바탕으로 가상 공간에서 실시간 끝장 토론과 1:1 대화를 전개함으로써 사용자가 능동적으로 지혜를 터득하도록 돕는 인문학 복원 프로젝트입니다.
              </p>
            </div>

            {/* Architecture Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">2. AI 멀티에이전트 및 대화형 협업 엔진</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                이 가상 토론장을 구동하기 위해 우리는 구글 제미나이 2.5 플래시 라이트(Gemini 2.5 Flash-Lite)와 제미나이 2.5 플래시(Gemini 2.5 Flash) API를 극대화한 독창적인 멀티에이전트 오케스트레이션 아키텍처를 도입하였습니다. 각 위인은 하나의 독립적인 지능형 에이전트로 정의되며, 방대하게 구축된 위인의 저작, 일대기, 역사적 성취 등의 고정 정적 마스터 지식 데이터베이스(Giants Master Database)를 실시간으로 참조합니다.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                토론방이 활성화되면 에이전트들은 상대 위인의 반론을 정교하게 분석하고, 자신의 핵심 사상적 근거를 유지하면서 설득력 있는 주장을 정교하게 스트리밍합니다. 특히, 토론 과정에서 발생할 수 있는 서버 트래픽과 누적 토큰 비용을 최소화하기 위해 프롬프트의 접두사 캐싱(Prefix Caching)을 극대화하였으며, 다자간 라운드로빈 토론 연산 구조를 완벽히 구현하여 실제 대학 강단이나 고전 포럼에서 벌어지는 격렬한 논쟁과 유사한 최고 수준의 퀄리티를 유지합니다.
              </p>
            </div>

            {/* Quality Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">3. 엄격한 역사 복원과 다국어 지원 체계</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                우리는 역사적 사실의 왜곡(Hallucination)을 차단하고 신뢰할 수 있는 사용자 환경을 만들기 위해, 위인의 사상을 정의할 때 각 분야 역사학자들의 공인된 저서와 학술 논문 정보를 기반으로 지식 구조를 설계하였습니다. 이를 통해 사용자는 역사와 철학, 과학과 경제 등 다학제적 지식을 입체적으로 학습할 수 있으며, 교과서 너머의 고전적 통찰을 실감 나게 경험할 수 있습니다.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                또한 글로벌 사용자를 위해 한국어, 영어, 스페인어, 독일어, 이탈리아어, 포르투갈어 등 주요 다국어를 지원합니다. Next-Intl 다국어 라우팅을 기반으로 모든 위인의 명언과 프로필 정보가 원어민 수준의 자연스러운 번역과 로컬라이징으로 구현되며, 전 세계 어떠한 학습자도 지리적, 언어적 장벽 없이 현대 인류 문명의 기초가 된 고전 철학에 무제한 접근할 수 있도록 돕습니다.
              </p>
            </div>

            {/* Compliance Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">4. 구글 게시자 정책 및 건전한 생태계 준수</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                Giants Wisdom은 깨끗하고 안전한 디지털 미디어 생태계를 만들기 위해 구글 게시자 정책(Google Publisher Policies) 및 구글 게시자 제한사항을 엄격하게 수용하고 준수합니다. 우리는 불법적인 위조품 판매, 지적 재산권 침해(DMCA), 증오 표현이나 비하 등 위험하고 경멸적인 콘텐츠를 생산하는 행위를 원천적으로 통제 및 차단하고 있습니다.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                사용자의 소중한 개인정보(IP 주소, 기기 및 쿠키 식별자 등)를 보호하고 안전한 브라우징 경험을 보장하기 위해 강력한 보안 인증 메커니즘을 상시 구축하였으며, 최종 사용자가 언제든 수집되는 데이터 방침을 명확히 알 수 있도록 투명한 개인정보처리방침(/privacy)과 이용약관(/terms)을 최하단 푸터에 상시 제공합니다. 유용한 정적 텍스트와 풍부한 기능성 콘텐츠를 적절히 조화시켜, 학술적 가치와 상업적 안전성을 동시에 충족하는 프리미엄 웹 플랫폼이 되고자 끊임없이 노력하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-fade-in text-slate-300">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Landmark className="w-3.5 h-3.5" />
              Philosophical Inquiry & Tech Innovation
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-amber-200 to-slate-200 tracking-tight leading-tight">
              Dialogue with the Great Minds of Humanity
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Giants Wisdom is a premium global edutech platform that merges the profound teachings of historical pioneers with cutting-edge artificial intelligence, facilitating timeless intellectual debates and personalized interactive learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {/* Mission Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">1. Contextual Heritage and Humanistic Mission</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                Modern society experiences a massive overload of information accompanied by severe fragmentation of attention. We are constantly exposed to rapid-fire algorithmic snippets, leaving virtually no room to contemplate fundamental questions of human life. Inquiries such as &ldquo;Does wealth equate to happiness?&rdquo; or &ldquo;How should individual liberty be balanced with societal order?&rdquo; are core intellectual questions that historical geniuses spent lifetimes investigating.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                Giants Wisdom resolves this gap by engineering virtual debate chambers and conversational rooms featuring 101 historical luminaries, including Socrates, Friedrich Nietzsche, Aristotle, and Marcus Aurelius. This is not a simple, single-turn query search. Instead, users can experience real-time debates and direct dialogue powered by the verified philosophies, writing styles, and personal tones of historical pioneers, encouraging active participation and intellectual critical thinking.
              </p>
            </div>

            {/* Architecture Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">2. AI Multi-Agent Orchestration & Caching Engine</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                To power this real-time debate arena, we designed a customized multi-agent orchestration architecture leveraging the Google Gemini 2.5 Flash-Lite and Gemini 2.5 Flash API frameworks. Each individual giant is modeled as an autonomous intelligent agent referencing high-fidelity master knowledge bases containing their compiled historical works, core literature, biographic journals, and intellectual biases.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                When a debate starts, these virtual minds critically process preceding turns, maintain stable logical frameworks, and deliver structured text streams. To minimize network traffic and transaction token load, we heavily optimize prefix prompt caching within our API backend, structuring sequential multi-agent debate flows that faithfully replicate rigorous high-level academic discussions and ancient philosophical symposia with zero structural latency.
              </p>
            </div>

            {/* Quality Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">3. Rigorous Curation & Global Language Accessibility</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                We mitigate logical hallucinations and safeguard intellectual accuracy by curating each giant's mental parameters using certified peer-reviewed biographies and authoritative historical publications. This ensures students and lifelong learners can absorb accurate multi-disciplinary insights spanning philosophy, historical sciences, statecraft, and economics.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                Our architecture provides full native support for multiple languages including Korean, English, Spanish, German, Italian, and Portuguese. Enabled by the Next-Intl dynamic routing system, we ensure all profile records, quotes, and real-time outputs undergo native localization, allowing learners worldwide to access foundational classical philosophies without encountering cultural or geographic barriers.
              </p>
            </div>

            {/* Compliance Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-amber-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">4. Adherence to Google Publisher Policies</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                Giants Wisdom strictly follows all Google Publisher Policies and publisher restrictions to maintain a highly secure, constructive, and valuable digital ecosystem. We employ solid server filters that completely restrict copyright infringement, dangerous/derogatory content, intellectual property abuse, or misleading representations.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-justify">
                To guarantee absolute user privacy and secure browsing, we implement secure data transit paths and clearly detail our cookies, web beacons, and data sharing protocols in our comprehensive Privacy Policy (/privacy) and Terms of Service (/terms) accessible in the global site footer. Combining highly valuable, editorially dense, and stable functional layouts, we deliver an outstanding educational product built for modern scholarly exploration.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
