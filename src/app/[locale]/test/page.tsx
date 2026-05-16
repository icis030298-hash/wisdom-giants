
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, ChevronLeft, History, Dna, BrainCircuit, ShieldCheck } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { questions, archetypes, type Dimension, type Pillar } from "@/data/heritage-test"
import { giants } from "@/lib/giants-data"
import AdSpace from "@/components/AdSpace"

export default function HeritageTestPage() {
  const t = useTranslations("Test")
  const locale = useLocale()
  const router = useRouter()
  
  const [step, setStep] = useState<'intro' | 'questions' | 'analyzing' | 'adBreak'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Dimension>>({})
  const [progress, setProgress] = useState(0)

  // Current stage logic (10 questions per stage)
  const currentStage = Math.floor(currentQuestionIndex / 10) + 1

  useEffect(() => {
    // Progress within the current stage (0-100%)
    const stageProgress = ((currentQuestionIndex % 10) / 10) * 100
    setProgress(stageProgress)
  }, [currentQuestionIndex])

  const handleStart = () => {
    setStep('questions')
  }

  const handleAnswer = (value: Dimension) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: value }
    setAnswers(newAnswers)

    if (currentQuestionIndex === 9 || currentQuestionIndex === 19) {
      setStep('adBreak')
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setStep('analyzing')
      calculateAndRedirect(newAnswers)
    }
  }

  const handleNextStage = () => {
    setCurrentQuestionIndex(prev => prev + 1)
    setStep('questions')
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else {
      setStep('intro')
    }
  }

  const calculateAndRedirect = (finalAnswers: Record<number, Dimension>) => {
    // Count dimensions for each pillar
    const scores: Record<Pillar, Record<string, number>> = {
      Scope: { L: 0, S: 0 },
      Drive: { R: 0, P: 0 },
      Method: { D: 0, H: 0 },
      Origin: { I: 0, T: 0 }
    }

    questions.forEach(q => {
      const val = finalAnswers[q.id]
      if (val) {
        scores[q.pillar][val]++
      }
    })

    // Determine DNA Code
    const dna = [
      scores.Scope.L >= scores.Scope.S ? 'L' : 'S',
      scores.Drive.R >= scores.Drive.P ? 'R' : 'P',
      scores.Method.D >= scores.Method.H ? 'D' : 'H',
      scores.Origin.I >= scores.Origin.T ? 'I' : 'T'
    ].join('')

    // Find all giants with this DNA
    const matchingGiants = giants.filter(g => g.dnaCode === dna)
    
    // Pick a random giant from the matching ones (or fallback to any if none, which shouldn't happen)
    const matchedGiant = matchingGiants.length > 0 
      ? matchingGiants[Math.floor(Math.random() * matchingGiants.length)]
      : giants[Math.floor(Math.random() * giants.length)]

    // Artificial delay for "analyzing" feel
    setTimeout(() => {
      router.push(`/${locale}/giant/${matchedGiant.slug}?mode=match&dna=${dna}`)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>The Heritage DNA Test</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                {t("title").split("<br />").map((line, i) => (
                  <span key={i}>
                    {line.includes("위대한 유산") || line.includes("Great Legacy") ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{line}</span>
                    ) : line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                {t("subtitle")}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
                {[
                  { icon: History, label: "30 Situations" },
                  { icon: Dna, label: "Heritage DNA" },
                  { icon: BrainCircuit, label: "Soul Analysis" },
                  { icon: ShieldCheck, label: "100 Giants" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border border-white/5">
                    <item.icon className="w-6 h-6 text-amber-500/60" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-primary-foreground font-bold text-lg shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              >
                {t("start")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              {/* Progress Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t("back")}
                  </button>
                  <span className="text-sm font-medium text-amber-500/80">
                    {t(`stages.stage${currentStage}`)} | {(currentQuestionIndex % 10) + 1} / 10
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </div>

              {/* Question Content */}
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-snug">
                  {questions[currentQuestionIndex].text[locale as 'ko' | 'en']}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(questions[currentQuestionIndex].options[opt].value)}
                      className="group relative w-full p-6 text-left glass-card rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all hover:bg-amber-500/5 h-full flex flex-col justify-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors shrink-0">
                          {opt}
                        </div>
                        <span className="text-sm md:text-base text-foreground group-hover:text-amber-100 transition-colors leading-snug">
                          {questions[currentQuestionIndex].options[opt].text[locale as 'ko' | 'en']}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'adBreak' && (
            <motion.div
              key="adBreak"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8 py-12"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  {t("stages.cleared", { stage: currentStage })}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {t("stages.ready")}
                </p>
              </div>

              <AdSpace slot="mid-test-banner" label="SPONSORED CONTENT" />

              <button
                onClick={handleNextStage}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-primary-foreground font-bold text-lg shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              >
                {t("stages.next")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-12 py-20"
            >
              <div className="relative w-40 h-40 mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-amber-500/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-4 border-amber-500/40 border-t-amber-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dna className="w-12 h-12 text-amber-400" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  {t("analysis.loading")}
                </h2>
                <p className="text-muted-foreground animate-pulse">
                  {t("analysis.sub")}
                </p>
              </div>

              <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
                {['SCOPE', 'DRIVE', 'METHOD', 'SOURCE'].map((label, i) => (
                  <div key={label} className="space-y-2">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: i * 0.5, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[8px] text-muted-foreground font-bold tracking-tighter uppercase">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
