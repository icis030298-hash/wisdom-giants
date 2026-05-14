"use client"

import { useState, useEffect, useTransition } from "react"
import { Menu, X, Sparkles, BookOpen, Users, MessageCircle, Info, Languages, ChevronDown } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter, Link } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navLinks = [
    { label: t("hallOfGems"), href: "#giants", icon: Users },
    { label: t("wisdomArchive"), href: "#library", icon: BookOpen },
    { label: t("chatList"), href: "#chat", icon: MessageCircle },
    { label: t("about"), href: "#about", icon: Info },
  ]

  const locales = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
  ]
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function onLocaleChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale as any})
    })
  }
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "glass py-3" : "py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-lg font-semibold text-foreground group-hover:text-amber-200 transition-colors">
                {t("title")}
              </span>
              <p className="text-xs text-muted-foreground -mt-0.5">{t("subtitle")}</p>
            </div>
          </Link>
          
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
          
          {/* CTA & Language Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-sm text-foreground hover:bg-white/5 transition-all outline-none">
                  <Languages className="w-4 h-4 text-amber-400" />
                  <span className="uppercase">{locale}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10 min-w-[120px]">
                {locales.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => onLocaleChange(l.code)}
                    className={`cursor-pointer focus:bg-amber-500/10 focus:text-amber-200 ${locale === l.code ? "bg-amber-500/10 text-amber-200" : "text-muted-foreground"}`}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all">
              {t("startExploring")}
            </button>
          </div>
          
          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg glass text-foreground outline-none">
                  <Languages className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10 min-w-[120px]">
                {locales.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => onLocaleChange(l.code)}
                    className={`cursor-pointer focus:bg-amber-500/10 focus:text-amber-200 ${locale === l.code ? "bg-amber-500/10 text-amber-200" : "text-muted-foreground"}`}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg glass text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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
                {t("startExploring")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
