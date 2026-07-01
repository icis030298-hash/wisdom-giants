"use client"

import { useState, useEffect, useTransition } from "react"
import { Menu, X, Sparkles, Users, MessageCircle, Info, Languages, ChevronDown, LogOut, LayoutDashboard, Swords, BookOpen, MessageCircleHeart } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter, Link } from "@/i18n/routing"
import { AuthButton } from "@/components/auth-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const t = useTranslations("Navigation")
  const tBrand = useTranslations("brand")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navLinks = [
    { label: t("hallOfGems"), href: "/#giants", icon: Users },
    { 
      label: t("chatList"), 
      href: "/chats", 
      icon: MessageCircle,
    },
    { 
      label: t("debate"), 
      href: "/debate", 
      icon: Swords,
    },
    { 
      label: t("consult"), 
      href: "/consult", 
      icon: MessageCircleHeart,
    },
    { 
      label: t("blog"), 
      href: "/blog", 
      icon: BookOpen,
    },
    { label: t("about"), href: "/about", icon: Info },
  ]

  const locales = [
    { code: 'en', label: 'English' },
    { code: 'ko', label: '한국어' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh', label: '简体中文' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'ha', label: 'Hausa' },
    { code: 'he', label: 'עברית' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語' },
    { code: 'fa', label: 'فارسی' },
    { code: 'pl', label: 'Polski' },
    { code: 'pt', label: 'Português' },
    { code: 'ru', label: 'Русский' },
    { code: 'es', label: 'Español' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'th', label: 'ไทย' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'uk', label: 'Українська' },
    { code: 'vi', label: 'Tiếng Việt' },
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
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "glass py-2 md:py-3" : "py-3 md:py-6"}`}>
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between w-full max-w-full overflow-hidden">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink min-w-0 max-w-[60%]">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block min-w-0">
              <span className={`text-lg font-bold text-foreground group-hover:text-amber-200 transition-colors block leading-none pr-2 ${locale === 'hi' ? 'font-[family-name:var(--font-devanagari)]' : 'font-serif'}`}>
                {tBrand("mainTitle")}
              </span>
              <span className="text-[10px] opacity-40 tracking-widest uppercase font-medium block mt-1">
                Giants Wisdom
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive 
                      ? "text-amber-300 bg-amber-500/10 border border-amber-500/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-amber-500/10"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          {/* CTA & Language Switcher & Auth */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-sm text-foreground hover:bg-white/5 transition-all outline-none">
                  <Languages className="w-4 h-4 text-amber-400" />
                  <span className="">
                    {locales.find(l => l.code === locale)?.label || locale.toUpperCase()}
                  </span>
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

            <AuthButton />
          </div>
          
          {/* Mobile actions */}
          <div className="flex-shrink-0 flex items-center gap-1.5 ml-auto md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 flex items-center justify-center p-1 rounded-lg glass text-foreground outline-none cursor-pointer flex-shrink-0">
                  <Languages className="w-4 h-4" />
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
              className="w-8 h-8 flex items-center justify-center p-1 rounded-lg glass text-foreground cursor-pointer flex-shrink-0"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
