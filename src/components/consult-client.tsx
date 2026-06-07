"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "@/i18n/routing"
import { PROBLEM_CATEGORIES } from "@/data/problems"
import { PROBLEM_GIANT_MAP } from "@/data/problem-giant-map"
import { giantsData } from "@/data/giants"
import { useTranslations } from "next-intl"
import { ArrowLeft, MessageSquare, Sparkles, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ConsultClientProps {
  locale: string
}

function GiantAvatar({ slug, name }: { slug: string; name: string }) {
  const [imgError, setImgError] = useState(false)
  const initials = /[a-zA-Z]/.test(name)
    ? name
        .split(' ')
        .map(w => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : name.substring(0, 2);
  
  if (imgError) {
    return (
      <div className="w-20 h-20 rounded-full bg-amber-900 flex items-center justify-center text-amber-400 font-bold text-xl mb-3 shadow-lg group-hover:scale-105 transition-transform duration-500">
        {initials}
      </div>
    )
  }
  
  return (
    <img
      src={`/images/giants/${slug}.jpg`}
      alt={name}
      onError={() => setImgError(true)}
      className="w-20 h-20 rounded-full object-cover mb-3 border border-amber-500/20 shadow-lg group-hover:scale-105 transition-transform duration-500"
    />
  )
}

const getDisplayName = (fullName: string): string => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    const prev = parts[parts.length - 2].toLowerCase();
    const prefixes = ["다", "반", "de", "da", "von", "van", "del", "di"];
    if (prefixes.includes(prev)) {
      return `${parts[parts.length - 2]} ${last}`;
    }
    return last;
  }
  return fullName;
};

const getKoreanParticle = (name: string, type: '이가' | '과와' | '은는' | '을를'): string => {
  if (!name) return "";
  const lastChar = name.charCodeAt(name.length - 1);
  if (lastChar >= 0xAC00 && lastChar <= 0xD7A3) {
    const hasBatchim = (lastChar - 0xAC00) % 28 > 0;
    if (type === '이가') return hasBatchim ? '이' : '가';
    if (type === '과와') return hasBatchim ? '과' : '와';
    if (type === '은는') return hasBatchim ? '은' : '는';
    if (type === '을를') return hasBatchim ? '을' : '를';
  }
  return type === '이가' ? '이(가)' : type === '과와' ? '과(와)' : '';
};

const getChatButtonText = (fullName: string, locale: string): string => {
  const name = getDisplayName(fullName);
  switch (locale) {
    case 'ko':
      return `${name}${getKoreanParticle(name, '과와')} 대화하기`;
    case 'de':
      return `Mit ${name} sprechen`;
    case 'ja':
      return `${name}と対話する`;
    case 'es':
      return `Conversar con ${name}`;
    case 'fr':
      return `Discuter avec ${name}`;
    case 'it':
      return `Parla con ${name}`;
    case 'pt':
      return `Conversar com ${name}`;
    default:
      return `Talk with ${name}`;
  }
};

const getEpicButtonText = (fullName: string, locale: string): string => {
  const name = getDisplayName(fullName);
  switch (locale) {
    case 'ko':
      return `${name}의 서사시 보러 가기`;
    case 'de':
      return `${name}s Epos lesen`;
    case 'ja':
      return `${name}の物語を読む`;
    case 'es':
      return `Leer la epopeya de ${name}`;
    case 'fr':
      return `Lire l'épopée de ${name}`;
    case 'it':
      return `Leggi l'epopea di ${name}`;
    case 'pt':
      return `Ler a epopeia de ${name}`;
    default:
      return `Read ${name}'s Epic`;
  }
};

