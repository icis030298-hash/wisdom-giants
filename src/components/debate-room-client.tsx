"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { giants, Giant } from "@/lib/giants-data"
import { 
  Swords, MessageSquare, Send, Sparkles, RefreshCw, Check, Download, 
  Share2, Compass, Play, ChevronRight, ChevronDown, Users, Trophy, Lightbulb, X, AlertCircle
} from "lucide-react"
import { ProjectPhilosophy } from "@/components/project-philosophy"

// Dynamic import for html2canvas to avoid SSR errors
let html2canvas: any = null;
if (typeof window !== "undefined") {
  import("html2canvas").then((mod) => {
    html2canvas = mod.default;
  });
}

interface DebateMessage {
  id: string;
  speaker: string;
  speakerName: string;
  speakerImage: string;
  speakerColor: string;
  content: string;
  timestamp: Date;
}

interface RecommendedGiant {
  slug: string;
  reason: string;
}

// Highly optimized custom golden confetti canvas explosion component
function GoldConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Set canvas dimensions to occupy full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Majestic gold color palette
    const goldColors = [
      "#ffd700", // pure gold
      "#f0e68c", // khaki gold
      "#daa520", // goldenrod
      "#ffdf00", // metallic gold
      "#e5c158", // bright gold
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      shape: "circle" | "square" | "star";
    }

    const particles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create particle explosion
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particles.push({
        x: centerX,
        y: centerY - 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3),
        radius: 3 + Math.random() * 5,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: Math.random() > 0.6 ? "star" : (Math.random() > 0.5 ? "square" : "circle"),
      });
    }

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.98; // air resistance
        p.vy *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012; // gradual fade out

        if (p.opacity > 0) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === "star") {
            drawStar(0, 0, 5, p.radius * 1.5, p.radius * 0.6);
          } else if (p.shape === "square") {
            ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
}

