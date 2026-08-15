"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useLocale } from "next-intl"
import { m, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Monitor, Sparkles, Smartphone, Award, ArrowLeft, Download, Volume2, VolumeX } from "lucide-react"
import { giantsData } from "@/data/giants"
import Link from "next/link"

interface ReelScenario {
  slug: string
  nameKo: string
  nameEn: string
  avatar: string
  userQuestionKo: string
  userQuestionEn: string
  giantAnswerKo: string
  giantAnswerEn: string
  recommendedFoodKo: string
  recommendedFoodEn: string
  bgGradient: string
  stickerEmoji: string
}

const REELS_SCENARIOS: Record<string, ReelScenario> = {
  "king-sejong": {
    slug: "king-sejong",
    nameKo: "세종대왕",
    nameEn: "King Sejong",
    avatar: "/images/giants/king-sejong.jpg",
    userQuestionKo: "대왕님, 오늘 점심은 무얼 먹을까요?",
    userQuestionEn: "Your Majesty, what should I eat for lunch today?",
    giantAnswerKo: "백성이 든든하게 먹고 힘을 내는 것이 나라의 근본이노라. 따뜻한 쌀밥에 푹 끓인 고기 국물이 가득한 뜨끈한 '설렁탕' 한 그릇을 비우고 본분에 힘쓰거라.",
    giantAnswerEn: "It is the nation's foundation that my people eat heartily and gain strength. Fill your stomach with a hot bowl of 'Seolleongtang' (ox bone soup) packed with rich broth and meat.",
    recommendedFoodKo: "설렁탕 🍲",
    recommendedFoodEn: "Seolleongtang 🍲",
    bgGradient: "from-amber-900/40 via-red-950/30 to-slate-950",
    stickerEmoji: "👑"
  },
  "miyamoto-musashi": {
    slug: "miyamoto-musashi",
    nameKo: "미야모토 무사시",
    nameEn: "Miyamoto Musashi",
    avatar: "/images/giants/miyamoto-musashi.jpg",
    userQuestionKo: "무사시님, 오늘 점심 메뉴 추천해 주세요!",
    userQuestionEn: "Musashi-dono, recommend a lunch menu for me!",
    giantAnswerKo: "싸움터에서는 모든 군더더기를 베어내야 하오. 화려함 대신 소박하지만 단단한 '주먹밥' 하나로 배를 든든히 채우고, 언제든 검을 뽑을 준비를 마칠 뿐이오.",
    giantAnswerEn: "On the battlefield, one must cut away all superficial things. Fill your stomach with a humble yet solid 'Onigiri' (rice ball) instead of luxury, and be ready to draw your sword.",
    recommendedFoodKo: "오니기리 / 주먹밥 🍙",
    recommendedFoodEn: "Onigiri / Rice Ball 🍙",
    bgGradient: "from-emerald-950/40 via-neutral-900/30 to-slate-950",
    stickerEmoji: "⚔️"
  },
  "napoleon-bonaparte": {
    slug: "napoleon-bonaparte",
    nameKo: "나폴레옹 보나파르트",
    nameEn: "Napoleon Bonaparte",
    avatar: "/images/giants/napoleon-bonaparte.jpg",
    userQuestionKo: "황제님, 오늘 뭐 먹을까요?",
    userQuestionEn: "Your Majesty, what should I eat today?",
    giantAnswerKo: "승리는 움직이는 자의 것이며, 행군을 지체해선 안 되오! 한 손에 쥐고 돌격하면서 뜯어 먹을 수 있는 단단한 '바게트 빵'과 찬 고기 조각이면 충분하오. 돌격!",
    giantAnswerEn: "Victory belongs to the swift; we must not delay our march! A piece of hard 'Baguette' and cold meat, eaten on the run, is more than enough. Charge!",
    recommendedFoodKo: "바게트 & 햄 🥖",
    recommendedFoodEn: "Baguette & Cold Meat 🥖",
    bgGradient: "from-blue-950/40 via-red-950/20 to-neutral-950",
    stickerEmoji: "🦅"
  },
  "alexander-fleming": {
    slug: "alexander-fleming",
    nameKo: "알렉산더 플레밍",
    nameEn: "Alexander Fleming",
    avatar: "/images/giants/alexander-fleming.jpg",
    userQuestionKo: "플레밍 박사님, 오늘 점심은 뭐가 좋을까요?",
    userQuestionEn: "Dr. Fleming, what's good for lunch today?",
    giantAnswerKo: "우연한 발견도 결국 예리한 관찰에서 태어난다네. 마치 페트리 접시 위에 우연히 핀 푸른곰팡이처럼, 도우 위에 다채롭게 흩뿌려진 치즈와 토핑이 맛을 내는 '피자'를 탐색해 보게나.",
    giantAnswerEn: "Accidental discovery is born of keen observation. Look closely at a slice of 'Pizza', where cheese and toppings are scattered like mold colonies on a petri dish, and enjoy.",
    recommendedFoodKo: "페퍼로니 피자 🍕",
    recommendedFoodEn: "Pepperoni Pizza 🍕",
    bgGradient: "from-cyan-950/40 via-indigo-950/30 to-slate-950",
    stickerEmoji: "🔬"
  },
  "yi-sun-shin": {
    slug: "yi-sun-shin",
    nameKo: "이순신",
    nameEn: "Yi Sun-shin",
    avatar: "/images/giants/yi-sun-shin.jpg",
    userQuestionKo: "장군님, 오늘 점심 식사 메뉴를 청합니다.",
    userQuestionEn: "General, I request a lunch menu suggestion.",
    giantAnswerKo: "바다의 풍랑 속에서도 아군의 기운이 꺾이지 않아야 승리하는 법. 척박한 전장에서도 굳건히 견딜 수 있도록 든든한 '보리밥'과 힘을 복돋우는 '생선구이'로 기운을 차리시오.",
    giantAnswerEn: "Even in sea storms, we triumph only when resolve never wavers. Restore your strength with hearty 'Barley Rice' and 'Grilled Fish' built to withstand the harshest campaign.",
    recommendedFoodKo: "보리밥과 생선구이 🐟",
    recommendedFoodEn: "Barley Rice & Grilled Fish 🐟",
    bgGradient: "from-blue-950/50 via-teal-950/20 to-zinc-950",
    stickerEmoji: "🛡️"
  }
}

