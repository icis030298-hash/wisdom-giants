"use client"

import { useState } from "react"
import { MessageCircle, Clock, Sparkles } from "lucide-react"
import type { Giant } from "@/lib/giants-data"

interface GiantCardProps {
  giant: Giant
  index: number
  onSelect: (giant: Giant) => void
}

// Generate initials for avatar
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
}

// Generate a unique pattern based on the giant's name
function getPatternStyle(name: string): { background: string } {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = (hash * 137) % 60 + 25 // Amber/gold range (25-85)
  
  return {
    background: `linear-gradient(135deg, 
      hsla(${hue}, 80%, 50%, 0.3) 0%, 
      hsla(${hue + 20}, 70%, 40%, 0.2) 50%,
      hsla(${hue}, 60%, 30%, 0.1) 100%)`
  }
}

export function GiantCard({ giant, index, onSelect }: GiantCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className={`group relative glass-card rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30 animate-fade-in-up`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(giant)}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${giant.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Avatar and basic info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div 
            className="relative w-16 h-16 rounded-xl flex items-center justify-center text-xl font-serif font-bold text-amber-100 overflow-hidden shrink-0"
            style={getPatternStyle(giant.name)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent" />
            <span className="relative z-10">{getInitials(giant.name)}</span>
            
            {/* Animated ring on hover */}
            <div className={`absolute inset-0 border-2 border-amber-400/50 rounded-xl transition-all duration-300 ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`} />
          </div>
          
          {/* Name and title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-amber-200 transition-colors truncate">
              {giant.name}
            </h3>
            <p className="text-sm text-amber-400/80 truncate">{giant.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{giant.era}</span>
            </div>
          </div>
        </div>
        
        {/* Field badge */}
        <div className="mt-4">
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
            {giant.field}
          </span>
        </div>
        
        {/* Description */}
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {giant.description}
        </p>
        
        {/* Quote preview */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs italic text-foreground/60 line-clamp-2">
            &ldquo;{giant.quote}&rdquo;
          </p>
        </div>
        
        {/* Action button */}
        <button 
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-medium transition-all border border-amber-500/20 hover:border-amber-500/40"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(giant)
          }}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{giant.name.split(" ")[0]}와 대화하기</span>
          <Sparkles className="w-3 h-3 opacity-60" />
        </button>
      </div>
    </div>
  )
}
