"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { useRouter } from "@/i18n/routing"
import { PROBLEM_CATEGORIES } from "@/data/problems"
import { PROBLEM_GIANT_MAP } from "@/data/problem-giant-map"
import { useTranslations } from "next-intl"
import { ArrowLeft, MessageSquare, Sparkles, AlertCircle } from "lucide-react"

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
      <div className="w-20 h-20 rounded-full flex items-center justify-center rd-accent font-bold text-xl mb-3 border rd-hairline" style={{ background: "var(--rd-divider-faint)" }}>
        {initials}
      </div>
    )
  }
  
  return (
    <img
      src={`/images/giants/${slug}.jpg`}
      alt={name}
      onError={() => setImgError(true)}
      loading="lazy"
      className="rd-portrait w-20 h-20 rounded-full object-cover mb-3 border rd-hairline"
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
    era: "시대",
    customTitle: "나만의 고민 직접 털어놓기",
    customDesc: "역사상 거인들이 당신의 구체적인 상황에 맞는 지혜를 찾아줄 것입니다.",
    customPlaceholder: "이곳에 자네의 깊은 고민이나 상황을 적어보게 (최대 300자)...",
    customSubmit: "위인 매칭받기",
    analyzing: "분석 중...",
    customResultTitle: "나의 고민 매칭 결과",
    error: "매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    customResultDesc: "자네가 겪고 있는 아픔에 대해 깊은 공감과 지혜를 들려줄 세 명의 거인을 추천하네."
  },
  en: {
    title: "What difficulties are you facing today?",
    subtitle: "Your pain is not lonely",
    back: "Select Again",
    notAlone: "You are not the only one",
    overcoming: "The greatest minds in history faced the exact same struggles and overcame them",
    sufferedTogether: "This giant faced the same pain too",
    chatWith: "Talk with this Giant",
    era: "Era",
    customTitle: "Share Your Own Struggle",
    customDesc: "Historical giants will find wisdom tailored to your specific situation.",
    customPlaceholder: "Write down your specific struggles or worries here (max 300 chars)...",
    customSubmit: "Get Giant Match",
    analyzing: "Analyzing...",
    customResultTitle: "My Problem Match Results",
    error: "An error occurred during matching. Please try again later.",
    customResultDesc: "Three giants who can offer deep empathy and wisdom regarding your specific struggles."
  },
  de: {
    title: "Welche Schwierigkeiten haben Sie heute?",
    subtitle: "Ihr Schmerz ist nicht allein",
    back: "Zurück zur Auswahl",
    notAlone: "Sie sind nicht allein damit",
    overcoming: "Die größten Denker der Geschichte standen vor denselben Sorgen und haben sie überstanden",
    sufferedTogether: "Auch dieser Riese stand vor demselben Schmerz",
    chatWith: "Mit diesem Denker sprechen",
    era: "Epoche",
    customTitle: "Eigene Sorge teilen",
    customDesc: "Historische Riesen werden Weisheit finden, die auf Ihre Situation zugeschnitten ist.",
    customPlaceholder: "Schreiben Sie hier Ihre spezifischen Sorgen oder Ängste auf (max. 300 Zeichen)...",
    customSubmit: "Weisen finden",
    analyzing: "Analysieren...",
    customResultTitle: "Ergebnisse des Sorgen-Matchings",
    error: "Beim Abgleich ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
    customResultDesc: "Drei Riesen, die tiefes Mitgefühl und Weisheit für Ihre spezifischen Sorgen bieten können."
  },
  ja: {
    title: "今日、どのようなお悩みがありますか？",
    subtitle: "あなたの苦しみは一人だけのものではありません",
    back: "選び直す",
    notAlone: "あなただけが悩んでいるのではありません",
    overcoming: "歴史上の偉人たち도同じように悩み、そして乗り越えてきました",
    sufferedTogether: "この偉人も同じ苦しみを経験しました",
    chatWith: "この方と対話する",
    era: "時代",
    customTitle: "自分の悩みを直接打ち明ける",
    customDesc: "歴史上の偉人たちが、あなたの具体的な状況に合わせた知恵を見つけ出します。",
    customPlaceholder: "ここにあなたの具体的な悩みや不安を書いてください（最大300文字）...",
    customSubmit: "偉人をマッチングする",
    analyzing: "分析中...",
    customResultTitle: "悩みマッチング結果",
    error: "マッチング中にエラーが発生しました。後でもう一度お試しください。",
    customResultDesc: "あなたの具体的な悩みに対して、深い共感と知恵を提供できる3人の偉人を推薦します。"
  },
  es: {
    title: "¿Qué dificultades enfrenta hoy?",
    subtitle: "Su dolor no es solitario",
    back: "Volver a elegir",
    notAlone: "No es el único que pasa por esto",
    overcoming: "Las mentes más grandes de la historia pasaron por lo mismo y lo superaron",
    sufferedTogether: "Este gigante también enfrentó el mismo dolor",
    chatWith: "Conversar con este Gigante",
    era: "Época",
    customTitle: "Comparte tu propia dificultad",
    customDesc: "Los gigantes históricos encontrarán sabiduría adaptada a tu situación específica.",
    customPlaceholder: "Escribe aquí tus luchas o preocupaciones específicas (máx. 300 caracteres)...",
    customSubmit: "Buscar Coincidencia",
    analyzing: "Analizando...",
    customResultTitle: "Resultados de Coincidencia de Problemas",
    error: "Ocurrió un error durante la coincidencia. Por favor, inténtelo de nuevo más tarde.",
    customResultDesc: "Tres gigantes que pueden ofrecer profunda empatía y sabiduría sobre tus dificultades específicas."
  },
  fr: {
    title: "Quelles difficultés rencontrez-vous aujourd'hui ?",
    subtitle: "Votre souffrance n'est pas solitaire",
    back: "Choisir à nouveau",
    notAlone: "Vous n'êtes pas le seul",
    overcoming: "Les plus grands esprits de l'histoire ont connu les mêmes épreuves et les ont surmontées",
    sufferedTogether: "Ce géant a également connu la même douleur",
    chatWith: "Discuter avec ce Géant",
    era: "Époque",
    customTitle: "Partagez votre propre difficulté",
    customDesc: "Des géants historiques trouveront une sagesse adaptée à votre situation spécifique.",
    customPlaceholder: "Écrivez ici vos difficultés ou vos préoccupations spécifiques (max 300 caractères)...",
    customSubmit: "Trouver des Géants",
    analyzing: "Analyse en cours...",
    customResultTitle: "Résultats d'Appariement de Problèmes",
    error: "Une erreur s'est produite lors de la correspondance. Veuillez réessayer plus tard.",
    customResultDesc: "Trois géants qui peuvent offer une empathie profonde et de la sagesse concernant vos luttes spécifiques."
  },
  it: {
    title: "Quali difficoltà stai affrontando oggi?",
    subtitle: "Il tuo dolore non è isolato",
    back: "Scegli di nuovo",
    notAlone: "Non sei l'unico a soffrire di questo",
    overcoming: "Le più grandi menti della storia hanno affrontato le stesse difficoltà e le hanno superate",
    sufferedTogether: "Anche questa figura storica ha affrontato lo stesso dolore",
    chatWith: "Parla con questa Figura",
    era: "Epoca",
    customTitle: "Condividi la tua difficoltà",
    customDesc: "I giganti storici troveranno la saggezza adatta alla tua situazione specifica.",
    customPlaceholder: "Scrivi qui le tue specifiche difficoltà o preoccupazioni (max 300 caratteri)...",
    customSubmit: "Trova Abbinamento",
    analyzing: "Analisi...",
    customResultTitle: "Risultati Abbinamento Problemi",
    error: "Si è verificato un errore durante l'abbinamento. Riprova più tardi.",
    customResultDesc: "Tre giganti che possono offrire profonda empatia e saggezza per le tue specifiche difficoltà."
  },
  pt: {
    title: "Quais dificuldades você está enfrentando hoje?",
    subtitle: "Sua dor não é solitária",
    back: "Escolher novamente",
    notAlone: "Você não é o único",
    overcoming: "As maiores mentes da história enfrentaram exatamente os mesmos problemas e os superaram",
    sufferedTogether: "Este gigante também enfrentou a mesma dor",
    chatWith: "Conversar com este Gigante",
    era: "Época",
    customTitle: "Compartilhe sua própria dificuldade",
    customDesc: "Os gigantes históricos encontrarão sabedoria sob medida para sua situação específica.",
    customPlaceholder: "Escreva aqui suas dificuldades ou preocupações específicas (máx. 300 caracteres)...",
    customSubmit: "Buscar Gigante",
    analyzing: "Analisando...",
    customResultTitle: "Resultados da Combinação de Problemas",
    error: "Ocorreu um erro durante a correspondência. Por favor, tente novamente mais tarde.",
    customResultDesc: "Três gigantes que podem oferecer profunda empatia e sabedoria em relação às suas luttes específicas."
  }
};

