"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, Clock, BookOpen, Quote, Lightbulb, RefreshCw } from "lucide-react"
import type { Giant } from "@/lib/giants-data"
import { getGiantResponse } from "@/lib/gemini"
import { giantsData } from "@/data/giants"

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

// Sample responses based on the giant's field
const getInitialMessage = (giant: Giant): string => {
  return `반갑네, 미래에서 온 친구여. 나는 ${giant.name}이라네. ${giant.title}로서 자네의 고민에 귀를 기울일 준비가 되었네. 어떤 지혜를 찾고 있는가?`
}

const suggestedQuestions = [
  "당신의 가장 위대한 발견은 무엇인가요?",
  "현대인들에게 해주고 싶은 조언이 있나요?",
  "가장 힘들었던 순간을 어떻게 극복했나요?",
  "성공적인 삶을 위한 태도는 무엇일까요?",
]

export function ChatInterface({ giant, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "giant",
      content: getInitialMessage(giant),
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
      const ourGiant = giantsData.find(g => g.slug === giant.id);
      const persona = ourGiant?.persona || "";
      const response = await getGiantResponse(persona, input, giant.name);
      
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
        content: "죄송하네, 나의 지혜를 불러오는 도중 오류가 발생했구만. 잠시 후 다시 시도해주겠나?",
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
      
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[800px] glass-card rounded-3xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-border/50 flex items-center gap-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${giant.color} flex items-center justify-center text-lg font-serif font-bold text-amber-100 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent" />
            <span className="relative z-10">
              {giant.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </span>
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-foreground">{giant.name}</h2>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm text-amber-400/80">{giant.title}</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg glass hover:bg-amber-500/10 text-muted-foreground hover:text-foreground transition-all">
              <BookOpen className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg glass hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Giant info bar */}
        <div className="px-6 py-3 bg-amber-500/5 border-b border-border/50 flex items-center gap-4 text-xs overflow-x-auto">
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <Clock className="w-3 h-3" />
            <span>{giant.era}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-300/80 shrink-0">{giant.field}</span>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <Quote className="w-3 h-3 text-amber-400/60" />
            <span className="italic truncate max-w-xs">&ldquo;{giant.quote.substring(0, 50)}...&rdquo;</span>
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${message.role === "user" ? "order-1" : "order-1"}`}>
                {/* Avatar for giant */}
                {message.role === "giant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${giant.color} flex items-center justify-center text-xs font-serif font-bold text-amber-100`}>
                      {giant.name[0]}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {giant.name.split(" ")[0]}
                    </span>
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-amber-500/20 text-foreground border border-amber-500/30 rounded-tr-sm"
                      : "glass border border-border/50 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                
                <div className={`flex items-center gap-2 mt-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <span className="text-xs text-muted-foreground">
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
                    {giant.name.split(" ")[0]} is contemplating...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested questions */}
        {messages.length < 3 && (
          <div className="px-6 py-3 border-t border-border/50 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400/60" />
              <span className="text-xs text-muted-foreground">Suggested questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-1.5 text-xs glass rounded-lg text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all"
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
            <button className="p-2 rounded-lg glass hover:bg-amber-500/10 text-muted-foreground hover:text-amber-400 transition-all">
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Ask ${giant.name.split(" ")[0]} anything...`}
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
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            This is a simulated conversation for educational purposes. Connect an AI provider for real interactions.
          </p>
        </div>
      </div>
    </div>
  )
}
