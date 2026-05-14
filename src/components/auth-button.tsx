"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
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
import { ChevronDown, LayoutDashboard, LogOut, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"

export function AuthButton() {
  const t = useTranslations("Navigation")
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setStatus(user ? "authenticated" : "unauthenticated")
      } catch (error) {
        setStatus("unauthenticated")
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setStatus(session?.user ? "authenticated" : "unauthenticated")
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) toast.error(error.message)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error(error.message)
    else router.push("/")
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
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarImage src={user.user_metadata?.avatar_url || ""} />
              <AvatarFallback className="bg-amber-500/20 text-amber-200 text-[10px]">
                {user.user_metadata?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium text-foreground group-hover:text-amber-200 transition-colors">
              {user.user_metadata?.full_name?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 glass border-white/10 p-2 mt-2">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">{user.user_metadata?.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild>
            <Link href="/chats" className="cursor-pointer flex items-center gap-2 text-muted-foreground focus:text-amber-200 focus:bg-amber-500/10">
              <LayoutDashboard className="w-4 h-4" />
              <span>{t("chatList")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center gap-2 text-rose-400 focus:text-rose-300 focus:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <button 
      onClick={handleSignIn}
      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
    >
      {t("login")}
    </button>
  )
}