export function ConsultClient({ locale }: ConsultClientProps) {
  const router = useRouter()
  const tg = useTranslations("Giants")
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  
  // Custom problem matching states
  const [customProblemText, setCustomProblemText] = useState("")
  const [isMatching, setIsMatching] = useState(false)
  const [customMatchedGiants, setCustomMatchedGiants] = useState<any[]>([])
  const [isCustomProblemMode, setIsCustomProblemMode] = useState(false)

  // Performance Optimization: Defer loading of giantsData until selection or custom match action
  const [giants, setGiants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const activeLocale = (locale === 'ko' || locale === 'en' || locale === 'de' || locale === 'ja' || locale === 'es' || locale === 'fr' || locale === 'it' || locale === 'pt') ? locale : 'en';
  const labels = tMap[activeLocale] || tMap['en'];

  const handleProblemSelect = async (id: string) => {
    const problem = PROBLEM_CATEGORIES.find(p => p.id === id);
    if (!problem) return;
    
    const problemText = problem.translations[activeLocale]?.description || problem.translations['en']?.description || problem.id;
    
    setIsMatching(true);
    // setIsLoading(true); // Removed to prevent Skeleton UI from overriding AnimatePresence
    try {
      if (giants.length === 0) {
        const mod = await import("@/data/giants")
        setGiants(mod.giantsData)
      }
      
      const res = await fetch("/api/consult/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProblem: problemText, locale: activeLocale }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to match");
      }
      if (data.matchedGiants) {
        setCustomMatchedGiants(data.matchedGiants);
        setIsCustomProblemMode(false);
        setSelectedProblemId(id); // Transition to Stage 2 with specific problem ID
      }
    } catch (err) {
      console.error("Preset matching failed:", err);
      alert(labels.error || 'An error occurred during matching.');
    } finally {
      setIsMatching(false);
      setIsLoading(false);
    }
  }

  const handleGoBack = () => {
    setSelectedProblemId(null)
    setIsCustomProblemMode(false)
    setCustomMatchedGiants([])
  }

  const handleStartConsult = (slug: string) => {
    if (!selectedProblemId) return;
    if (selectedProblemId === 'custom') {
      router.push(`/giant/${slug}?problem=custom&customText=${encodeURIComponent(customProblemText)}`);
    } else {
      router.push(`/giant/${slug}?problem=${selectedProblemId}`);
    }
  }

  const handleGoToEpic = (slug: string) => {
    router.push(`/giant/${slug}`);
  }

  const handleCustomProblemSubmit = async () => {
    if (!customProblemText.trim()) return;
    setIsMatching(true);
    // setIsLoading(true); // Removed to prevent Skeleton UI from overriding AnimatePresence
    try {
      if (giants.length === 0) {
        const mod = await import("@/data/giants")
        setGiants(mod.giantsData)
      }
      const res = await fetch("/api/consult/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProblem: customProblemText, locale: activeLocale }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to match");
      }
      if (data.matchedGiants) {
        setCustomMatchedGiants(data.matchedGiants);
        setIsCustomProblemMode(true);
        setSelectedProblemId("custom"); // Transition to Stage 2
      }
    } catch (err) {
      console.error("Custom matching failed:", err);
      alert(labels.error || 'An error occurred during matching.');
    } finally {
      setIsMatching(false);
      setIsLoading(false);
    }
  }

  const selectedProblem = PROBLEM_CATEGORIES.find(p => p.id === selectedProblemId)
  const matchedGiantsRaw = selectedProblemId 
    ? (customMatchedGiants.length > 0 ? customMatchedGiants : (PROBLEM_GIANT_MAP as any)[selectedProblemId] || []) 
    : []

  // Gather matched giants data
  const matchedGiants = matchedGiantsRaw.map((mg: any) => {
    const info = giants.find(g => g.slug === mg.slug)
    const name = tg(`${mg.slug}.name`) || info?.name || mg.slug
    const era = tg(`${mg.slug}.era`) || info?.era || ""
    const imageUrl = info?.imageUrl || `/images/giants/${mg.slug}.jpg`
    
    return {
      ...mg,
      name,
      era,
      imageUrl
    }
  })

  // Skeleton UI Loader for optimizing visual speed (First Contentful Paint)
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between" style={{ background: "var(--rd-bg-base)", color: "var(--rd-text-body)" }}>
        
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-24 flex-1 flex flex-col justify-center animate-pulse">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <div className="w-12 h-12 rounded-full mx-auto mb-4" style={{ background: "var(--rd-divider-faint)" }} />
            <div className="h-10 w-3/4 mx-auto rounded-lg" style={{ background: "var(--rd-divider-faint)" }} />
            <div className="h-6 w-1/2 mx-auto rounded-lg mt-2" style={{ background: "var(--rd-divider-faint)" }} />
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-64 rd-surface p-8"
                style={{ borderRadius: "var(--rd-card-radius)" }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between" style={{ background: "var(--rd-bg-base)", color: "var(--rd-text-body)" }}>
      {/* Background glow effects */}
      
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-24 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isMatching ? (
            <m.div
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center justify-center py-32"
            >
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="animate-spin w-16 h-16 rounded-full relative z-10" style={{ border: "4px solid var(--rd-divider-faint)", borderTopColor: "var(--rd-accent-brown)" }} />
                </div>
                <p className="rd-text-body font-medium text-lg">
                  {labels.analyzing || "당신의 고민과 닮은 거인을 찾고 있어요..."}
                </p>
              </div>
            </m.div>
          ) : !selectedProblemId ? (
            /* STAGE 1: Problem Selection */
            <m.div
              key="stage1"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center justify-center"
            >
              <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                <m.div 
                  initial={false}
                  animate={{ scale: 1 }} 
                  className="w-12 h-12 rounded-full border rd-hairline flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--rd-divider-faint)" }}
                >
                  <Sparkles className="w-5 h-5 rd-accent" />
                </m.div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold rd-text-ink text-center leading-tight">
                  {labels.title}
                </h1>
                <p className="rd-lede">
                  {labels.subtitle}
                </p>
                <div className="w-20 mx-auto mt-4" style={{ borderTop: "1px solid var(--rd-border)" }} />
              </div>



              {/* Predefined Categories (First 3) */}
              <div className="w-full max-w-4xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROBLEM_CATEGORIES.slice(0, 3).map((problem) => {
                  const t = problem.translations[locale] || problem.translations['en']
                  return (
                    <button
                      key={problem.id}
                      onClick={() => handleProblemSelect(problem.id)}
                      disabled={isMatching}
                      className="group p-6 rd-surface hover:opacity-90 transition-opacity text-left flex flex-col cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderRadius: "var(--rd-card-radius)", transitionDuration: "120ms" }}
                    >
                      <div className="text-3xl mb-4 w-12 h-12 rounded-full flex items-center justify-center border rd-hairline"
                        style={{ background: "var(--rd-divider-faint)" }}>
                        {problem.emoji}
                      </div>
                      <h3 className="text-lg font-bold rd-text-ink mb-2">
                        {t.title}
                      </h3>
                      <p className="rd-text-body text-sm leading-relaxed">
                        {t.subtitle}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Custom Problem Input Section */}
              <div className="w-full max-w-4xl mx-auto p-8 rd-surface relative overflow-hidden text-center" style={{ borderRadius: "var(--rd-card-radius)" }}>
                <h3 className="rd-text-ink font-serif font-bold text-xl mb-2 flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5 rd-accent" />
                  {labels.customTitle}
                </h3>
                <p className="rd-text-body text-sm mb-6 max-w-md mx-auto">
                  {labels.customDesc}
                </p>
                <textarea
                  value={customProblemText}
                  onChange={(e) => setCustomProblemText(e.target.value.slice(0, 300))}
                  placeholder={labels.customPlaceholder}
                  className="w-full h-32 px-5 py-4 border rd-input rd-bg-surface rd-text-ink text-sm focus:outline-none transition-all resize-none mb-4"
                />
                <div className="flex items-center justify-between">
                  <span className="rd-caption font-semibold">{customProblemText.length} / 300</span>
                  <button
                    onClick={handleCustomProblemSubmit}
                    disabled={!customProblemText.trim() || isMatching}
                    className="rd-bg-accent border disabled:opacity-50 font-bold px-6 py-3 hover:opacity-90 transition-opacity text-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
                  >
                    {isMatching ? (
                      <>
                        <span className="animate-spin w-3.5 h-3.5 rounded-full" style={{ border: "2px solid var(--rd-surface)", borderTopColor: "transparent" }} />
                        <span>{labels.analyzing}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{labels.customSubmit}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </m.div>
          ) : (
            /* STAGE 2: Matched Giants */
            (selectedProblemId === 'custom' || selectedProblem) && (
              <m.div
                key="stage2"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl mx-auto"
              >
                <button
                  onClick={handleGoBack}
                  className="group flex items-center gap-2 rd-text-body hover:opacity-80 transition-opacity mb-12 text-sm font-semibold py-2 px-4 border rd-hairline rd-bg-surface cursor-pointer"
                  style={{ borderRadius: "var(--rd-card-radius)" }}
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>{labels.back}</span>
                </button>

                <div className="text-center mb-16 space-y-4">
                  <div className="text-6xl mb-4 filter drop-shadow-[0_6px_15px_rgba(0,0,0,0.6)]">
                    {isCustomProblemMode ? "💭" : selectedProblem?.emoji}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif rd-text-ink font-bold">
                    {isCustomProblemMode ? labels.customResultTitle : (selectedProblem?.translations[activeLocale]?.title || selectedProblem?.translations['en']?.title)}
                  </h2>
                  <p className="rd-lede">
                    {labels.notAlone}
                  </p>
                  <p className="rd-text-body max-w-xl mx-auto text-base">
                    {isCustomProblemMode ? labels.customResultDesc : labels.overcoming}
                  </p>
                  <div className="w-24 mx-auto mt-4" style={{ borderTop: "1px solid var(--rd-border)" }} />
                </div>

                <div className="space-y-6">
                  {matchedGiants.map((giant) => (
                    <m.div
                      key={giant.slug}
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      className="rd-surface p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative overflow-hidden group"
                      style={{ borderRadius: "var(--rd-card-radius)" }}
                    >
                      
                      {/* Giant Avatar & Details */}
                      <div className="flex flex-col items-center shrink-0 w-full md:w-36">
                        <GiantAvatar slug={giant?.slug} name={tg(`${giant?.slug}.name`).includes(`${giant?.slug}.`) ? (giant?.name || 'Unknown') : tg(`${giant?.slug}.name`)} />
                        <p className="rd-text-ink font-serif font-bold text-lg text-center leading-tight">
                          {tg(`${giant?.slug}.name`).includes(`${giant?.slug}.`) ? (giant?.name || 'Unknown') : tg(`${giant?.slug}.name`)}
                        </p>
                        <p className="rd-caption text-center mt-1 truncate max-w-full">
                          {tg(`${giant?.slug}.era`).includes(`${giant?.slug}.`) ? (giant?.era || '') : tg(`${giant?.slug}.era`)}
                        </p>
                      </div>

                      {/* Pain & Action Button */}
                      <div className="flex-1 flex flex-col justify-between h-full text-center md:text-left">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-center md:justify-start gap-2 rd-caption font-bold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{labels.sufferedTogether}</span>
                          </div>
                          <p className="rd-quote text-base leading-relaxed whitespace-pre-line font-serif py-1">
                            &ldquo;{giant?.reason || giant?.historicalPain?.[activeLocale] || giant?.historicalPain?.['en'] || ''}&rdquo;
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <button
                            onClick={() => handleStartConsult(giant?.slug)}
                            className="rd-bg-accent border font-bold px-6 py-3 hover:opacity-90 transition-opacity text-sm flex items-center gap-2 cursor-pointer"
                            style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{getChatButtonText(giant?.name || '', activeLocale)}</span>
                            <span className="text-[10px] opacity-70">→</span>
                          </button>
                          
                          <button
                            onClick={() => handleGoToEpic(giant?.slug)}
                            className="border rd-hairline rd-bg-surface rd-accent font-bold px-6 py-3 hover:opacity-80 transition-opacity text-sm flex items-center gap-2 cursor-pointer"
                            style={{ borderRadius: "var(--rd-card-radius)" }}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>{getEpicButtonText(giant.name, activeLocale)}</span>
                          </button>
                        </div>
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
