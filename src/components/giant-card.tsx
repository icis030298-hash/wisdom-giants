"use client"

import { useState } from "react"
import { MessageCircle, Sparkles } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import type { Giant } from "@/lib/giants-data"

interface GiantCardProps {
  giant: Giant
  index: number
}

export function GiantCard({ giant, index }: GiantCardProps) {
  const t = useTranslations("Giants")
  const gt = useTranslations("GiantsGrid")
  const [isHovered, setIsHovered] = useState(false)

  // Helper to get translated text with fallback to raw data
  const getTranslation = (key: string, fallback: string) => {
    try {
      const translated = t(key);
      // If next-intl returns the key itself (e.g. "Giants.slug.name"), use fallback
      if (translated === `Giants.${key}` || translated.includes(`${giant.id}.`)) {
        return fallback;
      }
      return translated;
    } catch (e) {
      return fallback;
    }
  }
  
  const name = getTranslation(`${giant.id}.name`, giant.name)
  const headline = getTranslation(`${giant.id}.headline`, giant.title)
  const shortDescription = getTranslation(`${giant.id}.shortDescription`, giant.description)
  const quote = getTranslation(`${giant.id}.quote`, giant.quote)
  
  return (
    <Link
      href={`/giant/${giant.slug}`}
      className={`group relative glass-card rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30 animate-fade-in-up overflow-hidden flex flex-col h-full`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${giant.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
      
      {/* Header Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted shrink-0">
        <Image 
          src={giant.imageUrl} 
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-110 rounded-t-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Field badge on image */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-amber-500 text-black font-bold border border-amber-400">
            {gt(`categories.${giant.category}`)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-200 transition-colors leading-snug">
            {name}
          </h3>
          <p className="text-sm text-amber-400/80 mt-0.5 line-clamp-2">{headline}</p>
        </div>
        
        {/* Description */}
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[40px]">
          {shortDescription}
        </p>
        
        {/* Quote preview */}
        <div className="mt-4 pt-4 border-t border-border/50 min-h-[70px]">
          <p className="text-xs italic text-foreground/60 line-clamp-2">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
        
        {/* Action button */}
        <div className="mt-auto pt-6">
          <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold transition-all border border-amber-500/20 hover:border-amber-500/40">
            <MessageCircle className="w-4 h-4" />
            <span>{gt("readEpic")}</span>
            <Sparkles className="w-3 h-3 opacity-60" />
          </div>
        </div>
      </div>
    </Link>
  )
}