export function DebateRoomClient() {
  const t = useTranslations("Debate")
  const tg = useTranslations("Giants")
  const tc = useTranslations("GiantsGrid")
  const locale = useLocale()
  const router = useRouter()

  // STAGES: 1 = Setup, 2 = Debating, 3 = Summary/Share
  const [stage, setStage] = useState<1 | 2 | 3>(1)
  
  // SETUP STATE
  const [setupMode, setSetupMode] = useState<"self" | "ai">("self")
  const [selectedGiants, setSelectedGiants] = useState<Giant[]>([])
  const [topic, setTopic] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All Giants")
  const [searchQuery, setSearchQuery] = useState("")

  // PREMIUM & PAYMENT STATE
  const [roomId, setRoomId] = useState("")
  const [hasPremiumPass, setHasPremiumPass] = useState(false)
  const [additionalRounds, setAdditionalRounds] = useState(0)
  const [showGoldConfetti, setShowGoldConfetti] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentType, setPaymentType] = useState<"extend" | "unlimited" | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "phone">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [phoneCarrier, setPhoneCarrier] = useState("SKT")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState(0) // 0: 입력 폼, 1: 2초 지연 로딩 연출, 2: 성공 완료
  const [paymentStepText, setPaymentStepText] = useState("")
  
  // AI Recommendation state
  const [aiLoading, setAiLoading] = useState(false)
  const [aiIntro, setAiIntro] = useState("")
  const [aiRecommendations, setAiRecommendations] = useState<RecommendedGiant[]>([])
  const [aiError, setAiError] = useState("")

  // DEBATE ENGINE STATE
  const [history, setHistory] = useState<DebateMessage[]>([])
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0)
  const [isAiContemplating, setIsAiContemplating] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  
  // User Interjection input
  const [interjectInput, setInterjectInput] = useState("")
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null)
  const [autoDebateActive, setAutoDebateActive] = useState(true)

  // Typewriter streaming effect
  const [displayedText, setDisplayedText] = useState("")
  const [isTypewriting, setIsTypewriting] = useState(false)

  // Sharing Card Ref for html2canvas
  const cardRef = useRef<HTMLDivElement>(null)
  const debateEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(false)
  const [userScrolledUp, setUserScrolledUp] = useState(false)
  const isAutoScrollingRef = useRef(false)
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typewriterSkipRef = useRef<(() => void) | null>(null)

  const baseMaxRounds = selectedGiants.length === 2 ? 8 : (selectedGiants.length === 3 ? 9 : 8);
  const maxRounds = baseMaxRounds + additionalRounds;

  // Categories translation mapping
  const categoryNames: Record<string, string> = {
    "All Giants": locale === "ko" ? "전체 위인" : "All Giants",
    "achievement": locale === "ko" ? "성취" : "Achievement",
    "adversity": locale === "ko" ? "역경" : "Adversity",
    "wisdom": locale === "ko" ? "지혜" : "Wisdom",
    "creativity": locale === "ko" ? "창의" : "Creativity"
  }

  const sampleTopics = t.raw("suggestedTopics") || [
    "돈과 행복, 어느 것이 먼저인가?",
    "현대 민주주의는 완벽한 제도인가?",
    "AI가 인류를 구원할 것인가, 위협할 것인가?",
    "전쟁은 때로 정당화될 수 있는가?",
    "개인의 자유와 사회의 질서, 무엇이 우선인가?"
  ]
  // Setup default giants for sample quickstart
  useEffect(() => {
    // When setupMode switches to AI, we reset custom selected list to keep it clean
    if (setupMode === "ai") {
      setSelectedGiants([]);
      setAiRecommendations([]);
      setAiIntro("");
    }
  }, [setupMode])

  // Load premium pass state and active debate session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if AdSense review mode is active via public env or query parameter to bypass lock
    const isAdSenseReview = process.env.NEXT_PUBLIC_ADSENSE_REVIEW_MODE === "true" || 
      window.location.search.includes("adsense_review=true");
    
    if (isAdSenseReview) {
      setHasPremiumPass(true);
    } else {
      // Restore unlimited pass
      const storedUnlimited = localStorage.getItem("giants_debate_premium_unlimited");
      if (storedUnlimited === "true") {
        setHasPremiumPass(true);
      }
    }
    
    // Restore active debate session
    try {
      const activeSession = localStorage.getItem("giants_debate_active_session");
      if (activeSession) {
        const session = JSON.parse(activeSession);
        if (session.stage && session.selectedGiants && session.topic) {
          setRoomId(session.roomId || "room_" + Math.random().toString(36).substring(2, 15));
          setStage(session.stage);
          setSelectedGiants(session.selectedGiants);
          setTopic(session.topic);
          setHistory(session.history || []);
          setCurrentSpeakerIndex(session.currentSpeakerIndex || 0);
          setAdditionalRounds(session.additionalRounds || 0);
          
          // Pause auto-debate so it doesn't run wild on refresh
          setAutoDebateActive(false);
        }
      }
    } catch (e) {
      console.error("Failed to restore debate session:", e);
    }
  }, []);

  // Save active debate session to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (stage === 1) {
      localStorage.removeItem("giants_debate_active_session");
      return;
    }

    try {
      const session = {
        roomId,
        stage,
        selectedGiants,
        topic,
        history,
        currentSpeakerIndex,
        additionalRounds
      };
      localStorage.setItem("giants_debate_active_session", JSON.stringify(session));
    } catch (e) {
      console.error("Failed to save debate session:", e);
    }
  }, [roomId, stage, selectedGiants, topic, history, currentSpeakerIndex, additionalRounds]);

  // Check premium lock for the current roomId
  useEffect(() => {
    if (typeof window === "undefined" || !roomId) return;
    
    const isRoomPremium = localStorage.getItem(`giants_debate_premium_pass_${roomId}`) === "true";
    const isGlobalPremium = localStorage.getItem("giants_debate_premium_unlimited") === "true";
    if (isRoomPremium || isGlobalPremium) {
      setHasPremiumPass(true);
    } else {
      setHasPremiumPass(false);
    }
  }, [roomId]);
  // Automatic scrolling to bottom of debate log (only if user hasn't manually scrolled up)
  useEffect(() => {
    if (stage !== 2 || !scrollContainerRef.current || userScrolledUp) return;

    const container = scrollContainerRef.current;

    if (isTypewriting) {
      // 타이핑 중(스트리밍)일 때는 behavior: "auto" 로 부드러운 애니메이션 없이 즉시 스크롤하여
      // 브라우저의 스크롤 스레드가 과부하 걸리지 않게 하고 사용자 휠 조작을 방해하지 않습니다.
      isAutoScrollingRef.current = true;
      container.scrollTop = container.scrollHeight;
      
      requestAnimationFrame(() => {
        isAutoScrollingRef.current = false;
      });
    } else {
      // 메시지가 새로 추가되거나 상태가 끝났을 때는 부드럽게 스크롤
      isAutoScrollingRef.current = true;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
      
      const timer = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [history, isAiContemplating, displayedText, stage, userScrolledUp, isTypewriting])

  // Scroll listener to check if user has manually scrolled up
  const handleScrollEvent = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 프로그램이 자동으로 스크롤을 처리하는 동안은 감지 무시
    if (isAutoScrollingRef.current) return;

    // If the distance from bottom is less than 60px, consider the user to be at the bottom
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 60;
    
    if (isAtBottom) {
      setUserScrolledUp(false);
    } else {
      setUserScrolledUp(true);
    }
  }

  // 사용자의 명시적인 마우스 휠 및 모바일 터치 이벤트 감지
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || stage !== 2) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        // 위로 휠을 굴렸을 때 즉시 감지하여 자동 스크롤 일시 정지
        setUserScrolledUp(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      // 손가락을 아래로 쓸어내려 화면을 위로 올린 경우 (과거 메시지 스크롤 업)
      if (touchEndY > touchStartY + 5) {
        setUserScrolledUp(true);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [stage]);

  // 상태 변경 시 레이아웃 리플로우(Reflow)로 인한 스크롤 오판 방지용 잠금 훅
  useEffect(() => {
    isAutoScrollingRef.current = true;
    const timer = setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 150); // 레이아웃 재배치가 완전히 끝날 때까지 150ms 동안 스크롤 감지 잠금
    
    return () => clearTimeout(timer);
  }, [history, isTypewriting, isAiContemplating]);

  // Auto-Debate Loop Engine
  useEffect(() => {
    if (stage !== 2 || !autoDebateActive || isAiContemplating || isTypewriting) return;

    // Trigger next speaker turn automatically after a short delay
    const timer = setTimeout(() => {
      triggerNextSpeakerSpeech();
    }, 1500);

    return () => clearTimeout(timer);
  }, [stage, autoDebateActive, isAiContemplating, isTypewriting, currentSpeakerIndex]);

  // Handle Giant Selection
  const toggleGiantSelection = (giant: Giant) => {
    setSelectedGiants((prev) => {
      const exists = prev.find((g) => g.slug === giant.slug);
      if (exists) {
        return prev.filter((g) => g.slug !== giant.slug);
      }
      if (prev.length >= 4) {
        return prev; // Maximum 4
      }
      return [...prev, giant];
    });
  }

  // Fetch AI Giant Recommendations based on the topic
  const handleGetAiRecommendations = async () => {
    if (!topic.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiRecommendations([]);
    setAiIntro("");

    try {
      const res = await fetch("/api/debate/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, locale }),
      });

      if (!res.ok) throw new Error("AI Recommendation failed.");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiIntro(data.intro || "");
      setAiRecommendations(data.recommended || []);

      // Auto-populate selectedGiants list from recommended slugs
      const recommendedSlugs = (data.recommended || []).map((r: any) => r.slug);
      const matched = giants.filter((g) => recommendedSlugs.includes(g.slug));
      setSelectedGiants(matched);

    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to load recommendations.");
    } finally {
      setAiLoading(false);
    }
  }

  // Start the debate!
  const handleStartDebate = () => {
    if (selectedGiants.length < 2 || !topic.trim()) return;
    const newRoomId = "room_" + Math.random().toString(36).substring(2, 15);
    setRoomId(newRoomId);
    setStage(2);
    setHistory([]);
    setCurrentSpeakerIndex(0);
    setPendingUserMessage(null);
    setAutoDebateActive(true);
    setDisplayedText("");
    setIsTypewriting(false);
  }

  // Trigger Gemini Speech API for the next giant speaker
  const triggerNextSpeakerSpeech = async () => {
    if (selectedGiants.length === 0) return;
    
    setIsAiContemplating(true);
    const speaker = selectedGiants[currentSpeakerIndex];
    setActiveSpeaker(speaker.slug);

    // Prepare previous history payload
    const historyPayload = history.map((msg) => ({
      speaker: msg.speaker,
      speakerName: msg.speakerName,
      content: msg.content,
    }));

    // Check if there is a pending user message to inject
    const userMsg = pendingUserMessage;
    if (userMsg) {
      setPendingUserMessage(null); // Clear it
    }

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giants: selectedGiants.map((g) => g.slug),
          topic,
          history: historyPayload,
          currentSpeaker: speaker.slug,
          locale,
          userMessage: userMsg || undefined
        }),
      });

      if (!res.ok) throw new Error("Debate API failed");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Start Typewriter Stream Effect
      startTypewriterAnimation(data.content, speaker);

    } catch (err) {
      console.error("Debate engine error:", err);
      // Fallback response in case of API failure (display 'Thinking for a moment...')
      const fallbackMsg = locale === "ko" ? "잠시 생각 중입니다..." : "Thinking for a moment...";
      startTypewriterAnimation(fallbackMsg, speaker);
    } finally {
      setIsAiContemplating(false);
    }
  }

  // Simulate typewriter text streaming
  const startTypewriterAnimation = (fullText: string, speaker: Giant) => {
    setIsTypewriting(true);
    setDisplayedText("");
    let index = 0;
    const speed = 25; // ms per char

    const interval = setInterval(() => {
      // slice 방식을 사용하여 리액트 비동기 batching에 의한 첫 글자 잘림 현상을 완벽 차단합니다.
      setDisplayedText(fullText.slice(0, index + 1));
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
        finalizeSpeech(fullText, speaker);
      }
    }, speed);

    // 즉시 스킵 핸들러를 바인딩하여 유저가 탭하면 전체 텍스트가 완성되도록 돕습니다.
    typewriterIntervalRef.current = interval;
    typewriterSkipRef.current = () => {
      clearInterval(interval);
      finalizeSpeech(fullText, speaker);
    };
  }

  // 대화 완료 및 히스토리 정식 등록 공통 처리 함수
  const finalizeSpeech = (fullText: string, speaker: Giant) => {
    const newMsg: DebateMessage = {
      id: Date.now().toString(),
      speaker: speaker.slug,
      speakerName: tg(`${speaker.slug}.name`) || speaker.name,
      speakerImage: speaker.imageUrl,
      speakerColor: speaker.color,
      content: fullText,
      timestamp: new Date()
    };

    setHistory((prev) => {
      const nextHistory = [...prev, newMsg];
      const giantRounds = nextHistory.filter(h => h.speaker !== "moderator" && h.speaker !== "user").length;
      
      if (giantRounds >= maxRounds) {
        // Auto end debate if maximum dynamic rounds reached
        setTimeout(() => {
          setAutoDebateActive(false);
          setStage(3);
        }, 1000);
      } else if (giantRounds % 3 === 0) {
        // 3라운드 주기 관객 참여 세션 체크 (3, 6, 9라운드 완료 시)
        setTimeout(() => {
          setAutoDebateActive(false);
          setShowInteractionPrompt(true);
          
          const moderatorMsg: DebateMessage = {
            id: (Date.now() + 1).toString(),
            speaker: "moderator",
            speakerName: locale === "ko" ? "토론 사회자" : "Debate Moderator",
            speakerImage: "/images/moderator-avatar.png",
            speakerColor: "from-amber-500/20 to-yellow-500/20",
            content: locale === "ko" 
              ? "자, 위인들의 열띤 논쟁이 이어지고 있습니다. 이 흥미진진한 주제에 대해 귀하의 생각은 어떠신가요? 혹시 할 말씀이 있으신가요?"
              : "The debate is heating up! What are your thoughts on this fascinating topic? Would you like to share your perspective?",
            timestamp: new Date()
          };
          
          setHistory(prevHistory => [...prevHistory, moderatorMsg]);
        }, 1200);
      }
      
      return nextHistory;
    });
    setDisplayedText("");
    setIsTypewriting(false);
    setActiveSpeaker(null);
    typewriterIntervalRef.current = null;
    typewriterSkipRef.current = null;

    // Move to the next speaker index in round-robin cycle
    setCurrentSpeakerIndex((prevIndex) => (prevIndex + 1) % selectedGiants.length);
  }

  // Handle User Interjection Submission
  const handleSendInterjection = () => {
    if (!interjectInput.trim() || isAiContemplating) return;

    setShowInteractionPrompt(false);

    // 만약 현재 다른 위인이 타이핑 중(isTypewriting)이라면, 
    // 하던 말을 즉시 완료(Skip) 처리하고 유저 개입 대화를 그 아래에 즉각 주입합니다.
    if (isTypewriting && typewriterSkipRef.current) {
      typewriterSkipRef.current();
    }

    // Create audience message in the log
    const userMessage: DebateMessage = {
      id: Date.now().toString(),
      speaker: "user",
      speakerName: locale === "ko" ? "관객 (나)" : "Audience (You)",
      speakerImage: "/images/user-avatar.png", // Fallback or placeholder
      speakerColor: "from-amber-500/20 to-orange-500/20",
      content: interjectInput,
      timestamp: new Date()
    };

    setHistory((prev) => [...prev, userMessage]);
    setPendingUserMessage(interjectInput);
    setInterjectInput("");

    // Force continue debate with next giant immediately reacting to it
    setAutoDebateActive(true);
  }

  // End Debate and view results
  const handleEndDebate = () => {
    setAutoDebateActive(false);
    setStage(3);
  }

  // Download Debate Highlights Summary Card using html2canvas
  const handleDownloadCard = () => {
    if (!cardRef.current || !html2canvas) return;

    html2canvas(cardRef.current, {
      backgroundColor: "#020617",
      scale: 2, // Double quality
      logging: false,
      useCORS: true
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = `Giants-Debate-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  // Open Checkout Simulation Modal
  const handleOpenCheckout = (type: "extend" | "unlimited") => {
    setPaymentType(type);
    setPaymentMethod("card");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPhoneCarrier("SKT");
    setPhoneNumber("");
    setPaymentProcessing(false);
    setPaymentStep(0);
    setShowPaymentModal(true);
  }

  // Handle Virtual Payment Processing Simulator
  const handleProcessPayment = () => {
    setPaymentProcessing(true);
    setPaymentStep(1);
    setPaymentStepText(locale === "ko" ? "🔒 안전한 결제 게이트웨이 연결 중..." : "🔒 Connecting to secure gateway...");

    // Step 1.1: 700ms 후 카드사/통신사 승인 단계 노출
    setTimeout(() => {
      setPaymentStepText(
        paymentMethod === "card"
          ? (locale === "ko" ? "💳 카드사 거래 승인 요청 중..." : "💳 Requesting card issuer approval...")
          : (locale === "ko" ? "📱 통신사 한도 조회 및 인증 확인 중..." : "📱 Verifying carrier authentication...")
      );
    }, 700);

    // Step 1.2: 1400ms 후 락 해제 단계 노출
    setTimeout(() => {
      setPaymentStepText(locale === "ko" ? "✨ 최종 토론 데이터 락 해제 중..." : "✨ Unlocking debate data...");
    }, 1400);

    // Simulate multi-step secure payment server verification delay (2000ms total)
    setTimeout(() => {
      // Step 2: Payment Success Complete representation
      setPaymentStep(2);
      setShowGoldConfetti(true);
      
      // Keep success check mark for 1.5 seconds, then apply access
      setTimeout(() => {
        setPaymentProcessing(false);
        setShowPaymentModal(false);
        setShowGoldConfetti(false);

        if (paymentType === "extend") {
          // 5 rounds extension benefit:
          setAdditionalRounds((prev) => prev + 5);
          if (typeof window !== "undefined" && roomId) {
            localStorage.setItem(`giants_debate_premium_pass_${roomId}`, "true");
          }
          
          // Re-adjust speaker flow to continue properly if it was auto-paused
          setStage(2);
          setAutoDebateActive(true);
          setUserScrolledUp(false);
        } else if (paymentType === "unlimited") {
          // Lifetime access pass benefit:
          setHasPremiumPass(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("giants_debate_premium_unlimited", "true");
            if (roomId) {
              localStorage.setItem(`giants_debate_premium_pass_${roomId}`, "true");
            }
          }
        }
      }, 1500);
    }, 2000);
  }

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.match(/.{1,4}/g)?.join("-") || val;
    setCardNumber(formatted.slice(0, 19));
  }

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 2) {
      setCardExpiry(val);
    } else {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    }
  }

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCardCvc(val.slice(0, 3));
  }

  // Phone formatting helper
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    let formatted = val;
    if (val.length > 3 && val.length <= 7) {
      formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    } else if (val.length > 7) {
      formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`;
    }
    setPhoneNumber(formatted);
  }

  // Filter and search logic for setup screen
  const filteredGiantsList = giants.filter((g) => {
    const nameMatch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (tg(`${g.slug}.name`) || "").toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = activeCategory === "All Giants" || g.category === activeCategory;
    return nameMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden py-24 px-4 md:px-8">
      {/* Background radial overlays for premium aesthetic */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* STAGE 1: SETUP SCREEN */}
      {stage === 1 && (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">
          {/* Header Description */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Swords className="w-3.5 h-3.5" />
              {t("subtitle")}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-tight leading-tight">
              {t("title")}
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Columns: Selection & Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Toggle Selection Method */}
              <div className="glass-card p-1.5 rounded-2xl flex border border-white/5 bg-slate-900/50">
                <button
                  onClick={() => setSetupMode("self")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    setupMode === "self" 
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {locale === "ko" ? "위인 직접 선택" : t("selfSelect")}
                </button>
                <button
                  onClick={() => setSetupMode("ai")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    setupMode === "ai" 
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {locale === "ko" ? "AI 위인 추천" : t("aiRecommend")}
                </button>
              </div>

              {/* Topic Input Box */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 bg-slate-900/40 relative">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400/60" />
                    {t("enterTopic")}
                  </label>
                  {setupMode === "ai" && (
                    <button
                      onClick={handleGetAiRecommendations}
                      disabled={aiLoading || !topic.trim()}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {aiLoading ? (
                        <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      {locale === "ko" ? "토론 패널 구성하기" : t("aiRecommend")}
                    </button>
                  )}
                </div>

                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t("topicPlaceholder")}
                  className="w-full h-32 px-5 py-4 rounded-2xl glass-card bg-slate-950/70 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm resize-none leading-relaxed"
                />

                {/* Sample Topics Chip list */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    {locale === "ko" ? "💡 이런 주제로 토론해 보세요" : "💡 Suggested Topics"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sampleTopics.map((item: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setTopic(item)}
                        className="px-3 py-1.5 rounded-xl text-xs glass border border-white/5 text-slate-400 hover:text-amber-300 hover:border-amber-500/30 transition-all whitespace-nowrap cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Setup Mode: Custom Selector list of Giants */}
              {setupMode === "self" && (
                <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6 bg-slate-900/30">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400/60" />
                      {t("selectGiants")}
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      {t("selectedCount", { count: selectedGiants.length })}
                    </span>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder={tc("searchPlaceholder") || "위인 이름으로 검색..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl glass bg-slate-950/60 border border-white/10 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                    <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-thin">
                      {Object.keys(categoryNames).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                            activeCategory === cat 
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold" 
                              : "glass text-slate-400 hover:text-slate-200 border-transparent"
                          }`}
                        >
                          {categoryNames[cat]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Giant Selection Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredGiantsList.map((giant) => {
                      const isSelected = selectedGiants.some((g) => g.slug === giant.slug);
                      return (
                        <button
                          key={giant.slug}
                          onClick={() => toggleGiantSelection(giant)}
                          className={`relative group flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5 scale-[1.02]" 
                              : "glass hover:bg-white/5 border-white/5"
                          }`}
                        >
                          {/* Selected Check overlay */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-lg animate-scale-up">
                              <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                            </div>
                          )}

                          <div className="relative w-14 h-14 rounded-xl overflow-hidden mb-2 bg-slate-800 ring-2 ring-white/5">
                            <Image
                              src={giant.imageUrl}
                              alt={tg(`${giant.slug}.name`) || giant.name}
                              fill
                              sizes="56px"
                              className="object-cover object-top group-hover:scale-105 transition-all"
                            />
                          </div>

                          <span className="font-bold text-xs text-slate-200 truncate w-full">
                            {tg(`${giant.slug}.name`) || giant.name}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate w-full mt-0.5">
                            {tg(`${giant.slug}.headline`) || giant.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Recommendation Mode results UI */}
              {setupMode === "ai" && (topic.trim() && (aiIntro || aiLoading || aiRecommendations.length > 0)) && (
                <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 bg-slate-900/30">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400/60" />
                    {t("aiRecommendTitle")}
                  </h3>

                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                      <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                      <span className="text-xs font-semibold">{locale === "ko" ? "최고의 토론 패널을 구성하는 중..." : "Selecting the best debate panel..."}</span>
                    </div>
                  ) : aiError ? (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{aiError}</span>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in-up">
                      <p className="text-slate-300 text-sm leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-white/5">
                        &ldquo;{aiIntro}&rdquo;
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiRecommendations.map((rec) => {
                          const giant = giants.find((g) => g.slug === rec.slug);
                          if (!giant) return null;
                          return (
                            <div key={rec.slug} className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col items-center text-center">
                              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-amber-500/30 bg-slate-800">
                                <Image
                                  src={giant.imageUrl}
                                  alt={tg(`${giant.slug}.name`)}
                                  fill
                                  sizes="64px"
                                  className="object-cover object-top"
                                />
                              </div>
                              <h4 className="font-bold text-sm text-slate-100">{tg(`${giant.slug}.name`)}</h4>
                              <p className="text-[10px] text-amber-400 mt-0.5 font-medium">{tg(`${giant.slug}.headline`)}</p>
                              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{rec.reason}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Sticky Summary & Action Panel */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10 bg-slate-900/50 sticky top-24 space-y-6 shadow-xl shadow-slate-950/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-white/5">
                  {locale === "ko" ? "토론방 개요" : "Debate Setup Overview"}
                </h3>

                {/* Panel Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                      {t("enterTopic")}
                    </span>
                    <p className="text-sm text-slate-200 line-clamp-3 bg-slate-950/40 p-3 rounded-xl border border-white/5 min-h-[50px] leading-relaxed">
                      {topic.trim() ? topic : (locale === "ko" ? "아직 주제가 설정되지 않았습니다." : "No topic set yet.")}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                      {locale === "ko" ? "참여 위인 목록" : "Participating Giants"}
                    </span>
                    {selectedGiants.length > 0 ? (
                      <div className="space-y-2">
                        {selectedGiants.map((giant) => (
                          <div key={giant.slug} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/30 border border-white/5">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                              <Image
                                src={giant.imageUrl}
                                alt={tg(`${giant.slug}.name`)}
                                fill
                                sizes="32px"
                                className="object-cover object-top"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-slate-200 truncate">{tg(`${giant.slug}.name`)}</h4>
                              <p className="text-[10px] text-slate-500 truncate">{tg(`${giant.slug}.headline`)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-300 leading-relaxed bg-slate-950/20">
                        {setupMode === "ai" 
                          ? (locale === "ko" ? "💡 토론 주제를 입력하고 [토론 패널 구성하기]를 누르면 AI가 완벽한 위인들을 매칭해 줍니다!" : "💡 Enter a topic and click [Match Debate Panel] to let AI select the giants!") 
                          : t("minRequired")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  disabled={selectedGiants.length < 2 || !topic.trim()}
                  onClick={handleStartDebate}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950 stroke-none" />
                  {t("startDebate")}
                </button>
              </div>
            </div>
          </div>
          
          {/* High-density Project Philosophy for SEO and AdSense Compliance */}
          <ProjectPhilosophy />
        </div>
      )}

      {/* STAGE 2: LIVE DEBATING SCREEN */}
      {stage === 2 && (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-fade-in-up relative">
          {/* Header topic banner */}
          <div className="glass-card p-4 md:p-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl mb-4 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                  <Swords className="w-3 h-3 animate-pulse" />
                  {t("title")}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {locale === "ko" ? `토론 라운드: ${history.filter(h => h.speaker !== "user" && h.speaker !== "moderator").length} / ${maxRounds}` : `Round: ${history.filter(h => h.speaker !== "user" && h.speaker !== "moderator").length} / ${maxRounds}`}
                </span>
              </div>
              <h2 className="font-serif font-black text-slate-200 text-base md:text-lg leading-tight line-clamp-2">
                &ldquo;{topic}&rdquo;
              </h2>
            </div>
            
            {/* Participating Avatars overlay */}
            <div className="flex -space-x-2.5 overflow-hidden shrink-0">
              {selectedGiants.map((g) => (
                <div 
                  key={g.slug} 
                  className={`relative w-8 h-8 rounded-full border border-slate-950 overflow-hidden bg-slate-800 ${
                    activeSpeaker === g.slug ? "ring-2 ring-amber-500 scale-110 z-10" : ""
                  } transition-all`}
                  title={tg(`${g.slug}.name`)}
                >
                  <Image
                    src={g.imageUrl}
                    alt={tg(`${g.slug}.name`)}
                    fill
                    sizes="32px"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Core messages scroll container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScrollEvent}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 glass-card border border-white/5 rounded-3xl bg-slate-900/20 backdrop-blur-md mb-4 custom-scrollbar"
          >
            {history.length === 0 && !isAiContemplating && !isTypewriting && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Swords className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-300">{locale === "ko" ? "토론이 곧 시작됩니다" : "Debate is about to begin"}</h4>
                  <p className="text-xs max-w-xs">{locale === "ko" ? "위인들이 첫 마디를 나누기 위해 생각을 가다듬고 있습니다." : "Giants are collecting their thoughts for the opening arguments."}</p>
                </div>
              </div>
            )}

            {/* Render previous turns */}
            {history.map((msg, idx) => {
              const isUser = msg.speaker === "user";
              const isModerator = msg.speaker === "moderator";
              
              if (isModerator) {
                return (
                  <div key={msg.id} className="flex w-full justify-center animate-fade-in-up py-4">
                    <div className="max-w-xl w-full text-center space-y-3 px-4">
                      {/* Host Header */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-wider shadow-sm">
                        <span className="animate-pulse">🎙️</span>
                        {msg.speakerName}
                      </div>
                      
                      {/* Premium bubble */}
                      <div className="px-6 py-5 rounded-[2.5rem] bg-gradient-to-b from-slate-900/90 via-purple-950/10 to-slate-950/90 border-2 border-amber-500/30 text-amber-100 text-sm leading-relaxed shadow-2xl relative overflow-hidden backdrop-blur-md">
                        {/* Elegant light rays background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
                        <p className="font-semibold whitespace-pre-wrap italic">
                          &ldquo;{msg.content}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              if (isUser) {
                return (
                  <div key={msg.id} className="flex w-full justify-center animate-fade-in-up py-2">
                    <div className="max-w-xl w-full text-center space-y-2 px-4">
                      {/* Audience (Me) Header */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[9px] font-black uppercase tracking-wider">
                        <span>👤</span>
                        {msg.speakerName}
                      </div>
                      
                      {/* Premium Bubble */}
                      <div className="px-5 py-4 rounded-3xl bg-purple-950/40 text-purple-200 border border-purple-500/30 text-sm italic inline-block mx-auto shadow-lg max-w-lg">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Alternate alignments to create a premium, balanced theatrical view
              const alignment = idx % 2 === 0 ? "justify-start" : "justify-end";
              
              return (
                <div key={msg.id} className={`flex w-full ${alignment} animate-fade-in-up`}>
                  <div className="max-w-[85%] sm:max-w-[75%]">
                    {/* Speaker Header */}
                    <div className={`flex items-center gap-2 mb-2 px-1 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                      <div className="relative w-6 h-6 rounded-md overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                        <Image
                          src={msg.speakerImage}
                          alt={msg.speakerName}
                          fill
                          sizes="24px"
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[10px] text-amber-400 font-black tracking-wider uppercase">
                        {msg.speakerName}
                      </span>
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`px-5 py-4 rounded-3xl shadow-lg leading-relaxed glass border border-white/10 text-slate-100 text-sm ${
                        idx % 2 === 0 ? "rounded-tl-none bg-slate-900/60" : "rounded-tr-none bg-slate-900/30"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typewriter Stream bubble */}
            {isTypewriting && activeSpeaker && (
              <div className={`flex w-full ${history.length % 2 === 0 ? "justify-start" : "justify-end"} animate-fade-in`}>
                <div className="max-w-[85%] sm:max-w-[75%]">
                  {/* Speaker Header */}
                  <div className={`flex items-center gap-2 mb-2 px-1 ${history.length % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    <div className="relative w-6 h-6 rounded-md overflow-hidden bg-slate-800 border border-amber-500/30 shrink-0">
                      <Image
                        src={selectedGiants[currentSpeakerIndex].imageUrl}
                        alt={selectedGiants[currentSpeakerIndex].name}
                        fill
                        sizes="24px"
                        className="object-cover object-top"
                      />
                    </div>
                    <span className="text-[10px] text-amber-400 font-black tracking-wider uppercase">
                      {tg(`${selectedGiants[currentSpeakerIndex].slug}.name`) || selectedGiants[currentSpeakerIndex].name}
                    </span>
                  </div>

                  {/* Typing content */}
                  <div 
                    onClick={() => typewriterSkipRef.current?.()}
                    className={`px-5 py-4 rounded-3xl shadow-lg leading-relaxed border border-amber-500/30 text-slate-100 text-sm bg-slate-900/60 cursor-pointer hover:border-amber-400 transition-colors relative group ${
                      history.length % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"
                    }`}
                    title={locale === "ko" ? "클릭 시 즉시 전체 보기" : "Click to view full text immediately"}
                  >
                    <p className="whitespace-pre-wrap">{displayedText}</p>
                    <span className="absolute bottom-1.5 right-3 text-[9px] text-amber-500/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      {locale === "ko" ? "클릭 시 건너뛰기 ⚡" : "Click to Skip ⚡"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AI thinking state */}
            {isAiContemplating && (
              <div className={`flex w-full ${history.length % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className="glass rounded-3xl px-5 py-4 border border-white/5 bg-slate-900/30">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[11px] text-slate-400 ml-2 font-medium">
                      {t("thinking", { name: (tg(`${selectedGiants[currentSpeakerIndex].slug}.name`) || selectedGiants[currentSpeakerIndex].name).split(" ")[0] })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={debateEndRef} />
          </div>

          {/* Floating scroll-to-bottom badge when scrolled up */}
          {userScrolledUp && history.length > 0 && (
            <div className="absolute bottom-[108px] left-1/2 -translate-x-1/2 z-20 animate-bounce">
              <button
                onClick={() => {
                  isAutoScrollingRef.current = true;
                  setUserScrolledUp(false);
                  scrollContainerRef.current?.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "smooth"
                  });
                  setTimeout(() => {
                    isAutoScrollingRef.current = false;
                  }, 500);
                }}
                className="px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 border border-amber-400/50 hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                {locale === "ko" ? "최근 토론 내용으로 가기" : "Scroll to Bottom"}
              </button>
            </div>
          )}

          {/* User Interjection Panel */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-4 shadow-xl z-10">
            {showInteractionPrompt && (
              <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b border-white/5 animate-fade-in-up">
                <button
                  onClick={() => {
                    setShowInteractionPrompt(false);
                    inputRef.current?.focus();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  <span>📝</span>
                  {locale === "ko" ? "직접 의견 적어 개입하기" : "Share My Own Opinion"}
                </button>
                <button
                  onClick={() => {
                    setShowInteractionPrompt(false);
                    setAutoDebateActive(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl glass hover:bg-white/5 text-slate-200 border border-white/10 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⏭️</span>
                  {locale === "ko" ? "AI 토론 계속 감상하기" : "Continue AI Debate"}
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Auto / Manual Flow Toggle */}
              <button 
                onClick={() => setAutoDebateActive(!autoDebateActive)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  autoDebateActive 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-slate-950 text-slate-500 border-white/5"
                }`}
                title={autoDebateActive ? "Auto-play enabled" : "Auto-play disabled"}
              >
                {autoDebateActive ? "LIVE PLAY" : "PAUSED"}
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={interjectInput}
                  onChange={(e) => setInterjectInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendInterjection()}
                  placeholder={t("interject")}
                  disabled={isAiContemplating}
                  className="w-full px-5 py-3 rounded-xl glass-card bg-slate-950/60 border border-white/10 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-500/50 pr-12 disabled:opacity-50"
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/30" />
              </div>

              <button
                onClick={handleSendInterjection}
                disabled={!interjectInput.trim() || isAiContemplating}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Footer Control buttons */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <button
                onClick={() => {
                  setAutoDebateActive(false);
                  setStage(1);
                }}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
              >
                {locale === "ko" ? "← 설정으로" : "← Back to Setup"}
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEndDebate}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  {t("endDebate")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: SUMMARY & SOCIAL SHARING CARD */}
      {stage === 3 && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5" />
              {locale === "ko" ? "토론이 종료되었습니다" : "Debate Concluded"}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-200">
              {t("summaryTitle")}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              {t("rounds", { count: history.filter(h => h.speaker !== "user" && h.speaker !== "moderator").length })}
            </p>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden">
            {/* 1. 프리미엄 잠금 화면 */}
            {!hasPremiumPass && (
              <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[6px] rounded-[2.5rem] animate-fade-in transition-all duration-700">
                <div className="max-w-md w-full glass-card p-8 rounded-[2rem] border border-amber-500/30 bg-slate-950/95 shadow-2xl text-center space-y-6 animate-slide-up">
                  {/* 자물쇠 골드 아이콘 */}
                  <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                    <span className="text-xl">🔒</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                      {locale === "ko" ? "토론 분석 및 카드 다운로드 잠김" : "Debate Analysis & Card Locked"}
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {locale === "ko" 
                        ? "위인들의 심도 깊은 통찰이 집약된 최종 분석 리포트와 소셜 공유용 고화질 카드를 이용해 보세요." 
                        : "Unlock key summary reports of historical giants and premium sharing card download features."}
                    </p>
                  </div>

                  {/* 상품 카드 구성 */}
                  <div className="space-y-3">
                    {/* 상품 A: 5라운드 연장 */}
                    <button 
                      onClick={() => handleOpenCheckout("extend")}
                      className="w-full p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 bg-white/5 hover:bg-amber-500/5 transition-all text-left flex justify-between items-center group cursor-pointer"
                    >
                      <div className="pr-4">
                        <div className="font-bold text-xs text-slate-200">
                          {locale === "ko" ? "[1회 토론 5라운드 더 연장하기] — ₩990" : "[Extend 5 More Rounds for This Debate] — ₩990"}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5 text-left leading-normal">
                          {locale === "ko" 
                            ? "현재 토론을 5라운드 더 추가하여 대화를 이어갑니다." 
                            : "Add 5 more rounds to the current debate and resume discussion."}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-amber-400">₩990</div>
                      </div>
                    </button>

                    {/* 상품 B: 무제한 패스 */}
                    <button 
                      onClick={() => handleOpenCheckout("unlimited")}
                      className="w-full p-4 rounded-2xl border-2 border-amber-500/20 hover:border-amber-500/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5 hover:from-amber-500/10 hover:to-orange-500/10 transition-all text-left flex justify-between items-center group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-10 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[7px] rounded-b uppercase tracking-widest">
                        BEST 🔥
                      </div>
                      <div className="pr-4">
                        <div className="font-bold text-xs text-amber-300">
                          {locale === "ko" ? "[무제한 프리미엄 패스 구독] — ₩4,900/월" : "[Unlimited Premium Pass Subscription] — ₩4,900/mo"}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 text-left leading-normal">
                          {locale === "ko" 
                            ? "평생 모든 토론 요약 해제 및 무제한 이미지 다운로드" 
                            : "Permanently unlock all debate summaries and unlimited card downloads."}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-amber-400">{locale === "ko" ? "₩4,900/월" : "₩4,900/mo"}</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 블러 처리될 기존 결과 콘텐츠 */}
            <div 
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-start transition-all duration-1000 ${
                !hasPremiumPass ? "blur-md pointer-events-none select-none opacity-30 scale-[0.98]" : ""
              }`}
            >
            {/* Left: Beautiful Social Card Display (For capture) */}
            <div className="md:col-span-7 space-y-4">
              <div 
                ref={cardRef} 
                className="w-full aspect-[4/5] rounded-[2.5rem] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/30 p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
              >
                {/* Ancient grid lines & premium overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between pb-6 border-b border-amber-500/20">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                      Giants Wisdom
                    </span>
                    <h3 className="font-serif font-extrabold text-lg text-slate-200">
                      ⚔️ {locale === "ko" ? "역사의 토론" : "Historical Debate"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                    <Swords className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  </div>
                </div>

                {/* Body Content (Topic & highlights) */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-6 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">
                      {locale === "ko" ? "토론 주제" : "Debate Topic"}
                    </span>
                    <h2 className="font-serif font-black text-xl md:text-2xl text-slate-100 leading-tight">
                      &ldquo;{topic}&rdquo;
                    </h2>
                  </div>

                  {/* Highlights (Last 2 exchanges from different giants) */}
                  <div className="space-y-4">
                    {history
                      .filter((h) => h.speaker !== "user" && h.speaker !== "moderator")
                      .slice(-2)
                      .map((msg, i) => (
                        <div key={i} className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="relative w-5 h-5 rounded overflow-hidden bg-slate-800 shrink-0">
                              <Image
                                src={msg.speakerImage}
                                alt={msg.speakerName}
                                fill
                                sizes="20px"
                                className="object-cover object-top"
                              />
                            </div>
                            <span className="text-[10px] text-amber-300 font-bold uppercase">{msg.speakerName}</span>
                          </div>
                          <p className="text-slate-300 text-xs italic leading-relaxed line-clamp-3">
                            &ldquo;{msg.content}&rdquo;
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer Call-To-Action */}
                <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {locale === "ko" ? "나와 닮은 위인과 대화하고 싶다면?" : "Want to chat with your giant match?"}
                    </p>
                    <p className="text-xs font-bold text-amber-400">giantswisdom.com/debate</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-tight">
                    #GiantsWisdom
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownloadCard}
                  className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <Download className="w-4 h-4" />
                  {locale === "ko" ? "카드 저장하기" : "Save Image Card"}
                </button>
                <button
                  onClick={() => setStage(1)}
                  className="py-4 px-6 rounded-2xl glass hover:bg-white/5 text-slate-200 border border-white/10 text-sm font-semibold transition-all cursor-pointer"
                >
                  {t("newDebate")}
                </button>
              </div>
            </div>

            {/* Right: Key highlights summary text panel */}
            <div className="md:col-span-5 space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10 bg-slate-900/50 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 pb-3 border-b border-white/5 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400/60" />
                  {locale === "ko" ? "토론 핵심 분석" : "Key Arguments Log"}
                </h3>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {history
                    .filter((h) => h.speaker !== "user" && h.speaker !== "moderator")
                    .map((msg, i) => (
                      <div key={i} className="space-y-1.5 relative pl-4 border-l border-amber-500/20">
                        <div className="absolute top-1.5 left-0 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <h5 className="text-[11px] font-bold text-slate-300 uppercase">{msg.speakerName}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed italic">&ldquo;{msg.content}&rdquo;</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* 5. SECURE CHECKOUT SIMULATOR MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/20 rounded-[2.5rem] p-6 shadow-2xl space-y-6 relative overflow-hidden animate-scale-up">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                  🛡️ Secure Checkout
                </span>
                <h3 className="font-serif font-black text-slate-200 text-base">
                  {paymentType === "extend" 
                    ? (locale === "ko" ? "5라운드 토론 더 연장" : "Extend 5 Debate Rounds")
                    : (locale === "ko" ? "무제한 토론 패스 개방" : "Unlimited Debate Pass")}
                </h3>
              </div>
              <button 
                onClick={() => !paymentProcessing && setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Switch */}
            {paymentStep === 0 && (
              <div className="space-y-5 relative z-10">
                {/* Method Tabs */}
                <div className="flex p-1 rounded-xl bg-slate-950 border border-white/5">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === "card"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {locale === "ko" ? "신용/체크카드" : "Credit Card"}
                  </button>
                  <button
                    onClick={() => setPaymentMethod("phone")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === "phone"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {locale === "ko" ? "휴대폰 소액결제" : "Mobile Payment"}
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === "card" ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {locale === "ko" ? "카드 번호" : "Card Number"}
                      </label>
                      <input
                        type="text"
                        placeholder="1234-5678-1234-5678"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-4 py-2.5 rounded-xl glass bg-slate-950/60 border border-white/10 text-xs focus:outline-none focus:border-amber-500/40 text-center tracking-widest font-mono text-slate-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {locale === "ko" ? "유효기간" : "Expiry Date"}
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          className="w-full px-4 py-2.5 rounded-xl glass bg-slate-950/60 border border-white/10 text-xs focus:outline-none focus:border-amber-500/40 text-center font-mono text-slate-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          CVC
                        </label>
                        <input
                          type="password"
                          placeholder="***"
                          value={cardCvc}
                          onChange={handleCardCvcChange}
                          className="w-full px-4 py-2.5 rounded-xl glass bg-slate-950/60 border border-white/10 text-xs focus:outline-none focus:border-amber-500/40 text-center font-mono text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile Carrier Fields
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {locale === "ko" ? "통신사" : "Carrier"}
                      </label>
                      <select
                        value={phoneCarrier}
                        onChange={(e) => setPhoneCarrier(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass bg-slate-950 border border-white/10 text-xs focus:outline-none focus:border-amber-500/40 text-slate-200 cursor-pointer"
                      >
                        <option value="SKT">SKT</option>
                        <option value="KT">KT</option>
                        <option value="LGU+">LG U+</option>
                        <option value="HELLOMOBILE">{locale === "ko" ? "알뜰폰" : "MVNO"}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {locale === "ko" ? "휴대폰 번호" : "Phone Number"}
                      </label>
                      <input
                        type="text"
                        placeholder="010-1234-5678"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className="w-full px-4 py-2.5 rounded-xl glass bg-slate-950/60 border border-white/10 text-xs focus:outline-none focus:border-amber-500/40 text-center font-mono text-slate-200"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleProcessPayment}
                  disabled={
                    paymentMethod === "card"
                      ? cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3
                      : phoneNumber.length < 12
                  }
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {paymentType === "extend" 
                    ? (locale === "ko" ? "₩990 안전 결제하기" : "Pay ₩990 Securely")
                    : (locale === "ko" ? "₩4,900/월 안전 결제하기" : "Pay ₩4,900/mo Securely")}
                </button>
              </div>
            )}

            {/* Processing state */}
            {paymentStep === 1 && (
              <div className="py-8 flex flex-col items-center justify-center gap-4 text-center relative z-10 animate-fade-in">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-300">
                    {locale === "ko" ? "결제 승인 중..." : "Processing Payment..."}
                  </h4>
                  <p className="text-[10px] text-slate-500 animate-pulse">
                    {paymentStepText}
                  </p>
                </div>
              </div>
            )}

            {/* Success state */}
            {paymentStep === 2 && (
              <div className="py-8 flex flex-col items-center justify-center gap-4 text-center relative z-10 animate-scale-up">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/15 animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-black text-emerald-400 text-sm">
                    {locale === "ko" ? "결제 성공! 🎉" : "Payment Successful! 🎉"}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {paymentType === "extend"
                      ? (locale === "ko" ? "5라운드가 연장되어 토론이 곧 재개됩니다." : "5 rounds extended. Debate will resume shortly.")
                      : (locale === "ko" ? "위인들의 모든 요약 보고서 락이 해제되었습니다." : "All premium features successfully unlocked.")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <GoldConfettiCanvas active={showGoldConfetti} />
    </div>
  );
}
