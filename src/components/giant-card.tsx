"use client"

import { useState } from "react"
import { MessageCircle, Sparkles } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import GiantAvatar from "@/components/GiantAvatar"
import { Link } from "@/i18n/routing"
import type { Giant } from "@/lib/giants-data"
import { useGiantHistory } from "@/hooks/useGiantHistory"

interface GiantCardProps {
  giant: Giant
  index: number
  dbData?: { shortDescription?: string; era?: string; quote?: string }
}

export function GiantCard({ giant, index, dbData }: GiantCardProps) {
  const t = useTranslations("Giants")
  const gt = useTranslations("GiantsGrid")
  const { hasChattedWith } = useGiantHistory()
  const chatted = hasChattedWith(giant.slug)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Helper to get translated text with fallback to raw data
  const getTranslation = (key: string, fallback: string) => {
    try {
      const translated = t(key);
      // Detect untranslated: next-intl returns key path like "Giants.albert-einstein.name"
      // We check exact equality with the namespaced key, OR if result starts with Giants.<slug>.
      const namespacedKey = `Giants.${key}`;
      const slugPrefix = `Giants.${giant.id}.`;
      
      const cleanText = (text: string) => text.replace(/^\[[a-z]{2}\]\s*/i, '').trim();
      
      if (translated === namespacedKey || translated === key || translated.startsWith(slugPrefix)) {
        return cleanText(fallback);
      }
      return cleanText(translated);
    } catch (e) {
      return fallback.replace(/^\[[a-z]{2}\]\s*/i, '').trim();
    }
  }
  
  const name = getTranslation(`${giant.id}.name`, giant.name)
  const headline = getTranslation(`${giant.id}.headline`, giant.title)
  
  return (
    <Link
      href={`/giant/${giant.slug}`}
      className={`group relative glass-card rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.02] hover:border-amber-500/30 animate-fade-in-up overflow-hidden flex flex-col h-full items-center text-center`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chatted && (
        <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs text-black font-extrabold z-10 shadow-md shadow-black/35">
          ✓
        </span>
      )}

      {/* Header Image */}
      <div className="flex justify-center pt-8 pb-4 shrink-0">
        <div className="relative w-40 h-40 transition-all">
          {!imageError ? (
            <Image 
              src={giant.imageUrl} 
              alt={name}
              fill
              sizes="160px"
              className="object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-transparent">
              <GiantAvatar slug={giant.slug} category={giant.category} size={120} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-2 flex flex-col flex-1 w-full items-center">
        <div className="mb-2">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest rounded-full border border-amber-500/20 text-amber-500/80 font-medium mb-4 inline-block">
            {gt(`categories.${giant.category}`)}
          </span>
          <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-amber-200 transition-colors leading-snug">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 max-w-[200px] mx-auto">{headline}</p>
        </div>
      </div>
    </Link>
  )
}

