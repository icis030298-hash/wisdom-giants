"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Grid3X3, List, Globe } from "lucide-react"
import { giants, categories } from "@/lib/giants-data"
import Image from "next/image"
import { GiantCard } from "./giant-card"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useGiantHistory } from "@/hooks/useGiantHistory"
import { lifespan } from "@/lib/era"

interface GiantsGridProps {
  dbCardData?: Record<string, { shortDescription?: string; era?: string; quote?: string }>
}

// Shared chip styling. Selected state carries weight and a filled background,
// not colour alone.
const CHIP_ON = {
  className: "px-3 py-1.5 transition-colors",
  style: {
    background: "var(--rd-accent-brown)",
    color: "var(--rd-surface)",
    border: "1px solid var(--rd-accent-brown)",
    borderRadius: "var(--rd-card-radius)",
    fontSize: "var(--rd-caption-size)",
    fontWeight: 600,
  },
} as const

const CHIP_OFF = {
  className: "px-3 py-1.5 transition-colors",
  style: {
    background: "var(--rd-surface)",
    color: "var(--rd-text-body)",
    border: "1px solid var(--rd-border)",
    borderRadius: "var(--rd-card-radius)",
    fontSize: "var(--rd-caption-size)",
  },
} as const

export function GiantsGrid({ dbCardData }: GiantsGridProps) {
  const t = useTranslations("GiantsGrid")
  const tg = useTranslations("Giants")
  const { totalRead } = useGiantHistory()
  // One giant out of ~494 is 0.2%, so Math.round left the label reading "0%
  // 달성" and the bar at width:0 for the first four giants -- the gauge looked
  // broken rather than early. Ceil keeps the label off zero once anything has
  // been read; the bar carries its own minimum width below.
  const rawProgress = giants.length > 0 ? (totalRead / giants.length) * 100 : 0
  const progress = totalRead > 0 ? Math.max(1, Math.ceil(rawProgress)) : 0
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Giants")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  // 5 columns x 5 rows, so the last row is never a partial one. 493 giants
  // divide into 20 pages with 18 on the last. Kept identical across
  // breakpoints on purpose: if mobile paged differently, page 3 would point at
  // different people depending on the device.
  const ITEMS_PER_PAGE = 25

  const regions = [
    "all",
    "east-asia",
    "europe",
    "americas",
    "middle-east-turkey",
    "africa",
    "south-southeast-asia"
  ]

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedRegion])

  const filteredGiants = useMemo(() => {
    // Filter out invalid giants first
    const validGiants = giants.filter(g => g && g.id && g.slug);
    
    return validGiants.filter((giant) => {
      // Use raw category ID for category filter (faster)
      const matchesCategory = 
        selectedCategory === "All Giants" ||
        giant.category === selectedCategory
      
      const matchesRegion =
        selectedRegion === "all" ||
        giant.region === selectedRegion
      
      if (!matchesCategory || !matchesRegion) return false

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

      const dbData = dbCardData?.[giant.slug];
      const name = getT(`${giant.slug}.name`, giant.name).toLowerCase()
      const headline = getT(`${giant.slug}.headline`, giant.title).toLowerCase()
      const desc = (dbData?.shortDescription || getT(`${giant.slug}.shortDescription`, giant.description)).toLowerCase()

      return (
        name.includes(query) ||
        headline.includes(query) ||
        desc.includes(query) ||
        giant.field.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, selectedCategory, selectedRegion, tg])

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
    <section id="giants" className="relative pt-6 pb-16 px-4 md:px-6">
      {/* Section header */}
      <div id="giants-header" className="max-w-7xl mx-auto mb-5">
        <h2
          className="font-serif"
          style={{
            color: "var(--rd-text-ink)",
            fontSize: "var(--rd-h1-size)",
            fontWeight: "var(--rd-h1-weight)",
            letterSpacing: "var(--rd-h1-tracking)",
            lineHeight: "var(--rd-h1-leading)",
          }}
        >
          {t("title")}
        </h2>
        <p
          className="max-w-2xl mt-1"
          style={{
            color: "var(--rd-text-body)",
            fontSize: "var(--rd-body-size)",
            lineHeight: "var(--rd-body-leading)",
          }}
        >
          {t("description")}
        </p>

        {totalRead > 0 && (
          <div className="mt-4 p-4 max-w-2xl" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
            <div className="flex justify-between mb-2" style={{ fontSize: "var(--rd-caption-size)" }}>
              <span style={{ color: "var(--rd-text-muted)" }}>{t("progressLabel")}</span>
              <span style={{ color: "var(--rd-accent-brown)", fontWeight: 600 }}>
                {totalRead} / {giants.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden" style={{ background: "var(--rd-divider-faint)", borderRadius: 999 }}>
              {/* Width comes from the unrounded ratio, but never renders thinner
                  than the bar is tall. At one giant read the true width is 0.2%
                  -- a sub-pixel sliver on a phone -- so the minimum turns it
                  into a visible dot that grows from there. */}
              <div
                className="h-full motion-safe:transition-all motion-safe:duration-700"
                style={{
                  background: "var(--rd-accent-brown)",
                  borderRadius: 999,
                  width: `${rawProgress}%`,
                  minWidth: "0.375rem",
                }}
              />
            </div>
            <p className="mt-2" style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>
              {t("progressSubtext", { progress })}
            </p>
          </div>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--rd-text-muted)" }} />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 outline-none" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", color: "var(--rd-text-body)", fontSize: "var(--rd-caption-size)" }}
            />
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 me-1" style={{ color: "var(--rd-text-muted)" }} aria-hidden="true" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                {...(selectedCategory === category ? CHIP_ON : CHIP_OFF)}
              >
                {category === "All Giants" ? t("allGiants") : t(`categories.${category}`)}
              </button>
            ))}
          </div>
          
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}>
            <button
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"} className="p-1.5" style={{ background: viewMode === "grid" ? "var(--rd-divider-faint)" : "transparent", color: viewMode === "grid" ? "var(--rd-accent-brown)" : "var(--rd-text-muted)", borderRadius: "var(--rd-card-radius)" }}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"} className="p-1.5" style={{ background: viewMode === "list" ? "var(--rd-divider-faint)" : "transparent", color: viewMode === "list" ? "var(--rd-accent-brown)" : "var(--rd-text-muted)", borderRadius: "var(--rd-card-radius)" }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Region filters */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
          <Globe className="w-4 h-4 me-1" style={{ color: "var(--rd-text-muted)" }} aria-hidden="true" />
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              aria-pressed={selectedRegion === reg}
              {...(selectedRegion === reg ? CHIP_ON : CHIP_OFF)}
            >
              {t(`regions.${reg}`)}
            </button>
          ))}
        </div>
        
        {/* Results count */}
        <div className="mt-3" style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>
          {t("resultsCount", { total: giants.length, filtered: filteredGiants.length })}
        </div>
      </div>
      
      {/* Giants grid */}
      <div className="max-w-7xl mx-auto">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start" style={{ gap: "var(--rd-grid-gutter)" }}>
            {visibleGiants.map((giant, index) => (
              <GiantCard
                key={giant.id}
                giant={giant}
                index={index}
                dbData={dbCardData?.[giant.slug]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleGiants.map((giant, index) => (
              <Link
                key={giant.id}
                href={`/giant/${giant.slug}`}
                className="p-3 flex items-center gap-4 cursor-pointer transition-colors active:scale-[0.99] block"
                style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)" }}
              >
                <div className="relative w-12 h-12 overflow-hidden shrink-0 flex items-center justify-center" style={{ background: "var(--rd-divider-faint)", borderRadius: "var(--rd-card-radius)" }}>
                  <Image 
                    src={giant.imageUrl} 
                    alt={tg(`${giant.slug}.name`)}
                    fill
                    sizes="56px"
                    className="rd-portrait object-cover object-top transition-transform duration-700 group-hover:scale-110 rounded-t-xl"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)", letterSpacing: "var(--rd-card-name-tracking)" }}>
                      {tg(`${giant.slug}.name`).includes(`${giant.slug}.`) ? giant.name : tg(`${giant.slug}.name`)}
                    </h3>
                    <span style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>
                      {lifespan(dbCardData?.[giant.slug]?.era || giant.era)}
                    </span>
                  </div>
                  <p style={{ color: "var(--rd-accent-brown)", fontSize: "var(--rd-caption-size)" }}>
                    {tg(`${giant.slug}.headline`).includes(`${giant.slug}.`) ? giant.title : tg(`${giant.slug}.headline`)}
                  </p>
                  <p className="mt-0.5 line-clamp-1" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-card-intro-size)" }}>
                    {dbCardData?.[giant.slug]?.shortDescription || (tg(`${giant.slug}.shortDescription`).includes(`${giant.slug}.`) ? giant.description : tg(`${giant.slug}.shortDescription`))}
                  </p>
                </div>
                
                <span className="hidden md:inline-block px-2.5 py-1 shrink-0" style={{ color: "var(--rd-accent-brown)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-category-size)", fontWeight: 600 }}>
                  {t(`categories.${giant.category}`)}
                </span>
                
                <div className="px-3 py-1.5 shrink-0" style={{ background: "var(--rd-divider-faint)", color: "var(--rd-accent-brown)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-caption-size)", fontWeight: 600 }}>
                  {t("readEpic")}
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" style={{ background: "var(--rd-surface)", color: "var(--rd-text-body)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-caption-size)" }}
            >
              {t("pagination.first")}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" style={{ background: "var(--rd-surface)", color: "var(--rd-text-body)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-caption-size)" }}
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
                      aria-current={currentPage === page ? "page" : undefined}
                      className="w-9 h-9 flex items-center justify-center transition-colors"
                      style={{
                        background: currentPage === page ? "var(--rd-accent-brown)" : "var(--rd-surface)",
                        color: currentPage === page ? "var(--rd-surface)" : "var(--rd-text-body)",
                        border: "1px solid " + (currentPage === page ? "var(--rd-accent-brown)" : "var(--rd-border)"),
                        borderRadius: "var(--rd-card-radius)",
                        fontSize: "var(--rd-caption-size)",
                        fontWeight: currentPage === page ? 600 : 400,
                      }}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-1" style={{ color: "var(--rd-text-muted)" }}>...</span>
                }
                return null
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" style={{ background: "var(--rd-surface)", color: "var(--rd-text-body)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-caption-size)" }}
            >
              {t("pagination.next")}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" style={{ background: "var(--rd-surface)", color: "var(--rd-text-body)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", fontSize: "var(--rd-caption-size)" }}
            >
              {t("pagination.last")}
            </button>

            <div className="flex items-center gap-2 ml-4">
              <input
                type="number"
                min={1}
                max={totalPages}
                placeholder={currentPage.toString()}
                className="w-14 h-9 px-2 text-center outline-none" style={{ background: "var(--rd-surface)", border: "1px solid var(--rd-border)", borderRadius: "var(--rd-card-radius)", color: "var(--rd-text-body)", fontSize: "var(--rd-caption-size)" }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt(e.currentTarget.value)
                    if (!isNaN(page) && page >= 1 && page <= totalPages) {
                      handlePageChange(page)
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
              <span style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}>/ {totalPages}</span>
            </div>
          </div>
        )}
        
        {filteredGiants.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--rd-divider-faint)" }}>
              <Search className="w-6 h-6" style={{ color: "var(--rd-text-muted)" }} aria-hidden="true" />
            </div>
            <h3 className="font-serif mb-1" style={{ color: "var(--rd-text-ink)", fontSize: "var(--rd-card-name-size)", fontWeight: "var(--rd-card-name-weight)" }}>{t("noResults")}</h3>
            <p style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-body-size)" }}>{t("noResultsDesc")}</p>
          </div>
        )}
      </div>
    </section>
  )
}
