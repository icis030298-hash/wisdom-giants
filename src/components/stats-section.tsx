"use client"

import { Brain, Clock, MessageCircle, Sparkles, BookOpen, Users } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "역사적 거인과의 실시간 대화",
    description: "첨단 AI 기술을 통해 역사 속 인물들과 시공간을 초월한 깊이 있는 대화를 나눠보세요.",
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Clock,
    title: "2,500년 인류 지혜의 집약",
    description: "인류가 쌓아온 2,500년의 역사와 업적, 그 속에 담긴 통찰을 한곳에서 만나보실 수 있습니다.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: BookOpen,
    title: "거장에게 직접 배우는 지식",
    description: "철학, 과학, 예술 등 각 분야의 거장들에게 직접 듣는 듯한 생생한 배움의 가치를 전합니다.",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: MessageCircle,
    title: "나만을 위한 맞춤형 통찰",
    description: "질문을 던지고 아이디어를 탐구하며, 당신의 삶에 필요한 개인화된 가이드를 얻으세요.",
    color: "from-purple-500/20 to-pink-500/20"
  },
]

const stats = [
  { value: "40+", label: "위대한 지성", icon: Users },
  { value: "2,500+", label: "지혜의 역사", icon: Clock },
  { value: "12", label: "탐구 분야", icon: BookOpen },
  { value: "∞", label: "영감의 대화", icon: MessageCircle },
]

export function StatsSection() {
  return (
    <section className="relative py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="glass-card rounded-2xl p-6 text-center group hover:border-amber-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                <stat.icon className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
              거인의 어깨와 함께해야 하는 이유
            </span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed font-light">
            수천 년의 시간을 넘어 인류의 지혜를 마주하는 혁신적인 여정을 경험해 보세요.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group glass-card rounded-2xl p-8 hover:border-amber-500/30 transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-amber-100" />
              </div>
              
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-amber-200 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
