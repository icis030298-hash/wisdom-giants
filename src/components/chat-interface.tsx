"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { GiantImage } from "./ui/giant-image"
import { X, Send, Sparkles, RefreshCw, Lightbulb } from "lucide-react"
import type { Giant } from "@/lib/giants-data"
import { getGiantResponse } from "@/lib/gemini"
import { giantsData } from "@/data/giants"
import { useTranslations, useLocale } from "next-intl"

interface Message {
  id: string
  role: "user" | "giant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  giant: Giant
  onClose: () => void
}

export function ChatInterface({ giant, onClose }: ChatInterfaceProps) {
  const t = useTranslations("Chat")
  const tg = useTranslations("Giants")
  const locale = useLocale()
  
  const initialGreeting = tg(`${giant.slug}.chatGreeting`)
  const suggestedQuestions = (tg.raw(`${giant.slug}.suggestedQuestions`) || []) as string[]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "giant",
      content: initialGreeting,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    
    try {
      const ourGiant = giantsData.find(g => g.slug === giant.slug);
      const persona = ourGiant?.persona || "";
      
      // 이전 메시지들을 API 형식으로 변환 (현재 유저 메시지 제외)
      const history = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
      
      const response = await getGiantResponse(persona, input, giant.name, history, locale);
      
      const giantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "giant",
        content: response,
        timestamp: new Date()
      }
      
      setMessages((prev) => [...prev, giantMessage])
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "giant",
        content: t("error"),
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
      {/* Ambient glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${giant.color} opacity-30 blur-3xl pointer-events-none`} />
      
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[800px] glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        {/* Detail View (Left on desktop) */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-border/50 flex flex-col bg-muted/30">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image 
              src={giant.imageUrl} 
              alt={tg(`${giant.slug}.name`)}
              fill
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
                {giant.field || giant.category}
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
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 ring-2 ring-amber-500/20">
                <Image 
                  src={giant.imageUrl} 
                  alt={tg(`${giant.slug}.name`)}
                  fill
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
                className="p-2 rounded-lg glass hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
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
                      {message.content}
                    </p>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                      {t("contemplating", { name: (tg(`${giant.slug}.name`) || "").split(" ")[0] })}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested questions */}
          {messages.length < 3 && (
            <div className="px-6 py-3 border-t border-border/50 bg-amber-500/5 overflow-x-auto">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400/60" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t("suggestedQuestions")}</span>
              </div>
              <div className="flex gap-2 pb-1">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-3 py-2 text-xs glass rounded-lg text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all whitespace-nowrap"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className="px-6 py-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl glass hover:bg-amber-500/10 text-muted-foreground hover:text-amber-400 transition-all">
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("inputPlaceholder", { name: (tg(`${giant.slug}.name`) || "").split(" ")[0] })}
                  className="w-full px-5 py-3 rounded-xl glass-card bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all pr-12"
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/40" />
              </div>
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-widest font-medium opacity-50">
              Echoes of the Past • Wisdom Through Time
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
