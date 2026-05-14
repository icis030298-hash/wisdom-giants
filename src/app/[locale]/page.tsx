"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedGiants } from "@/components/featured-giants"
import { StatsSection } from "@/components/stats-section"
import { GiantsGrid } from "@/components/giants-grid"
import { ChatInterface } from "@/components/chat-interface"
import { QuoteSection } from "@/components/quote-section"
import { giants, type Giant } from "@/lib/giants-data"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Giants - Bento Grid */}
      <FeaturedGiants giants={giants} />
      
      {/* Stats & Features */}
      <StatsSection />
      
      {/* Daily Wisdom Quote */}
      <QuoteSection />
      
      {/* All Giants Grid */}
      <div id="giants">
        <GiantsGrid />
      </div>
    </main>
  )
}
