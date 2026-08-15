
"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, ChevronLeft, History, Dna, BrainCircuit, ShieldCheck } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { questions, archetypes, type Dimension, type Pillar } from "@/data/heritage-test"
import { giants } from "@/lib/giants-data"

export default function HeritageTestPage() {
  const t = useTranslations("Test")
  const locale = useLocale()
  const activeLocale = (locale === 'ko' ? 'ko' : 'en') as 'ko' | 'en';
  const router = useRouter()
  
  const [step, setStep] = useState<'intro' | 'questions' | 'analyzing' | 'adBreak'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Dimension>>({})
  const [progress, setProgress] = useState(0)

  // Current stage logic (5 questions per stage)
  const currentStage = Math.floor(currentQuestionIndex / 5) + 1

  useEffect(() => {
    // Progress within the current stage (0-100%)
    const stageProgress = ((currentQuestionIndex % 5) / 5) * 100
    setProgress(stageProgress)
  }, [currentQuestionIndex])

  const handleStart = () => {
    setStep('questions')
  }

  const handleAnswer = (value: Dimension) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: value }
    setAnswers(newAnswers)

    if (currentQuestionIndex === 4 || currentQuestionIndex === 9) {
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
    try {
      console.log("[Test] Starting calculation with answers:", finalAnswers);
      
      // Count dimensions for each pillar with explicit initialization
      const scores: Record<Pillar, Record<string, number>> = {
        Scope: { L: 0, S: 0 },
        Drive: { R: 0, P: 0 },
        Method: { D: 0, H: 0 },
        Origin: { I: 0, T: 0 }
      }

      questions.forEach(q => {
        const val = finalAnswers[q.id]
        if (val) {
          // Robust check: Ensure the value exists in the pillar's score map
          if (scores[q.pillar] && typeof scores[q.pillar][val] !== 'undefined') {
            scores[q.pillar][val]++
          } else {
            console.warn(`[Test] Invalid dimension ${val} for pillar ${q.pillar} in question ${q.id}`);
          }
        }
      })

      // Determine DNA Code
      const dna = [
        scores.Scope.L >= scores.Scope.S ? 'L' : 'S',
        scores.Drive.R >= scores.Drive.P ? 'R' : 'P',
        scores.Method.D >= scores.Method.H ? 'D' : 'H',
        scores.Origin.I >= scores.Origin.T ? 'I' : 'T'
      ].join('')

      console.log("[Test] Calculated DNA:", dna);

      // Find matching giants
      const matchingGiants = giants.filter(g => g.dnaCode === dna)
      
      // Pick a random giant from the matching ones (or fallback)
      const matchedGiant = matchingGiants.length > 0 
        ? matchingGiants[Math.floor(Math.random() * matchingGiants.length)]
        : giants[Math.floor(Math.random() * giants.length)]

      if (!matchedGiant) {
        throw new Error("No giants found in the database");
      }

      console.log("[Test] Matched Giant:", matchedGiant.name, matchedGiant.slug);

      // Artificial delay for "analyzing" feel
      setTimeout(() => {
        const targetPath = `/giant/${matchedGiant.slug}?mode=match&dna=${dna}`;
        console.log("[Test] Redirecting to:", targetPath);
        router.push(targetPath as any);
      }, 3000)

    } catch (err) {
      console.error("[Test Calculation Error]:", err);
      // Fallback: if everything fails, at least redirect to a default or show error
      setTimeout(() => {
        router.push(`/${locale}/about`); // Safe fallback
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden" style={{ background: "var(--rd-bg-base)" }}>
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      </div>

      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <m.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border rd-hairline rd-accent text-sm font-medium mb-4" style={{ background: "var(--rd-divider-faint)" }}>
                <Sparkles className="w-4 h-4" />
                <span>The Heritage DNA Test</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold rd-text-ink leading-tight">
                {t("title").split("<br />").map((line, i) => (
                  <span key={i}>
                    {line.includes("위대한 유산") || line.includes("Great Legacy") ? (
                      <span className="rd-accent">{line}</span>
                    ) : line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>
              
              <p className="rd-lede max-w-lg mx-auto">
                {t("subtitle")}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
                {[
                  { icon: History, label: "15 Situations" },
                  { icon: Dna, label: "Heritage DNA" },
                  { icon: BrainCircuit, label: "Soul Analysis" },
                  { icon: ShieldCheck, label: `${giants.length}+ Giants` }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rd-surface" style={{ borderRadius: "var(--rd-card-radius)" }}>
                    <item.icon className="w-6 h-6 rd-accent" />
                    <span className="rd-caption font-bold">{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="group relative px-8 py-4 rd-bg-accent border font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto"
                style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
              >
                {t("start")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </m.div>
          )}

          {step === 'questions' && (
            <m.div
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
                    className="flex items-center gap-2 text-sm rd-text-body hover:opacity-80 transition-opacity"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t("back")}
                  </button>
                  <span className="text-sm font-medium rd-accent">
                    {t(`stages.stage${currentStage}`)} | {(currentQuestionIndex % 5) + 1} / 5
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--rd-divider-faint)" }}>
                  <m.div 
                    className="h-full" style={{ background: "var(--rd-accent-brown)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </div>

              {/* Question Content */}
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold rd-text-ink leading-snug">
                  {questions[currentQuestionIndex].text[activeLocale]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(questions[currentQuestionIndex].options[opt].value)}
                      className="group relative w-full p-6 text-left rd-surface hover:opacity-90 transition-opacity h-full flex flex-col justify-center"
                      style={{ borderRadius: "var(--rd-card-radius)", transitionDuration: "120ms" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 rd-accent" style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}>
                          {opt}
                        </div>
                        <span className="text-sm md:text-base rd-text-body leading-snug">
                          {questions[currentQuestionIndex].options[opt].text[activeLocale]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </m.div>
          )}

          {step === 'adBreak' && (
            <m.div
              key="adBreak"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8 py-12"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 rd-accent" style={{ background: "var(--rd-divider-faint)" }}>
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif font-bold rd-text-ink">
                  {t("stages.cleared", { stage: currentStage })}
                </h2>
                <p className="rd-lede">
                  {t("stages.ready")}
                </p>
              </div>

              <button
                onClick={handleNextStage}
                className="group relative px-8 py-4 rd-bg-accent border font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto"
                style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
              >
                {t("stages.next")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </m.div>
          )}

          {step === 'analyzing' && (
            <m.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-12 py-20"
            >
              <div className="relative w-40 h-40 mx-auto">
                <m.div
                  className="absolute inset-0 rounded-full" style={{ border: "4px solid var(--rd-divider-faint)" }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <m.div
                  className="absolute inset-4 rounded-full" style={{ border: "4px solid var(--rd-border)", borderTopColor: "var(--rd-accent-brown)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dna className="w-12 h-12 rd-accent" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold rd-text-ink">
                  {t("analysis.loading")}
                </h2>
                <p className="rd-text-body">
                  {t("analysis.sub")}
                </p>
              </div>

              <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
                {['SCOPE', 'DRIVE', 'METHOD', 'SOURCE'].map((label, i) => (
                  <div key={label} className="space-y-2">
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--rd-divider-faint)" }}>
                      <m.div 
                        className="h-full" style={{ background: "var(--rd-accent-brown)" }}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: i * 0.5, duration: 0.5 }}
                      />
                    </div>
                    <span className="rd-caption font-bold">{label}</span>
                  </div>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
