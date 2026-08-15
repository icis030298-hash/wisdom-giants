"use client"

import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { onAuthStateChanged, signOut, User, deleteUser } from "firebase/auth"
import { toast } from "sonner"
import { useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, MessageCircle, LogOut, Loader2, AlertTriangle } from "lucide-react"
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
    if (!auth) {
      setStatus("unauthenticated")
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setStatus(currentUser ? "authenticated" : "unauthenticated")
    })

    return () => unsubscribe()
  }, [])

  
  const locale = useLocale()
  
  const handleDeleteAccount = async () => {
    if (!auth || !user || !db) return
    const isKo = locale === 'ko'
    if (!confirm(isKo ? '정말 계정을 삭제하시겠습니까? 모든 대화 기록이 영구적으로 삭제되며 복구할 수 없습니다.' : 'Are you sure you want to delete your account? All chat history will be permanently deleted and cannot be recovered.')) {
      return
    }

    try {
      toast.loading(isKo ? '계정 삭제 중...' : 'Deleting account...')
      // 1. Delete all user chats and their messages subcollections
      const chatsRef = collection(db, 'chats')
      const q = query(chatsRef, where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      
      const deletePromises = []
      for (const chatDoc of querySnapshot.docs) {
        // Delete messages subcollection
        const messagesRef = collection(db, `chats/${chatDoc.id}/messages`)
        const messagesSnapshot = await getDocs(messagesRef)
        messagesSnapshot.forEach(msgDoc => {
          deletePromises.push(deleteDoc(doc(db, `chats/${chatDoc.id}/messages`, msgDoc.id)))
        })
        // Delete the chat document itself
        deletePromises.push(deleteDoc(doc(db, 'chats', chatDoc.id)))
      }
      await Promise.all(deletePromises)

      // 2. Delete user auth
      await deleteUser(user)
      toast.dismiss()
      toast.success(isKo ? '계정이 성공적으로 삭제되었습니다.' : 'Account deleted successfully')
      router.push('/')
    } catch (error: any) {
      toast.dismiss()
      if (error.code === 'auth/requires-recent-login') {
        toast.error(isKo ? '보안을 위해 다시 로그인한 후 탈퇴해주세요.' : 'Please log in again to delete your account for security reasons.')
        await signOut(auth)
      } else {
        toast.error(error.message)
      }
    }
  }

  const handleSignOut = async () => {
    if (!auth) return

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
      <div className="w-[100px] h-10 rd-bg-surface animate-pulse flex items-center justify-center" style={{ border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
        <Loader2 className="w-4 h-4 rd-text-muted animate-spin" />
      </div>
    )
  }

  if (status === "authenticated" && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full rd-bg-surface rd-hairline border transition-colors hover:opacity-80 outline-none group">
            <Avatar className="w-8 h-8 border rd-hairline">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="rd-bg-accent text-[10px]">
                {user.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium rd-text-ink transition-colors">
              {user.displayName?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 rd-bg-surface rd-hairline p-2 mt-2">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 p-1">
              <p className="text-sm font-medium leading-none text-foreground">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator style={{ backgroundColor: "var(--rd-divider-faint)" }} />
          <DropdownMenuItem asChild>
            <Link href="/chats" className="cursor-pointer flex items-center gap-3 p-3 rounded-lg rd-text-body hover:opacity-80 transition-opacity group">
              <MessageCircle className="w-4 h-4 rd-accent" />
              <span>{t("chatList")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator style={{ backgroundColor: "var(--rd-divider-faint)" }} />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-lg text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-rose-500/50 group-hover:text-rose-400" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        
          <DropdownMenuSeparator style={{ backgroundColor: "var(--rd-divider-faint)" }} />
          <DropdownMenuItem 
            onClick={handleDeleteAccount}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-lg text-red-500 focus:text-red-400 focus:bg-red-500/10 transition-colors group"
          >
            <AlertTriangle className="w-4 h-4 text-red-500/70 group-hover:text-red-400" />
            <span>{locale === 'ko' ? '회원 탈퇴' : 'Delete Account'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsLoginModalOpen(true)}
        className="px-6 py-2.5 rd-bg-accent font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[0.99]"
        style={{ borderRadius: "var(--rd-card-radius)" }}
      >
        {navT("login")}
      </button>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
