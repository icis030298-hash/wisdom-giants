"use client"

import { useState, useEffect } from "react"
import { Cookie } from "lucide-react"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("giants_cookie_consent")
      if (!consent) {
        // Small delay for elegant slide-up entry
        const timer = setTimeout(() => setShowBanner(true), 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("giants_cookie_consent", "granted")
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("giants_cookie_consent", "denied")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl transition-all duration-500 ease-out animate-fade-in-up">
      <div className="bg-[#0B0F1A]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        {/* Glowing Decorative Orbs */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-700" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0 text-amber-400">
              <Cookie className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-white font-bold text-base flex items-center gap-2">
                쿠키 동의 설정 <span className="text-slate-400 font-normal text-xs">/ Cookie Consent</span>
              </h4>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-light">
                본 서비스는 맞춤형 광고(Google AdSense) 제공 및 분석을 위해 쿠키를 사용합니다. 동의하시면 더욱 최적화된 거인들의 지혜를 경험하실 수 있습니다.
                <br />
                <span className="text-slate-400 text-[11px] block mt-1">
                  We use cookies to personalize ads and analyze traffic. By clicking accept, you consent to our use of cookies.
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
            >
              거부 <span className="opacity-50">/ Decline</span>
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              모두 동의 <span className="opacity-75">/ Accept All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
