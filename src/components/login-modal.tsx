"use client"

import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup } from "firebase/auth"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations("Auth")

  const handleGoogleLogin = async () => {
    // 1. Check if our firebase safeguard blocked the auth instance
    if (!auth) {
      toast.error("Firebase Configuration Error: Auth instance is null.");
      return;
    }

    try {
      console.log("[Auth]: Attempting Google Popup Login...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Auth]: Login Success!", result.user.displayName);
      toast.success(`Welcome back, ${result.user.displayName}!`);
      onClose()
    } catch (error: any) {
      console.error("[Auth Error]:", error);
      // 2. Alert the exact firebase error using beautiful non-blocking toast
      toast.error(error.message || "Authentication failed");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* This opens over a cream page, so a translucent near-black panel with
          an amber hairline on top of it was the single most jarring thing left
          in the header. Opaque surface, one border, no gradient strip. */}
      <DialogContent
        className="sm:max-w-[420px] rd-surface p-0 overflow-hidden"
        style={{ borderRadius: "var(--rd-card-radius)" }}
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div
            className="w-16 h-16 flex items-center justify-center mb-6 rd-bg-accent"
            style={{ borderRadius: "var(--rd-card-radius)" }}
          >
            <Sparkles className="w-8 h-8" />
          </div>

          <DialogHeader className="space-y-3 mb-8">
            <DialogTitle className="text-2xl font-serif font-bold rd-text-ink">
              {t("loginModalTitle")}
            </DialogTitle>
            <DialogDescription className="rd-text-body text-base leading-relaxed">
              {t("loginModalDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Google's brand guidelines require the button keep a white face and
              the coloured mark, so this one stays white on purpose — it is a
              third-party affordance, not part of the palette. */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border rd-hairline font-bold text-base hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--rd-card-radius)", color: "#3c4043", transitionDuration: "120ms" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("continueWithGoogle")}
          </button>
          
          <p className="mt-8 rd-caption">
            By continuing, you agree to our <span className="rd-accent">Terms of Service</span> and <span className="rd-accent">Privacy Policy</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
