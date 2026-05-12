"use client"

import { Brain, Clock, MessageCircle, Sparkles, BookOpen, Users } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Conversations",
    description: "Engage in meaningful dialogue with historical figures through advanced AI technology.",
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Clock,
    title: "Centuries of Wisdom",
    description: "Access knowledge spanning over 2,500 years of human history and achievement.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: BookOpen,
    title: "Educational Excellence",
    description: "Learn philosophy, science, art, and more directly from the masters themselves.",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: MessageCircle,
    title: "Interactive Learning",
    description: "Ask questions, explore ideas, and receive personalized insights and guidance.",
    color: "from-purple-500/20 to-pink-500/20"
  },
]

const stats = [
  { value: "40+", label: "Historical Figures", icon: Users },
  { value: "2,500+", label: "Years of History", icon: Clock },
  { value: "12", label: "Fields of Study", icon: BookOpen },
  { value: "∞", label: "Conversations", icon: MessageCircle },
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
              Why Journey With Us
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience a new way of learning that bridges millennia of human achievement.
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
