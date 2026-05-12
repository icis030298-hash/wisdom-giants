"use client"

import { useState } from "react"
import { MessageCircle, Clock, Sparkles } from "lucide-react"
import { GiantImage } from "./ui/giant-image"
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
      className={`group relative glass-card rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30 animate-fade-in-up overflow-hidden`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(giant)}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${giant.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
      
      {/* Header Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <GiantImage 
          src={giant.imageUrl} 
          alt={giant.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fallbackText={getInitials(giant.name)}
          containerClassName="absolute inset-0 text-3xl"
          style={!giant.imageUrl ? getPatternStyle(giant.name) : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Field badge on image */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-amber-500 text-black font-bold border border-amber-400">
            {giant.field}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-200 transition-colors truncate">
              {giant.name}
            </h3>
            <p className="text-sm text-amber-400/80 truncate">{giant.title}</p>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 shrink-0">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{giant.era}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
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
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold transition-all border border-amber-500/20 hover:border-amber-500/40"
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
