"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedGiants } from "@/components/featured-giants"
import { StatsSection } from "@/components/stats-section"
import { GiantsGrid } from "@/components/giants-grid"
import { ChatInterface } from "@/components/chat-interface"
import Footer from "@/components/footer"
import { QuoteSection } from "@/components/quote-section"
import { giants, type Giant } from "@/lib/giants-data"

export default function Home() {
  const [selectedGiant, setSelectedGiant] = useState<Giant | null>(null)
  
  const handleSelectGiant = (giant: Giant) => {
    setSelectedGiant(giant)
  }
  
  const handleCloseChat = () => {
    setSelectedGiant(null)
  }
  
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Giants - Bento Grid */}
      <FeaturedGiants giants={giants} onSelectGiant={handleSelectGiant} />
      
      {/* Stats & Features */}
      <StatsSection />
      
      {/* Daily Wisdom Quote */}
      <QuoteSection />
      
      {/* All Giants Grid */}
      <div id="giants">
        <GiantsGrid onSelectGiant={handleSelectGiant} />
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Interface Modal */}
      {selectedGiant && (
        <ChatInterface giant={selectedGiant} onClose={handleCloseChat} />
      )}
    </main>
  )
}
