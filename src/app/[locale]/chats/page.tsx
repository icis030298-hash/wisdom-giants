"use client"

import { useState, useEffect, useRef } from "react"
import { auth, db } from "@/lib/firebase"
import Image from "next/image"
import { deleteDoc, doc, Timestamp } from "firebase/firestore"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Clock, ChevronRight, Loader2, Lock, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ko, enUS } from "date-fns/locale"
import { Link } from "@/i18n/routing"
import { giants } from "@/lib/giants-data"

interface ChatHistory {
  id: string
  giantId: string
  giantSlug: string
  giantName: string
  giantImage?: string
  lastMessage: string
  updatedAt: Timestamp
  messageCount: number
  locale?: string
}

export default function ChatsPage() {
  const t = useTranslations("Chats")
  const authT = useTranslations("Auth")
  const tg = useTranslations("Giants")
  const locale = useLocale()
  const router = useRouter()
  
  const [chats, setChats] = useState<ChatHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(auth?.currentUser || null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Pre-warm token cache to bypass the 40-second Firestore authentication stall
          await currentUser.getIdToken();
        } catch (e) {
          console.warn("Token pre-fetch failed:", e);
        }
        fetchChats(currentUser.uid);
      } else {
        setUser(null);
        setChats([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchChats = async (uid: string) => {
    if (typeof window === "undefined") return;
    if (fetchingRef.current) return;
    if (!auth?.currentUser) return;
    
    fetchingRef.current = true;
    setLoading(true);

    try {
      console.time("① token-wait");
      const token = await auth.currentUser.getIdToken();
      console.timeEnd("① token-wait");
      
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

      console.time("② REST-query");
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            structuredQuery: {
              from: [{ collectionId: "chats" }],
              where: {
                fieldFilter: {
                  field: { fieldPath: "userId" },
                  op: "EQUAL",
                  value: { stringValue: uid },
                },
              },
              orderBy: [
                { field: { fieldPath: "updatedAt" }, direction: "DESCENDING" }
              ],
            },
          }),
        }
      );
      console.timeEnd("② REST-query");

      const results = await response.json();

      if (!Array.isArray(results)) {
        console.warn("[REST Warning]: Expected array from Firestore query, got:", results);
        setChats([]);
        return;
      }

      const fetchedChats = results
        .filter((r: any) => r.document)
        .map((r: any) => {
          const fields = r.document.fields;
          const docId = r.document.name.split("/").pop();
          return {
            id: docId,
            giantId: fields.giantId?.stringValue || "",
            giantSlug: fields.giantSlug?.stringValue || "",
            giantName: fields.giantName?.stringValue || "",
            giantImage: fields.giantImage?.stringValue || undefined,
            lastMessage: fields.lastMessage?.stringValue || "",
            updatedAt: fields.updatedAt?.timestampValue
              ? Timestamp.fromDate(new Date(fields.updatedAt.timestampValue))
              : null,
            messageCount: Number(
              fields.messageCount?.integerValue ||
              fields.messageCount?.doubleValue || 0
            ),
            locale: fields.locale?.stringValue || "",
          } as ChatHistory;
        });

      const filteredChats = fetchedChats.filter((chat: any) => !chat.locale || chat.locale === locale);
      setChats(filteredChats);
      console.log(`[REST]: Successfully fetched and filtered ${filteredChats.length} chats.`);
    } catch (error) {
      console.error("🚨 [REST Fetch Error]:", error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleDelete = async (chatId: string) => {
    if (!confirm(locale === 'ko' ? "이 대화를 삭제하시겠습니까? 복구할 수 없습니다." : "Delete this conversation? This cannot be undone.")) return
    setChats(prev => prev.filter(c => c.id !== chatId))
    try {
      await deleteDoc(doc(db, "chats", chatId))
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  const dateLocale = locale === "ko" ? ko : enUS

  return (
    <main className="min-h-screen" style={{ background: "var(--rd-bg-base)" }}>
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold rd-text-ink mb-4">
            {t("title")}
          </h1>
          <p className="rd-lede max-w-3xl">
            {t("description")}
          </p>
        </div>

        {!user ? (
          <div className="rd-surface p-12 flex flex-col items-center text-center" style={{ borderRadius: "var(--rd-card-radius)" }}>
            <div className="w-20 h-20 flex items-center justify-center mb-6 rd-accent" style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}>
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold rd-text-ink mb-4">
              {authT("signInRequired")}
            </h2>
            <p className="rd-text-body mb-8 max-w-md">
              {authT("loginModalDescription")}
            </p>
            <Link 
              href="/"
              className="px-8 py-3 rd-bg-accent border font-bold hover:opacity-90 transition-opacity"
              style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)" }}
            >
              {authT("continueWithGoogle")}
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 rd-accent animate-spin mb-4" />
            <p className="rd-text-body">Loading your wisdom echoes...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="rd-surface p-12 flex flex-col items-center text-center" style={{ borderRadius: "var(--rd-card-radius)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 rd-text-muted" style={{ background: "var(--rd-divider-faint)" }}>
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-serif font-bold rd-text-ink mb-2">
              {t("emptyTitle")}
            </h2>
            <p className="rd-text-body mb-8">
              {t("emptyDescription")}
            </p>
            <Link 
              href="/#giants"
              className="px-6 py-2.5 border rd-hairline rd-bg-surface rd-text-body hover:opacity-80 transition-opacity text-sm font-medium"
              style={{ borderRadius: "var(--rd-card-radius)" }}
            >
              {t("startFirstChat")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {chats.map((chat) => {
              const localizedName = tg(`${chat.giantSlug}.name`) || chat.giantName;
              // The roster's imageUrl, never `${slug}.jpg`: that assembled a
              // second set of files that had drifted to a different picture.
              const portrait =
                chat.giantImage ||
                giants.find((g) => g.slug === (chat.giantSlug || chat.giantId))?.imageUrl ||
                null;
              return (
                <div key={chat.id} className="relative group/row">
                  <Link
                    href={`/giant/${chat.giantSlug || chat.giantId}?chat=true&chatId=${chat.id}`}
                    className="group relative overflow-hidden rd-surface transition-colors p-5 flex items-center gap-5 pr-14"
                    style={{ borderRadius: "var(--rd-card-radius)", transitionDuration: "120ms" }}
                  >
                    <Avatar className="w-14 h-14 border rd-hairline overflow-hidden relative">
                      {portrait && (
                        <Image
                          src={portrait}
                          alt={localizedName}
                          fill
                          sizes="56px"
                          className="rd-portrait object-cover"
                        />
                      )}
                      <AvatarFallback className="rd-accent font-serif" style={{ background: "var(--rd-divider-faint)" }}>
                        {localizedName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-serif font-bold text-lg rd-text-ink truncate">
                          {localizedName}
                        </h3>
                      <div className="flex items-center gap-1.5 rd-caption">
                        <Clock className="w-3 h-3" />
                        {chat.updatedAt
                          ? formatDistanceToNow(chat.updatedAt.toDate(), { addSuffix: true, locale: dateLocale })
                          : (locale === "ko" ? "방금 전" : "just now")}
                      </div>
                    </div>
                    <p className="text-sm rd-text-body line-clamp-1">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="rd-caption rd-accent font-bold">
                        {chat.messageCount} {t("messages")}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 rd-text-muted flex-shrink-0" />
                </Link>

                <button
                  onClick={() => handleDelete(chat.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover/row:opacity-100 focus:opacity-100 hover:opacity-80 transition-opacity z-10"
                  style={{ color: "var(--rd-error)" }}
                  aria-label={locale === 'ko' ? '대화 삭제' : 'Delete conversation'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </main>
  )
}