const tMap: Record<string, any> = {
  ko: {
    title: "오늘 어떤 어려움이 있나요?",
    subtitle: "당신의 고통은 혼자가 아닙니다",
    back: "다시 선택하기",
    notAlone: "당신만 겪는 것이 아닙니다",
    overcoming: "역사상 가장 위대한 사람들도 같은 고통을 겪었고 이겨냈습니다",
    sufferedTogether: "이 분도 같은 고통을 겪었습니다",
    chatWith: "이 분과 대화하기",
    era: "시대"
  },
  en: {
    title: "What difficulties are you facing today?",
    subtitle: "Your pain is not lonely",
    back: "Select Again",
    notAlone: "You are not the only one",
    overcoming: "The greatest minds in history faced the exact same struggles and overcame them",
    sufferedTogether: "This giant faced the same pain too",
    chatWith: "Talk with this Giant",
    era: "Era"
  },
  de: {
    title: "Welche Schwierigkeiten haben Sie heute?",
    subtitle: "Ihr Schmerz ist nicht allein",
    back: "Zurück zur Auswahl",
    notAlone: "Sie sind nicht allein damit",
    overcoming: "Die größten Denker der Geschichte standen vor denselben Sorgen und haben sie überstanden",
    sufferedTogether: "Auch dieser Riese stand vor demselben Schmerz",
    chatWith: "Mit diesem Denker sprechen",
    era: "Epoche"
  },
  ja: {
    title: "今日、どのようなお悩みがありますか？",
    subtitle: "あなたの苦しみは一人だけのものではありません",
    back: "選び直す",
    notAlone: "あなただけが悩んでいるのではありません",
    overcoming: "歴史上の偉人たちも同じように悩み、そして乗り越えてきました",
    sufferedTogether: "この偉人も同じ苦しみを経験しました",
    chatWith: "この方と対話する",
    era: "時代"
  },
  es: {
    title: "¿Qué dificultades enfrenta hoy?",
    subtitle: "Su dolor no es solitario",
    back: "Volver a elegir",
    notAlone: "No es el único que pasa por esto",
    overcoming: "Las mentes más grandes de la historia pasaron por lo mismo y lo superaron",
    sufferedTogether: "Este gigante también enfrentó el mismo dolor",
    chatWith: "Conversar con este Gigante",
    era: "Época"
  },
  fr: {
    title: "Quelles difficultés rencontrez-vous aujourd'hui ?",
    subtitle: "Votre souffrance n'est pas solitaire",
    back: "Choisir à nouveau",
    notAlone: "Vous n'êtes pas le seul",
    overcoming: "Les plus grands esprits de l'histoire ont connu les mêmes épreuves et les ont surmontées",
    sufferedTogether: "Ce géant a également connu la même douleur",
    chatWith: "Discuter avec ce Géant",
    era: "Époque"
  },
  it: {
    title: "Quali difficoltà stai affrontando oggi?",
    subtitle: "Il tuo dolore non è isolato",
    back: "Scegli di nuovo",
    notAlone: "Non sei l'unico a soffrire di questo",
    overcoming: "Le più grandi menti della storia hanno affrontato le stesse difficoltà e le hanno superate",
    sufferedTogether: "Anche questa figura storica ha affrontato lo stesso dolore",
    chatWith: "Parla con questa Figura",
    era: "Epoca"
  },
  pt: {
    title: "Quais dificuldades você está enfrentando hoje?",
    subtitle: "Sua dor não é solitária",
    back: "Escolher novamente",
    notAlone: "Você não é o único",
    overcoming: "As maiores mentes da história enfrentaram exatamente os mesmos problemas e os superaram",
    sufferedTogether: "Este gigante também enfrentou a mesma dor",
    chatWith: "Conversar com este Gigante",
    era: "Época"
  }
};

