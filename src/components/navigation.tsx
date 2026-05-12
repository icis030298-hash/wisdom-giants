"use client"

import { useState, useEffect } from "react"
import { Menu, X, Sparkles, BookOpen, Users, MessageCircle, Info } from "lucide-react"

const navLinks = [
  { label: "지성들의 전당", href: "#giants", icon: Users },
  { label: "지혜의 보관소", href: "#library", icon: BookOpen },
  { label: "대화 목록", href: "#chat", icon: MessageCircle },
  { label: "소개", href: "#about", icon: Info },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "glass py-3" : "py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-lg font-semibold text-foreground group-hover:text-amber-200 transition-colors">
                Shoulders of Giants
              </span>
              <p className="text-xs text-muted-foreground -mt-0.5">위대한 지성들의 전당</p>
            </div>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all">
              탐험 시작하기
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-20 left-4 right-4 glass-card rounded-2xl p-4 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-amber-500/10 transition-all"
                >
                  <link.icon className="w-5 h-5 text-amber-400" />
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <button className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all">
                탐험 시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
