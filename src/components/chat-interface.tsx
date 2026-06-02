"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { GiantImage } from "./ui/giant-image"
import { X, Send, Sparkles, RefreshCw, Lightbulb, History } from "lucide-react"
import type { Giant } from "@/lib/giants-data"
import { getGiantResponse } from "@/lib/gemini"
import { giantsData } from "@/data/giants"
import { useTranslations, useLocale } from "next-intl"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore"

interface Message {
  id: string
  role: "user" | "giant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  giant: Giant
  onClose: () => void
  initialChatId?: string
}

// Helper to render markdown bold (**text**) as <strong> elements
const formatMessage = (content: string) => {
  if (!content) return "";
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-amber-300">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Helper for Korean grammatical particle selection (Unicode batchim detection)
const getKoreanParticle = (name: string, type: '이가' | '과와' | '은는' | '을를'): string => {
  if (!name) return "";
  const lastChar = name.charCodeAt(name.length - 1);
  if (lastChar >= 0xAC00 && lastChar <= 0xD7A3) {
    const hasBatchim = (lastChar - 0xAC00) % 28 > 0;
    if (type === '이가') return hasBatchim ? '이' : '가';
    if (type === '과와') return hasBatchim ? '과' : '와';
    if (type === '은는') return hasBatchim ? '은' : '는';
    if (type === '을를') return hasBatchim ? '을' : '를';
  }
  return type === '이가' ? '이(가)' : type === '과와' ? '과(와)' : '';
};

export function ChatInterface({ giant, onClose, initialChatId }: ChatInterfaceProps) {
  const t = useTranslations("Chat")
  const tg = useTranslations("Giants")
  const tgGrid = useTranslations("GiantsGrid")
  const locale = useLocale()
  
  const initialGreeting = tg(`${giant.slug}.chatGreeting`) || "";
  
  // Robustly handle suggested questions - ensure it's always an array
  const rawSuggestedQuestions = tg.raw(`${giant.slug}.suggestedQuestions`);
  const suggestedQuestions = Array.isArray(rawSuggestedQuestions) 
    ? rawSuggestedQuestions 
    : [];

  const [messages, setMessages] = useState<Message[]>(
    initialChatId ? [] : [{ id: "1", role: "giant", content: initialGreeting, timestamp: new Date() }]
  )
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isRestoredChat, setIsRestoredChat] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sendingRef = useRef(false) // Ref lock to completely prevent double-tap concurrent API calls

  useEffect(() => {
    let active = true;
    
    const loadHistory = async (uid: string) => {
      const targetChatId = initialChatId || (uid ? `${uid}_${giant.slug}_${locale}` : "");
      if (!targetChatId || !db) {
        setIsLoadingHistory(false)
        return
      }
      try {
        const chatDoc = await getDoc(doc(db, "chats", targetChatId))
        if (!active) return;
        if (chatDoc.exists()) {
          const stored: any[] = chatDoc.data().messages || []
          if (stored.length > 0) {
            setMessages(stored.map(m => ({
              id: m.id,
              role: (m.role === "model" ? "giant" : "user") as "user" | "giant",
              content: m.text,
              timestamp: new Date(m.createdAt),
            })))
            setIsRestoredChat(true)
          } else {
            setMessages([{ id: "1", role: "giant", content: initialGreeting, timestamp: new Date() }])
          }
        } else {
          setMessages([{ id: "1", role: "giant", content: initialGreeting, timestamp: new Date() }])
        }
      } catch (err) {
        console.error("Failed to load chat history:", err)
        if (active) {
          setMessages([{ id: "1", role: "giant", content: initialGreeting, timestamp: new Date() }])
        }
      } finally {
        if (active) {
          setIsLoadingHistory(false)
        }
      }
    }

    if (initialChatId) {
      loadHistory("");
    } else if (auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          loadHistory(user.uid);
        } else {
          setIsLoadingHistory(false);
        }
      });
      return () => {
        active = false;
        unsubscribe();
      };
    } else {
      setIsLoadingHistory(false);
    }
  }, [initialChatId, giant.slug, locale]);
  
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" })
    }
  }
  
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, isTyping])
  
  useEffect(() => {
    document.body.style.overflow = "hidden"
    inputRef.current?.focus()
    scrollToBottom("auto")
    return () => {
      document.body.style.overflow = ""
    }
  }, [])
  
  const handleSend = async () => {
    if (!input.trim() || isTyping || sendingRef.current) return
    
    sendingRef.current = true;
    setIsTyping(true)
    setHasError(false)
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    
    try {
      const ourGiant = giantsData.find(g => g.slug === giant.slug);
      const persona = ourGiant?.persona || "";
      
      // Convert messages to API shape
      const history = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
      
      const response = await getGiantResponse(persona, userMessage.content, giant.name, history, locale);
      
      const giantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "giant",
        content: response,
        timestamp: new Date()
      }
      
      setMessages((prev) => [...prev, giantMessage])

      // FIRESTORE AUTO-SAVE LOGIC (Isolated by locale)
      if (auth?.currentUser && db) {
        const userId = auth.currentUser.uid;
        const chatDocId = `${userId}_${giant.slug}_${locale}`;
        const chatRef = doc(db, "chats", chatDocId);

        try {
          await setDoc(chatRef, {
            userId: userId,
            giantId: giant.slug,
            giantSlug: giant.slug,
            giantName: tg(`${giant.slug}.name`),
            giantImage: giant.imageUrl,
            lastMessage: response,
            updatedAt: serverTimestamp(),
            messageCount: messages.length + 2,
            locale: locale,
            messages: arrayUnion(
              {
                id: userMessage.id,
                role: "user",
                text: userMessage.content,
                createdAt: userMessage.timestamp.toISOString()
              },
              {
                id: giantMessage.id,
                role: "model",
                text: giantMessage.content,
                createdAt: giantMessage.timestamp.toISOString()
              }
            )
          }, { merge: true });
          console.log("[Firestore]: Conversation successfully synced.");
        } catch (fsError) {
          console.error("[Firestore Sync Error]:", fsError);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setHasError(true)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "giant",
        content: t("error"),
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      sendingRef.current = false;
      setIsTyping(false)
    }
  }

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMessage) {
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === "giant" && prev[prev.length - 1].content === t("error")) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setInput(lastUserMessage.content);
    }
  }
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const categoryLabel = tgGrid(`categories.${giant.category}`) || 
    (typeof giant.category === 'string' ? 
      ({
        'achievement': '성취',
        'adversity': '역경',
        'wisdom': '지혜',
        'creativity': '창의'
      } as any)[giant.category.toLowerCase()] : null) || giant.category;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center p-0 md:p-4 bg-background/85 md:backdrop-blur-xl overflow-hidden h-[100dvh] overscroll-contain">
      {/* Ambient glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${giant.color} opacity-30 blur-3xl pointer-events-none`} />
      
      <div className="relative w-full max-w-md mx-auto md:max-w-5xl h-full md:h-[90vh] md:max-h-[800px] glass-card rounded-none md:rounded-3xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up flex-1 md:flex-none">
        {/* Detail View (Left on desktop) */}
        <div className="hidden md:flex w-80 lg:w-96 border-r border-border/50 flex-col bg-muted/30 shrink-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image 
              src={giant.imageUrl} 
              alt={tg(`${giant.slug}.name`)}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover object-top"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-1">{tg(`${giant.slug}.name`)}</h2>
              <p className="text-amber-400 font-medium">{tg(`${giant.slug}.headline`)}</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("historyEra")}</h4>
              <p className="text-sm text-foreground leading-relaxed">{tg(`${giant.slug}.era`)}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("fieldOfWisdom")}</h4>
              <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20 inline-block">
                {categoryLabel}
              </span>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("famousQuote")}</h4>
              <blockquote className="text-sm italic text-muted-foreground border-l-2 border-amber-500/30 pl-4 py-1">
                &ldquo;{tg(`${giant.slug}.quote`)}&rdquo;
              </blockquote>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("description")}</h4>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">{tg(`${giant.slug}.shortDescription`)}</p>
            </div>
          </div>
        </div>

        {/* Chat Area (Right on desktop) */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50 h-full overflow-hidden relative">
          {/* Pinned Sticky Header */}
          <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between gap-4 bg-background/95 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 ring-2 ring-amber-500/20">
                <Image 
                  src={giant.imageUrl} 
                  alt={tg(`${giant.slug}.name`)}
                  fill
                  sizes="40px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">{tg(`${giant.slug}.name`)}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{t("wisdomActive")}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="p-2 rounded-lg glass hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Restored chat badge */}
          {isRestoredChat && (
            <div className="px-5 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-center gap-2 text-xs text-amber-400 font-medium shrink-0">
              <History className="w-3 h-3" />
              {locale === 'ko' ? '이전 대화 이어가기' : 'Continue Previous Chat'}
            </div>
          )}

          {/* Independently Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar min-h-0 overscroll-contain">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                <span className="text-xs">{locale === 'ko' ? '대화 기록을 불러오는 중...' : 'Loading chat history...'}</span>
              </div>
            ) : messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] ${message.role === "user" ? "order-1" : "order-1"}`}>
                  {/* Avatar for giant */}
                  {message.role === "giant" && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <div className="relative w-6 h-6 rounded-md overflow-hidden bg-muted flex items-center justify-center ring-1 ring-amber-500/20">
                        <Image 
                          src={giant.imageUrl} 
                          alt={tg(`${giant.slug}.name`)}
                          fill
                          sizes="24px"
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {(tg(`${giant.slug}.name`) || "").split(" ")[0]}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl px-5 py-3.5 shadow-sm ${
                      message.role === "user"
                        ? "bg-amber-500/10 text-foreground border border-amber-500/30 rounded-tr-sm"
                        : "glass border border-border/50 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatMessage(message.content)}
                    </p>
                    {message.role === "giant" && message.content === t("error") && (
                      <button
                        onClick={handleRetry}
                        className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors py-1 px-2 rounded-md bg-amber-500/10 border border-amber-500/20"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {t("retry") || "Retry"}
                      </button>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-muted-foreground">
                      {message.timestamp.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {locale === 'ko'
                        ? `${(tg(`${giant.slug}.name`) || "").split(" ")[0]}${getKoreanParticle((tg(`${giant.slug}.name`) || "").split(" ")[0], '이가')} 생각 중입니다...`
                        : t("contemplating", { name: (tg(`${giant.slug}.name`) || "").split(" ")[0] })}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested questions (disappears instantly on first submit for clean layout) */}
          {messages.length === 1 && (
            <div className="px-6 py-3 border-t border-border/50 bg-amber-500/5 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400/60" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t("suggestedQuestions")}</span>
              </div>
              <div className="flex flex-wrap gap-2 pb-1">
                {Array.isArray(suggestedQuestions) && suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-3 py-2 text-xs glass rounded-lg text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all text-left whitespace-normal max-w-full cursor-pointer"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Pinned Sticky Input Area */}
          <div className="px-6 py-4 border-t border-border/50 bg-background/95 backdrop-blur-md relative z-10 shrink-0 sticky bottom-0">
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl glass hover:bg-amber-500/10 text-muted-foreground hover:text-amber-400 transition-all cursor-pointer">
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollToBottom("smooth");
                    }, 300);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (e.nativeEvent.isComposing) return;
                      handleSend();
                    }
                  }}
                  placeholder={t("inputPlaceholder", { name: (tg(`${giant.slug}.name`) || "").split(" ")[0] })}
                  className="w-full px-5 py-3 rounded-xl glass-card bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all pr-12 text-sm"
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/40" />
              </div>
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-widest font-medium opacity-50">
              {locale === 'ko' ? "과거의 메아리 • 시간을 초월한 지혜"
               : locale === 'ja' ? "過去の残響 • 時を超える知恵"
               : locale === 'de' ? "Echos der Vergangenheit • Weisheit durch die Zeit"
               : locale === 'es' ? "Ecos del pasado • Sabiduría a través del tempo"
               : locale === 'fr' ? "Échos du passé • Sagesse à travers le temps"
               : locale === 'it' ? "Echi del passato • Saggezza attraverso il tempo"
               : locale === 'pt' ? "Ecos do passado • Sabedoria através do tempo"
               : "Echoes of the Past • Wisdom Through Time"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
