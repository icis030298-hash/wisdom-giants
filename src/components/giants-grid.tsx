"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Sparkles, Grid3X3, List } from "lucide-react"
import { giants, categories, type Giant } from "@/lib/giants-data"
import Image from "next/image"
import { GiantCard } from "./giant-card"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

interface GiantsGridProps {}

export function GiantsGrid({}: GiantsGridProps) {
  const t = useTranslations("GiantsGrid")
  const tg = useTranslations("Giants")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Giants")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const filteredGiants = useMemo(() => {
    // Filter out invalid giants first
    const validGiants = giants.filter(g => g && g.id && g.slug);
    
    return validGiants.filter((giant) => {
      // Use raw category ID for category filter (faster)
      const matchesCategory = 
        selectedCategory === "All Giants" ||
        giant.category === selectedCategory
      
      if (!matchesCategory) return false

      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()

      // Helper for search with fallback
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

      const name = getT(`${giant.slug}.name`, giant.name).toLowerCase()
      const headline = getT(`${giant.slug}.headline`, giant.title).toLowerCase()
      const desc = getT(`${giant.slug}.shortDescription`, giant.description).toLowerCase()

      return (
        name.includes(query) ||
        headline.includes(query) ||
        desc.includes(query) ||
        giant.field.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, selectedCategory, tg])

  const totalPages = Math.ceil(filteredGiants.length / ITEMS_PER_PAGE)
  
  const visibleGiants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredGiants.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredGiants, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const element = document.getElementById('giants-header')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }

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
      </div>
      
      {/* Search and filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-card bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-amber-500/10"
                }`}
              >
                {category === "All Giants" ? t("allGiants") : t(`categories.${category}`)}
              </button>
            ))}
          </div>
          
          {/* View toggle */}
          <div className="flex items-center gap-1 glass rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-amber-500/20 text-amber-300" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-amber-500/20 text-amber-300" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground">
          {t("resultsCount", { total: giants.length, filtered: filteredGiants.length })}
        </div>
      </div>
      
      {/* Giants grid */}
      <div className="max-w-7xl mx-auto">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleGiants.map((giant, index) => (
              <GiantCard
                key={giant.id}
                giant={giant}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleGiants.map((giant, index) => (
              <Link
                key={giant.id}
                href={`/giant/${giant.slug}`}
                className="glass-card rounded-xl p-4 flex items-center gap-6 cursor-pointer hover:border-amber-500/30 transition-all animate-fade-in-up block"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 ring-amber-500/10 bg-muted flex items-center justify-center">
                  <Image 
                    src={giant.imageUrl} 
                    alt={tg(`${giant.slug}.name`)}
                    fill
                    sizes="56px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110 rounded-t-xl"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {tg(`${giant.slug}.name`).includes(`${giant.slug}.`) ? giant.name : tg(`${giant.slug}.name`)}
                    </h3>
                    <span className="text-xs text-muted-foreground">{giant.era}</span>
                  </div>
                  <p className="text-sm text-amber-400/80">
                    {tg(`${giant.slug}.headline`).includes(`${giant.slug}.`) ? giant.title : tg(`${giant.slug}.headline`)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {tg(`${giant.slug}.shortDescription`).includes(`${giant.slug}.`) ? giant.description : tg(`${giant.slug}.shortDescription`)}
                  </p>
                </div>
                
                <span className="hidden md:inline-block px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/20 shrink-0">
                  {t(`categories.${giant.category}`)}
                </span>
                
                <div className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-medium transition-all border border-amber-500/20 shrink-0">
                  {t("readEpic")}
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg glass border border-white/5 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              {t("pagination.first")}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg glass border border-white/5 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              {t("pagination.prev")}
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show limited page numbers if too many
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                          : "glass border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-muted-foreground px-1">...</span>
                }
                return null
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg glass border border-white/5 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              {t("pagination.next")}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg glass border border-white/5 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              {t("pagination.last")}
            </button>
          </div>
        )}
        
        {filteredGiants.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-amber-400/50" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">{t("noResults")}</h3>
            <p className="text-muted-foreground">{t("noResultsDesc")}</p>
          </div>
        )}
      </div>
    </section>
  )
}