export default function ReelsDemoPage() {
  const locale = useLocale()
  const isKo = locale === "ko"

  const [currentGiant, setCurrentGiant] = useState<string>("king-sejong")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0) // 0: Start, 1: Question, 2: Typing, 3: Answer, 4: Food Reveal
  const [typedAnswer, setTypedAnswer] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true)

  // Recording-related States
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingSupported, setRecordingSupported] = useState<boolean>(false)

  const scenario = REELS_SCENARIOS[currentGiant]
  const giantName = isKo ? scenario.nameKo : scenario.nameEn
  const userQuestion = isKo ? scenario.userQuestionKo : scenario.userQuestionEn
  const giantAnswer = isKo ? scenario.giantAnswerKo : scenario.giantAnswerEn
  const recommendedFood = isKo ? scenario.recommendedFoodKo : scenario.recommendedFoodEn

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stepTimerRef1 = useRef<NodeJS.Timeout | null>(null)
  const stepTimerRef2 = useRef<NodeJS.Timeout | null>(null)
  const stepTimerRef3 = useRef<NodeJS.Timeout | null>(null)

  // DOM and Recording Refs
  const viewportRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const recordingVideoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Check if recording APIs are supported on the client
    if (typeof window !== "undefined" && navigator.mediaDevices && (window.MediaRecorder || (window as any).MediaRecorder)) {
      setRecordingSupported(true)
    }
  }, [])

  // Sound generator helpers using Web Audio API for immersive retro 8-bit sound effects
  const playBeep = (freq: number, duration: number, type: OscillatorType = "sine") => {
    if (!audioEnabled) return
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      
      osc.type = type
      osc.frequency.value = freq
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
      
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      
      osc.start()
      osc.stop(audioCtx.currentTime + duration)
    } catch (e) {
      console.warn("Audio Context block:", e)
    }
  }

  const playTypeSound = () => {
    playBeep(450 + Math.random() * 100, 0.05, "triangle")
  }

  const playSuccessSound = () => {
    if (!audioEnabled) return
    playBeep(440, 0.1, "sine")
    setTimeout(() => playBeep(880, 0.2, "sine"), 100)
  }

  const playPopSound = () => {
    playBeep(300, 0.08, "sine")
  }

  const startReel = () => {
    // Clear any active timers
    resetTimeline()

    setIsPlaying(true)
    setStep(1) // Show user question
    playPopSound()

    // 1. Wait 2.2 seconds, then transition to Giant Typing
    stepTimerRef1.current = setTimeout(() => {
      setStep(2)
      // Typing sound loop simulator
      let charIdx = 0
      setTypedAnswer("")
      
      const typeNextChar = () => {
        if (charIdx < giantAnswer.length) {
          setTypedAnswer((prev) => prev + giantAnswer.charAt(charIdx))
          playTypeSound()
          charIdx++
          const speed = giantAnswer.charAt(charIdx) === " " ? 180 : 70
          typingTimerRef.current = setTimeout(typeNextChar, speed)
        } else {
          // Finished typing -> Go to Food Reveal
          setStep(4)
          playSuccessSound()
          
          // Auto-stop recording if active after final reveal
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            setTimeout(() => {
              stopRecording()
            }, 2000)
          }
        }
      }
      
      // transition to typing state, wait 1s before actual typing starts
      stepTimerRef2.current = setTimeout(() => {
        setStep(3) // Showing text
        typeNextChar()
      }, 1000)

    }, 2200)
  }

  const resetTimeline = () => {
    setIsPlaying(false)
    setStep(0)
    setTypedAnswer("")
    
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    if (stepTimerRef1.current) clearTimeout(stepTimerRef1.current)
    if (stepTimerRef2.current) clearTimeout(stepTimerRef2.current)
    if (stepTimerRef3.current) clearTimeout(stepTimerRef3.current)
  }

  // 🎥 1번 방식: 실시간 비디오 녹화 모듈 (MediaRecorder + Canvas Crop)
  const startRecording = async () => {
    if (isRecording) return
    recordedChunksRef.current = []
    
    try {
      // 1. Ask permission to capture the browser tab
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser"
        } as any,
        audio: false
      })

      setIsRecording(true)
      streamRef.current = displayStream

      // 2. Setup hidden video element to feed the stream
      const video = document.createElement("video")
      video.srcObject = displayStream
      video.muted = true
      video.playsInline = true
      await video.play()
      recordingVideoRef.current = video

      // 3. Setup canvas with standard 9:16 vertical resolution (e.g. 540x960)
      const canvas = document.createElement("canvas")
      canvas.width = 540
      canvas.height = 960
      canvasRef.current = canvas
      const ctx = canvas.getContext("2d")

      // 4. Render loop: crop reels viewport from the screen stream
      const drawFrame = () => {
        if (!displayStream.active || !ctx || !viewportRef.current) {
          stopRecording()
          return
        }

        const rect = viewportRef.current.getBoundingClientRect()
        const tabWidth = window.innerWidth
        const tabHeight = window.innerHeight

        // Compute crop boundaries mapping screen resolution to original stream
        const sx = (rect.left / tabWidth) * video.videoWidth
        const sy = (rect.top / tabHeight) * video.videoHeight
        const sw = (rect.width / tabWidth) * video.videoWidth
        const sh = (rect.height / tabHeight) * video.videoHeight

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw cropped viewport inside canvas
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
        
        animationFrameRef.current = requestAnimationFrame(drawFrame)
      }

      drawFrame()

      // 5. Create media recorder for the cropped canvas stream
      const canvasStream = canvas.captureStream(30) // 30 FPS
      const recorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm;codecs=vp9"
      })

      mediaRecorderRef.current = recorder
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        
        // Download the WebM video automatically
        const a = document.createElement("a")
        a.href = url
        a.download = `${scenario.slug}_lunch_reels.webm`
        document.body.appendChild(a)
        a.click()
        
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 100)

        setIsRecording(false)
        playSuccessSound()
      }

      // Start recording and launch timeline simulation
      recorder.start()
      startReel()

    } catch (err) {
      console.error("Failed to start screen recording:", err)
      setIsRecording(false)
      alert(isKo 
        ? "녹화 시작에 실패했습니다. 화면 공유 창에서 '현재 탭'을 선택하셔야 올바른 크롭 녹화가 지원됩니다."
        : "Failed to start recording. Please make sure to share the 'Current Tab' for accurate cropping."
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (recordingVideoRef.current) {
      recordingVideoRef.current.pause()
      recordingVideoRef.current = null
    }
  }

  useEffect(() => {
    resetTimeline()
    return () => {
      resetTimeline()
      stopRecording()
    }
  }, [currentGiant])

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans" style={{ background: "var(--rd-bg-base)", color: "var(--rd-text-body)" }}>
      
      {/* Sticky Header - Hides in full screen mode for screen recording */}
      {!isFullscreen && (
        <header className="w-full px-6 py-4 rd-hairline-bottom rd-bg-surface flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="p-2 rounded-lg border rd-hairline rd-bg-surface rd-text-muted hover:opacity-70 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-lg font-bold flex items-center gap-1.5 rd-text-ink">
                <Sparkles className="w-4 h-4 rd-accent" />
                {isKo ? "거인의 점심 추천 릴스 메이커" : "Giants' Lunch Reels Maker"}
              </h1>
              <p className="rd-caption">Instagram Reels 9:16 Mockup Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-lg border rd-hairline rd-bg-surface rd-text-muted hover:opacity-70 transition-opacity cursor-pointer"
              title="Toggle sound effects"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 rd-accent" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="px-2 py-0.5 rounded rd-caption font-bold border rd-hairline rd-accent" style={{ background: "var(--rd-divider-faint)" }}>
              STABLE v1.0
            </span>
          </div>
        </header>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8 z-10 overflow-hidden min-h-0">
        
        {/* Left Side: Reels Live Player Frame (9:16) */}
        <div className={`relative flex flex-col items-center justify-center transition-all duration-300 shrink-0 ${
          isFullscreen ? "w-full max-w-[430px] h-[92vh] max-h-[850px] md:scale-100 scale-95" : "w-[360px] h-[640px] md:w-[410px] md:h-[730px]"
        }`}>
          {/* Neon border glow surrounding phone body */}
          
          {/* Virtual Phone Mockup Body */}
          <div className="relative w-full h-full bg-slate-900 border-[10px] border-slate-800 rounded-[38px] overflow-hidden flex flex-col shadow-2xl ring-4 ring-amber-500/10">
            {/* Top camera notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-2xl z-40 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-slate-900 mr-2" />
              <div className="w-10 h-1 bg-slate-900 rounded-sm" />
            </div>

            {/* Reels Video Viewport Container */}
            <div 
              ref={viewportRef}
              id="reels-viewport"
              className={`flex-1 relative overflow-hidden bg-gradient-to-b ${scenario.bgGradient} transition-all duration-1000 flex flex-col justify-between p-6 pt-14 pb-8`}
            >
              
              {/* Animated Floating Stardust Particle Overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWRHRg0iaD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjIuNSIgY3k9IjIuNSIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgo8L3N2Zz4=')] opacity-20" />

              {/* Instantly customizable full screen overlay banner */}
              <div className="absolute top-12 left-6 right-6 flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/5 z-20">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20">
                  <Image 
                    src={scenario.avatar} 
                    alt={giantName} 
                    fill
                    sizes="36px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-white leading-tight flex items-center gap-1">
                    {giantName}
                    <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500 text-slate-950 font-sans font-extrabold tracking-wider scale-90">{scenario.stickerEmoji}</span>
                  </h4>
                  <p className="text-[8px] text-white/60 tracking-wider">@giants_wisdom • {isKo ? "오늘의 지혜 식단" : "Today's Wisdom Lunch"}</p>
                </div>
              </div>

              {/* Chat Dialog Stream */}
              <div className="flex-1 flex flex-col justify-end gap-5 mb-4 z-10">
                
                {/* 1. User Question Bubble */}
                {step >= 1 && (
                  <m.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] bg-amber-500 text-slate-950 font-semibold px-4 py-3 rounded-2xl rounded-tr-sm shadow-md text-xs leading-relaxed">
                      {userQuestion}
                    </div>
                  </m.div>
                )}

                {/* 2. Giant Reply Box */}
                {step >= 2 && (
                  <m.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col gap-2 items-start"
                  >
                    {/* Avatar identity */}
                    <div className="flex items-center gap-1.5 ml-1">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20">
                        <Image 
                          src={scenario.avatar} 
                          alt={giantName} 
                          fill
                          sizes="20px"
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[9px] text-white/50">{giantName}</span>
                    </div>

                    <div className="max-w-[90%] bg-black/40 backdrop-blur-md text-white border border-white/10 px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-xl text-xs leading-relaxed min-h-[50px] relative">
                      {step === 2 ? (
                        /* Typing Indicator dot sequence */
                        <div className="flex items-center gap-1 py-1 px-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      ) : (
                        /* Output answer with cursor icon */
                        <p className="whitespace-pre-wrap">
                          {typedAnswer}
                          {step === 3 && <span className="inline-block w-1.5 h-3.5 bg-amber-400 animate-pulse ml-0.5" />}
                        </p>
                      )}
                    </div>
                  </m.div>
                )}

                {/* 3. Ultimate Food Recommendation Reveal Banner */}
                {step >= 4 && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 12 }}
                    className="w-full flex flex-col items-center justify-center mt-4"
                  >
                    <div className="relative bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 py-3.5 px-6 rounded-2xl shadow-2xl border-2 border-white/30 text-center font-serif font-black tracking-wide overflow-hidden max-w-[90%] flex flex-col gap-1 ring-4 ring-amber-500/30">
                      {/* Inner gold glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                      <span className="text-[9px] uppercase font-sans font-bold tracking-widest text-slate-900/60 leading-none">
                        {isKo ? "추천 점심 식단" : "Recommended Lunch"}
                      </span>
                      <span className="text-lg leading-snug drop-shadow-md">
                        {recommendedFood}
                      </span>
                    </div>
                  </m.div>
                )}

              </div>

              {/* Bottom reels signature watermark info */}
              <div className="mt-auto flex justify-between items-end z-10 border-t border-white/5 pt-4">
                <div>
                  <h5 className="text-[10px] font-bold text-white">#wisdom_giants</h5>
                  <p className="text-[8px] text-white/55 mt-0.5">{isKo ? "역사의 숨결로 맛보는 한 끼" : "Taste history in a single meal."}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20 animate-spin-slow">
                  <span className="text-[10px] leading-none">{scenario.stickerEmoji}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Fullscreen restore button helper (appears absolute when fullscreen) */}
          {isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-4 -right-4 rd-surface rd-text-ink hover:opacity-90 transition-opacity p-2.5 rounded-full cursor-pointer z-50"
              title="Exit Fullscreen Mode"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Side: Setup Control Dashboard */}
        {!isFullscreen && (
          <div className="flex-1 max-w-md w-full flex flex-col gap-6 md:p-2">
            
            {/* 1. Character Slider Panel */}
            <div className="rd-surface p-5" style={{ borderRadius: "var(--rd-card-radius)" }}>
              <h3 className="text-sm font-bold rd-text-body mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 rd-accent" />
                {isKo ? "위인 선택" : "Select Giant"}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                {Object.keys(REELS_SCENARIOS).map((key) => {
                  const item = REELS_SCENARIOS[key]
                  const isSelected = currentGiant === key
                  const name = isKo ? item.nameKo : item.nameEn
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentGiant(key)
                        resetTimeline()
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "rd-selected"
                          : "rd-bg-surface rd-hairline rd-text-body hover:opacity-80"
                      }`}
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border rd-hairline">
                        <Image 
                          src={item.avatar} 
                          alt={name} 
                          fill
                          sizes="32px"
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-xs font-medium tracking-tight truncate">{name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Timeline Controls Panel */}
            <div className="rd-surface p-5 flex flex-col gap-4" style={{ borderRadius: "var(--rd-card-radius)" }}>
              <h3 className="text-sm font-bold rd-text-body flex items-center gap-1.5">
                <Play className="w-4 h-4 rd-accent" />
                {isKo ? "시뮬레이터 제어" : "Simulator Timeline"}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={startReel}
                  disabled={isPlaying || isRecording}
                  className="flex-1 min-w-[120px] py-3 px-4 rd-bg-accent border font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 cursor-pointer text-sm"
                  style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isKo ? "릴스 재생" : "Play Reel"}
                </button>
                <button
                  onClick={resetTimeline}
                  disabled={isRecording}
                  className="py-3 px-4 border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
                  style={{ borderRadius: "var(--rd-card-radius)" }}
                >
                  <RotateCcw className="w-4 h-4" />
                  {isKo ? "초기화" : "Reset"}
                </button>
              </div>

              {/* 🎥 Real-time In-browser Recording Controls */}
              {recordingSupported && (
                <div className="pt-4 flex flex-col gap-2.5" style={{ borderTop: "1px solid var(--rd-border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold rd-text-body">{isKo ? "브라우저 화면 녹화 (1번 방식)" : "Browser Recording (Method 1)"}</span>
                    {isRecording && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full animate-ping" style={{ background: "var(--rd-error)" }} />
                        <span className="text-[10px] font-extrabold" style={{ color: "var(--rd-error)" }}>REC</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={startRecording}
                      disabled={isRecording}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs ${
                        isRecording
                          ? "rd-rec-active"
                          : "rd-rec-idle"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      {isKo ? "원클릭 녹화 시작" : "One-Click Record"}
                    </button>
                    {isRecording && (
                      <button
                        onClick={stopRecording}
                        className="py-2.5 px-4 rd-bg-surface border hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                        style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-error)", color: "var(--rd-error)" }}
                      >
                        {isKo ? "녹화 중지" : "Stop"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Fullscreen and Recording Guide */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="py-2.5 px-3 rounded-lg border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-opacity"
                >
                  <Monitor className="w-3.5 h-3.5 rd-accent" />
                  {isKo ? "풀스크린 녹화 모드" : "Fullscreen Record"}
                </button>
                <button
                  onClick={() => {
                    playSuccessSound()
                    alert(isKo 
                      ? "1. '원클릭 녹화 시작'을 누르면 공유 창이 나타납니다.\n2. 공유 창에서 반드시 '현재 크롬 탭'을 선택해 주셔야 9:16 릴스 영역만 깔끔하게 크롭되어 녹화가 시작됩니다.\n3. 대화 시뮬레이션이 모두 끝나면 녹화가 자동으로 정지되고 비디오 파일(.webm)이 즉시 다운로드됩니다!"
                      : "1. Click 'One-Click Record' to see the sharing prompt.\n2. Make sure to select 'Current Tab' so that the 9:16 layout gets accurately cropped.\n3. Once the simulation concludes, the recording stops automatically and downloads the video (.webm)."
                    )
                  }}
                  className="py-2.5 px-3 rounded-lg border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-opacity"
                >
                  <Download className="w-3.5 h-3.5 rd-accent" />
                  {isKo ? "녹화 상세 가이드" : "Recording Guide"}
                </button>
              </div>
            </div>

            {/* 3. Pro Tips Panel */}
            <div className="p-4 border rd-hairline text-[11px] rd-text-body leading-relaxed flex flex-col gap-1.5" style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}>
              <span className="font-bold rd-accent text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isKo ? "프로 릴스 제작자 팁" : "Pro Reels Creator Tips"}
              </span>
              <p>
                {isKo 
                  ? "1. '원클릭 녹화 시작' 클릭 시 브라우저 보안에 의해 탭 선택창이 뜹니다. 반드시 '현재 탭' 혹은 '이 탭(This Tab)'을 전체 화면 공유로 잡으셔야 9:16 폰 프레임만 정확히 추출해냅니다."
                  : "1. When starting recorder, pick 'Current Tab' under Chrome tab sharing to extract only the 9:16 phone mockup."}
              </p>
              <p>
                {isKo 
                  ? "2. 대화 중간 중간 흘러나오는 사운드는 Web Audio API로 자동 생성되는 효과음입니다. 인스타 업로드 시에는 트렌디한 인스타 음원(BGM)을 위에 얹으시면 더욱 완벽해집니다."
                  : "2. The typing sound effects are generated via Web Audio API. Overlay trendy Instagram BGM during upload."}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
