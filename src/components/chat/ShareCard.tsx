"use client"

import { useRef, useState } from "react"
import html2canvas from "html2canvas"
import { useTranslations } from "next-intl"

interface ShareCardProps {
  giant: {
    slug: string
    name: string
    category: string
    imageUrl?: string
  }
  userMessage: string
  giantResponse: string
  locale: string
  onClose: () => void
}

export function ShareCard({
  giant,
  userMessage,
  giantResponse,
  locale,
  onClose
}: ShareCardProps) {
  const t = useTranslations("ShareCard")
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  // Trim response to fit on the card nicely
  const trimmedResponse =
    giantResponse.length > 200
      ? giantResponse.slice(0, 197) + "..."
      : giantResponse

  const trimmedQuestion =
    userMessage.length > 80
      ? userMessage.slice(0, 77) + "..."
      : userMessage

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    try {
      // Small timeout to ensure fonts and styles are fully applied
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true
      })

      const link = document.createElement("a")
      link.download = `giants-wisdom-${giant.slug}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      setIsGenerated(true)
      setTimeout(() => setIsGenerated(false), 2000)
    } catch (e) {
      console.error("Failed to generate card image:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `giants-wisdom-${giant.slug}.png`, {
          type: "image/png"
        })

        // Web Share API (especially for mobile devices)
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              title: t("myQuestion"),
              text: `"${trimmedResponse}" - ${giant.name}`,
              files: [file]
            })
          } catch (shareErr) {
            // User cancelled share or other error, fallback to download
            if ((shareErr as Error).name !== "AbortError") {
              console.error("Web share failed, falling back to download:", shareErr)
              handleDownload()
            }
          }
        } else {
          // Desktop or unsupported browser: trigger download
          const link = document.createElement("a")
          link.download = `giants-wisdom-${giant.slug}.png`
          link.href = URL.createObjectURL(blob)
          link.click()
          setIsGenerated(true)
          setTimeout(() => setIsGenerated(false), 2000)
        }
      }, "image/png")
    } catch (e) {
      console.error("Card share failed:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-2xl relative animate-fade-in-up">
        {/* Card Canvas Area */}
        <div
          ref={cardRef}
          style={{
            background: "linear-gradient(135deg, #0f0e17 0%, #1a1625 50%, #0f1923 100%)",
            borderRadius: "20px",
            padding: "32px",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            position: "relative",
            overflow: "hidden",
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Radial gradient glow decorations (styled carefully so html2canvas renders them) */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
              pointerEvents: "none"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
              pointerEvents: "none"
            }}
          />

          {/* Header Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              position: "relative",
              zIndex: 2
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(245,158,11,0.35)",
                flexShrink: 0,
                background: "rgba(245,158,11,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {giant.imageUrl ? (
                <img
                  src={giant.imageUrl}
                  alt={giant.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top"
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <span style={{ fontSize: "24px" }}>🏛️</span>
              )}
            </div>

            <div>
              <p
                style={{
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "17px",
                  margin: 0,
                  lineHeight: "1.2"
                }}
              >
                {giant.name}
              </p>
              <p
                style={{
                  color: "#f59e0b",
                  fontSize: "12px",
                  fontWeight: "500",
                  margin: "3px 0 0",
                  opacity: 0.85
                }}
              >
                {giant.category}
              </p>
            </div>

            {/* Decorative Quote Mark */}
            <div
              style={{
                marginLeft: "auto",
                fontSize: "44px",
                color: "rgba(245,158,11,0.12)",
                lineHeight: 1,
                fontFamily: "Georgia, serif",
                alignSelf: "flex-start",
                marginTop: "-8px"
              }}
            >
              ❝
            </div>
          </div>

          {/* Quote Content Section */}
          <p
            style={{
              color: "#f1f0eb",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: "0 0 24px",
              fontStyle: "italic",
              letterSpacing: "0.01em",
              position: "relative",
              zIndex: 2,
              wordBreak: "break-word"
            }}
          >
            {trimmedResponse}
          </p>

          {/* User Question Section */}
          {trimmedQuestion && (
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "16px",
                marginBottom: "20px",
                position: "relative",
                zIndex: 2
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "10px",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: "700"
                }}
              >
                {t("myQuestion")}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "13px",
                  margin: 0,
                  lineHeight: "1.45",
                  wordBreak: "break-word"
                }}
              >
                &ldquo;{trimmedQuestion}&rdquo;
              </p>
            </div>
          )}

          {/* Brand/Footer Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 2
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px" }}>🏛️</span>
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "800",
                  fontSize: "12px",
                  letterSpacing: "0.05em"
                }}
              >
                Giants Wisdom
              </span>
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "11px",
                fontWeight: "500"
              }}
            >
              giantswisdom.com
            </span>
          </div>
        </div>

        {/* Buttons Controls */}
        <div className="mt-6 space-y-3">
          {/* Download Image Button */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>{t("generating")}</span>
              </>
            ) : isGenerated ? (
              <span>✅ {t("saved")}</span>
            ) : (
              <>
                <span>⬇️</span>
                <span>{t("downloadButton")}</span>
              </>
            )}
          </button>

          {/* Share Button (Web Share) */}
          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 border border-stone-700 cursor-pointer"
          >
            <span>📤</span>
            <span>{t("shareButton2")}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 text-stone-500 hover:text-stone-400 text-sm font-medium transition-colors cursor-pointer"
          >
            {locale === "ko" ? "닫기" : "Close"}
          </button>
        </div>
      </div>
    </div>
  )
}
