"use client"

import { useState, useEffect, useRef } from "react"
import { auth, db } from "@/lib/firebase"
import Image from "next/image"
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Clock, ChevronRight, Loader2, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ko, enUS } from "date-fns/locale"
import { Link } from "@/i18n/routing"

interface ChatHistory {
  id: string
  giantId: string
  giantSlug: string
  giantName: string
  giantImage?: string
  lastMessage: string
  updatedAt: Timestamp
  messageCount: number
}

export default function ChatsPage() {
  const t = useTranslations("Chats")
  const authT = useTranslations("Auth")
  const locale = useLocale()
  const router = useRouter()
  
  const [chats, setChats] = useState<ChatHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(auth?.currentUser || null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchChats(currentUser.uid);
      } else {
        setChats([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchChats = async (uid: string) => {
    if (!db) return;
    
    // Explicitly abort redundant fetches to avoid HTTP/2 socket bottlenecks
    if (fetchingRef.current) {
      console.log("🛑 [Guard]: Duplicate execution aborted to prevent server socket deadlock.");
      return;
    }
    
    try {
      fetchingRef.current = true;
      console.time("chats-fetch-perf");
      console.log("[Firestore]: Starting fast one-time chat history fetch...");
      setLoading(true);
      
      const q = query(collection(db, "chats"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q); // Pure one-time call
      
      const fetchedChats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatHistory[];

      // Client-side sort for absolute safety against server-side index latency
      const sortedChats = fetchedChats.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis?.() || 0;
        const timeB = b.updatedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setChats(sortedChats);
      console.log(`[Firestore]: Successfully fetched ${sortedChats.length} chats.`);
    } catch (error) {
      console.error("🚨 [Firestore Fetch Error]:", error);
    } finally {
      console.timeEnd("chats-fetch-perf");
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const dateLocale = locale === "ko" ? ko : enUS

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl break-keep">
            {t("description")}
          </p>
        </div>

        {!user ? (
          <div className="glass-card rounded-[2rem] p-12 flex flex-col items-center text-center border-amber-500/10">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              {authT("signInRequired")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {authT("loginModalDescription")}
            </p>
            <Link 
              href="/"
              className="px-8 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-600 transition-all shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
            >
              {authT("continueWithGoogle")}
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading your wisdom echoes...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-12 flex flex-col items-center text-center border-white/5">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              {t("emptyTitle")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("emptyDescription")}
            </p>
            <Link 
              href="/#giants"
              className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
            >
              {t("startFirstChat")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/giant/${chat.giantSlug || chat.giantId}?chat=true`}
                  className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-amber-500/30 transition-all p-5 flex items-center gap-5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <Avatar className="w-14 h-14 border border-white/10 shadow-lg overflow-hidden relative">
                    <Image 
                      src={chat.giantImage || `/images/giants/${chat.giantSlug || chat.giantId}.jpg`} 
                      alt={chat.giantName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  <AvatarFallback className="bg-amber-500/10 text-amber-500 font-serif">
                    {chat.giantName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-amber-200 transition-colors truncate">
                      {chat.giantName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {chat.updatedAt 
                        ? formatDistanceToNow(chat.updatedAt.toDate(), { addSuffix: true, locale: dateLocale }) 
                        : (locale === "ko" ? "방금 전" : "just now")}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-zinc-300 transition-colors">
                    {chat.lastMessage}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] uppercase tracking-widest text-amber-500/50 font-bold">
                      {chat.messageCount} {t("messages")}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
