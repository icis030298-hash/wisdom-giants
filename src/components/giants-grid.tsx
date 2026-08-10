"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Filter, Sparkles, Globe } from "lucide-react"
import { giants, categories, type Giant } from "@/lib/giants-data"
import { GiantCard } from "./giant-card"
import { useTranslations } from "next-intl"
import { useGiantHistory } from "@/hooks/useGiantHistory"

interface GiantsGridProps {
  dbCardData?: Record<string, { shortDescription?: string; era?: string; quote?: string }>
}

export function GiantsGrid({ dbCardData }: GiantsGridProps) {
  const t = useTranslations("GiantsGrid")
  const tg = useTranslations("Giants")
  const { totalChatted } = useGiantHistory()
  const progress = Math.round((totalChatted / giants.length) * 100)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Giants")
  const [selectedRegion, setSelectedRegion] = useState("all")
  
  const ITEMS_PER_PAGE = 48
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const regions = [
    "all",
    "east-asia",
    "europe",
    "americas",
    "middle-east-turkey",
    "africa",
    "south-southeast-asia"
  ]

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 200)
    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [debouncedQuery, selectedCategory, selectedRegion])

  const filteredGiants = useMemo(() => {
    const validGiants = giants.filter(g => g && g.id && g.slug);
    
    return validGiants.filter((giant) => {
      const matchesCategory = 
        selectedCategory === "All Giants" ||
        giant.category === selectedCategory
      
      const matchesRegion =
        selectedRegion === "all" ||
        giant.region === selectedRegion
      
      if (!matchesCategory || !matchesRegion) return false

      if (!debouncedQuery) return true

      const query = debouncedQuery.toLowerCase()

      const getT = (key: string, fallback: string) => {
        if (!giant.slug) return fallback;
        try {
          const translated = tg(key)
          if (translated.includes(`${giant.slug}.`) || translated === `Giants.${giant.slug}.${key.split('.').pop()}`) {
            return fallback
          }
          return translated
        } catch (e) {
          return fallback;
        }
      }

      const dbData = dbCardData?.[giant.slug];
      const name = getT(`${giant.slug}.name`, giant.name).toLowerCase()
      const desc = (dbData?.shortDescription || getT(`${giant.slug}.shortDescription`, giant.description)).toLowerCase()
      const era = (dbData?.era || getT(`${giant.slug}.era`, giant.era)).toLowerCase()

      return (
        name.includes(query) ||
        desc.includes(query) ||
        era.includes(query)
      )
    })
  }, [debouncedQuery, selectedCategory, selectedRegion, tg, dbCardData])

  const visibleGiants = useMemo(() => {
    return filteredGiants.slice(0, visibleCount)
  }, [filteredGiants, visibleCount])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredGiants.length))
      }
    }, { rootMargin: '400px' })
    
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [filteredGiants.length])

  return (
    <section id="giants" className="relative py-20 px-4">
      {/* Section header */}
      <div id="giants-header" className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
        
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
            {t("title")}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-light">
          {t("description")}
        </p>

        {totalChatted > 0 && (
          <div className="mt-8 p-5 rounded-2xl bg-stone-900/40 border border-white/5 backdrop-blur-md max-w-2xl animate-fade-in">
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-stone-400 font-medium">{t("progressLabel")}</span>
              <span className="text-amber-400 font-bold">
                {totalChatted} / {giants.length}
              </span>
            </div>
            <div className="h-2.5 bg-stone-950 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 mt-2.5">
              {t("progressSubtext", { progress })}
            </p>
          </div>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="max-w-7xl mx-auto mb-8">
        {/* Search bar */}
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="이름, 시대, 업적으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-[36px] rounded-[8px] bg-[#161614] border border-[#2A2721] text-sm text-[#E8E0D0] placeholder:text-[#7A7365] focus:outline-none focus:border-[#3A362E] transition-all"
          />
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-[#B8975A]/20 text-[#B8975A] border border-[#B8975A]/40"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[#B8975A]/10"
              }`}
            >
              {category === "All Giants" ? t("allGiants") : t(`categories.${category}`)}
            </button>
          ))}
        </div>
        
        {/* Region filters */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
          <Globe className="w-4 h-4 text-muted-foreground mr-1" />
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRegion === reg
                  ? "bg-[#B8975A]/20 text-[#B8975A] border border-[#B8975A]/40"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[#B8975A]/10"
              }`}
            >
              {t(`regions.${reg}`)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Giants grid */}
      <div className="max-w-7xl mx-auto">
        <div 
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px 14px' }}
        >
          {visibleGiants.map((giant, index) => (
            <GiantCard
              key={giant.id}
              giant={giant}
              index={index}
              dbData={dbCardData?.[giant.slug]}
            />
          ))}
        </div>
        
        {/* Loading skeleton & infinite scroll trigger */}
        {visibleCount < filteredGiants.length && (
          <div ref={loadMoreRef} className="grid mt-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px 14px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="w-full aspect-square bg-[#161614] rounded-[12px] mb-[7px]"></div>
                <div className="h-4 bg-[#161614] rounded mb-[2px] w-3/4"></div>
                <div className="h-3 bg-[#161614] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}
        
        {visibleCount >= filteredGiants.length && filteredGiants.length > 0 && (
          <div className="text-center py-10 mt-8">
            <p className="text-sm text-[#7A7365]">950명 전체를 보셨습니다</p>
          </div>
        )}

        {filteredGiants.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#161614] flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#7A7365]" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">{t("noResults")}</h3>
            <p className="text-muted-foreground">{t("noResultsDesc")}</p>
          </div>
        )}
      </div>
    </section>
  )
}
