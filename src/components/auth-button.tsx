"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { toast } from "sonner"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, MessageCircle, LogOut, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { LoginModal } from "./login-modal"

export function AuthButton() {
  const t = useTranslations("Auth")
  const navT = useTranslations("Navigation")
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setStatus(currentUser ? "authenticated" : "unauthenticated")
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (status === "loading") {
    return (
      <div className="w-[100px] h-10 rounded-xl glass border border-white/5 animate-pulse flex items-center justify-center">
        <Loader2 className="w-4 h-4 text-amber-500/20 animate-spin" />
      </div>
    )
  }

  if (status === "authenticated" && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full glass border border-white/10 hover:bg-white/5 transition-all outline-none group">
            <Avatar className="w-8 h-8 border border-white/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-amber-500/20 text-amber-200 text-[10px]">
                {user.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium text-foreground group-hover:text-amber-200 transition-colors">
              {user.displayName?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 glass border-white/10 p-2 mt-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 p-1">
              <p className="text-sm font-medium leading-none text-foreground">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild>
            <Link href="/chats" className="cursor-pointer flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-amber-200 hover:bg-amber-500/10 transition-colors group">
              <MessageCircle className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400" />
              <span>{t("chatList")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-lg text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-rose-500/50 group-hover:text-rose-400" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsLoginModalOpen(true)}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {navT("login")}
      </button>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
