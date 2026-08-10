"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import GiantAvatar from "@/components/GiantAvatar"
import { Link } from "@/i18n/routing"
import type { Giant } from "@/lib/giants-data"

interface GiantCardProps {
  giant: Giant
  index: number
  dbData?: { shortDescription?: string; era?: string; quote?: string }
}

export function GiantCard({ giant, index, dbData }: GiantCardProps) {
  const t = useTranslations("Giants")
  const gt = useTranslations("GiantsGrid")
  const [imageError, setImageError] = useState(false)

  const getTranslation = (key: string, fallback: string) => {
    try {
      const translated = t(key);
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
  const rawEra = dbData?.era || getTranslation(`${giant.id}.era`, giant.era)
  
  const regionText = giant.region ? gt(`regions.${giant.region}`) : '';
  const centuryMatch = rawEra.match(/(\d+)(세기|th century| century|c)/i);
  const centuryText = centuryMatch ? `${centuryMatch[1]}C` : '';
  const formattedEra = [regionText, centuryText].filter(Boolean).join(' ');

  return (
    <Link href={`/giant/${giant.slug}`} className="block cursor-pointer outline-none">
      <article className="group">
        <div className="relative w-full aspect-square bg-[#161614] rounded-[12px] mb-[7px] transition-all hover:outline hover:outline-1 hover:outline-[#3A362E] overflow-hidden">
          {!imageError ? (
            <Image 
              src={giant.imageUrl} 
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GiantAvatar slug={giant.slug} category={giant.category} size={80} />
            </div>
          )}
        </div>
        <h3 className="font-serif text-[13px] font-normal leading-[1.35] text-[#E8E0D0] m-0 mb-[2px]">
          {name}
        </h3>
        <p className="text-[11px] text-[#7A7365] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
          {formattedEra || rawEra}
        </p>
      </article>
    </Link>
  )
}

