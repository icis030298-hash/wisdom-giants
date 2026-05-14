"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedGiants } from "@/components/featured-giants"
import { GiantsGrid } from "@/components/giants-grid"
import { giants } from "@/lib/giants-data"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Giants - Bento Grid */}
      <FeaturedGiants giants={giants} />
      
      {/* All Giants Grid */}
      <div id="giants">
        <GiantsGrid />
      </div>
    </main>
  )
}