export function ConsultClient({ locale }: ConsultClientProps) {
  const router = useRouter()
  const tg = useTranslations("Giants")
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  
  const activeLocale = (locale === 'ko' || locale === 'en' || locale === 'de' || locale === 'ja' || locale === 'es' || locale === 'fr' || locale === 'it' || locale === 'pt') ? locale : 'en';
  const labels = tMap[activeLocale] || tMap['en'];

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id)
  }

  const handleGoBack = () => {
    setSelectedProblemId(null)
  }

  const handleStartConsult = (slug: string) => {
    if (!selectedProblemId) return;
    router.push(`/giant/${slug}?problem=${selectedProblemId}`);
  }

  const handleGoToEpic = (slug: string) => {
    router.push(`/giant/${slug}`);
  }

  const selectedProblem = PROBLEM_CATEGORIES.find(p => p.id === selectedProblemId)
  const matchedGiantsRaw = selectedProblemId ? (PROBLEM_GIANT_MAP as any)[selectedProblemId] || [] : []

  // Gather matched giants data
  const matchedGiants = matchedGiantsRaw.map((mg: any) => {
    const info = giantsData.find(g => g.slug === mg.slug)
    const name = tg(`${mg.slug}.name`) || info?.name || mg.slug
    const era = tg(`${mg.slug}.era`) || info?.era || ""
    const imageUrl = info?.imageUrl || `/images/giants/${mg.slug}.jpg`
    const color = info?.era ? "from-amber-500/10 to-orange-500/10" : "from-stone-900 to-stone-800"
    
    return {
      ...mg,
      name,
      era,
      imageUrl,
      color
    }
  })

  return (
    <div className="min-h-screen bg-stone-950 text-foreground relative overflow-hidden flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-stone-800/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-24 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!selectedProblemId ? (
            /* STAGE 1: Problem Selection */
            <motion.div
              key="stage1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center justify-center"
            >
              <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }} 
                  className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                  {labels.title}
                </h1>
                <p className="text-stone-400 text-lg">
                  {labels.subtitle}
                </p>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto pt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {PROBLEM_CATEGORIES.map((problem) => {
                  const pTrans = problem.translations[activeLocale] || problem.translations['en'];
                  return (
                    <motion.button
                      key={problem.id}
                      onClick={() => handleSelectProblem(problem.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-stone-900/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-3xl p-8 text-left transition-all group cursor-pointer relative overflow-hidden backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        {problem.emoji}
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-amber-400 transition-colors font-serif">
                        {pTrans.title}
                      </h3>
                      <p className="text-stone-400 text-sm mb-1 leading-relaxed">
                        {pTrans.subtitle}
                      </p>
                      <p className="text-stone-600 text-xs leading-relaxed whitespace-pre-line group-hover:text-stone-500 transition-colors mt-2">
                        {pTrans.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* STAGE 2: Matched Giants */
            selectedProblem && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl mx-auto"
              >
                <button
                  onClick={handleGoBack}
                  className="group flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 text-sm font-semibold py-2 px-4 rounded-xl border border-stone-800 hover:border-amber-500/20 bg-stone-900/30 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>{labels.back}</span>
                </button>

                <div className="text-center mb-16 space-y-4">
                  <div className="text-6xl mb-4 filter drop-shadow-[0_6px_15px_rgba(0,0,0,0.6)]">
                    {selectedProblem.emoji}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white font-bold">
                    {selectedProblem.translations[activeLocale]?.title || selectedProblem.translations['en']?.title}
                  </h2>
                  <p className="text-amber-400/90 font-medium text-lg">
                    {labels.notAlone}
                  </p>
                  <p className="text-stone-400 max-w-xl mx-auto text-base">
                    {labels.overcoming}
                  </p>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto pt-2" />
                </div>

                <div className="space-y-6">
                  {matchedGiants.map((giant) => (
                    <motion.div
                      key={giant.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-stone-900/50 border border-stone-800 hover:border-white/[0.08] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative overflow-hidden group backdrop-blur-sm shadow-xl"
                    >
                      {/* Ambient background blur */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.01] rounded-full blur-[80px]" />
                      
                      {/* Giant Avatar & Details */}
                      <div className="flex flex-col items-center shrink-0 w-full md:w-36">
                        <GiantAvatar slug={giant.slug} name={giant.name} />
                        <p className="text-white font-serif font-bold text-lg text-center leading-tight">
                          {giant.name}
                        </p>
                        <p className="text-stone-500 text-xs text-center mt-1 truncate max-w-full">
                          {giant.era}
                        </p>
                      </div>

                      {/* Pain & Action Button */}
                      <div className="flex-1 flex flex-col justify-between h-full text-center md:text-left">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-center md:justify-start gap-2 text-stone-500 uppercase tracking-widest text-[10px] font-bold">
                            <AlertCircle className="w-3.5 h-3.5 text-stone-600" />
                            <span>{labels.sufferedTogether}</span>
                          </div>
                          <p className="text-stone-200 text-base leading-relaxed whitespace-pre-line font-serif italic pl-0 md:pl-2 border-l-0 md:border-l-2 border-amber-500/20 py-1">
                            &ldquo;{giant.historicalPain[activeLocale] || giant.historicalPain['en']}&rdquo;
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <button
                            onClick={() => handleStartConsult(giant.slug)}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3 rounded-2xl transition-all text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{getChatButtonText(giant.name, activeLocale)}</span>
                            <span className="text-[10px] opacity-70">→</span>
                          </button>
                          
                          <button
                            onClick={() => handleGoToEpic(giant.slug)}
                            className="border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300 font-bold px-6 py-3 rounded-2xl transition-all text-sm flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-amber-400/80" />
                            <span>{getEpicButtonText(giant.name, activeLocale)}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Footer copyright space */}
      <footer className="w-full py-8 text-center text-[10px] text-stone-600 uppercase tracking-widest pointer-events-none">
        © {new Date().getFullYear()} Giants Wisdom • Echoes of Wisdom
      </footer>
    </div>
  )
}
