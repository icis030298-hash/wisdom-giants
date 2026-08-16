"use client"

import { useState } from "react"
import { Menu, X, Users, MessageCircle, Swords, BookOpen, MessageCircleHeart, Dna } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { usePathname, Link } from "@/i18n/routing"
import { AuthButton } from "@/components/auth-button"
import { BrandMark } from "@/components/brand-mark"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navigation() {
  const t = useTranslations("Navigation")
  const tBrand = useTranslations("brand")
  const locale = useLocale()
  const pathname = usePathname()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // `base` is what the active check matches on. usePathname() never returns the
  // hash, so the previous `pathname === "/#giants"` comparison was always false
  // and the Hall of Giants item could never light up. Matching on the path and
  // its descendants also keeps /giant/<slug> and /blog/<slug> anchored.
  const navLinks = [
    { label: t("hallOfGems"), href: "/#giants", base: "/giant", icon: Users, rootAlso: true },
    { label: t("chatList"), href: "/chats", base: "/chats", icon: MessageCircle },
    { label: t("debate"), href: "/debate", base: "/debate", icon: Swords },
    { label: t("consult"), href: "/consult", base: "/consult", icon: MessageCircleHeart },
    { label: t("blog"), href: "/blog", base: "/blog", icon: BookOpen },
    { label: t("dnaTest"), href: "/dna", base: "/dna", icon: Dna },
  ]

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.rootAlso && pathname === "/") return true
    return pathname === link.base || pathname.startsWith(`${link.base}/`)
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 rd-hairline-bottom py-2.5"
        style={{ background: "var(--rd-surface)" }}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between w-full max-w-full overflow-hidden">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink min-w-0 max-w-[60%]">
            <BrandMark className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0" />
            <div className="hidden sm:block min-w-0">
              {/* 브랜드가 큰 글씨, 현지어 문구가 작은 글씨입니다. 브랜드는 라틴
                  문자 고정이므로 데바나가리 폰트 분기는 현지어를 받는 아래 span
                  쪽에 붙습니다 (hi의 mainTitle은 दिग्गजों के कंधे). */}
              <span
                className="block leading-none pe-2 font-serif"
                style={{
                  color: "var(--rd-text-ink)",
                  fontSize: "var(--rd-card-name-size)",
                  fontWeight: "var(--rd-card-name-weight)",
                  letterSpacing: "var(--rd-card-name-tracking)",
                }}
              >
                Giants Wisdom
              </span>
              {/* No uppercase, no wide tracking. */}
              <span
                className={`block mt-0.5 ${locale === 'hi' ? 'font-[family-name:var(--font-devanagari)]' : ''}`}
                style={{
                  color: "var(--rd-text-muted)",
                  fontSize: "var(--rd-caption-size)",
                  letterSpacing: "var(--rd-caption-tracking)",
                  lineHeight: "var(--rd-caption-leading)",
                }}
              >
                {tBrand("mainTitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors hover:bg-[color:var(--rd-divider-faint)]"
                  style={{
                    color: active ? "var(--rd-accent-brown)" : "var(--rd-text-body)",
                    fontWeight: active ? 600 : 400,
                    fontSize: "var(--rd-caption-size)",
                    letterSpacing: "var(--rd-caption-tracking)",
                    boxShadow: active ? "inset 0 -2px 0 0 var(--rd-accent-brown)" : undefined,
                  }}
                >
                  <link.icon className="w-4 h-4" aria-hidden="true" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Language switcher & auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher variant="desktop" />
            <AuthButton />
          </div>

          {/* Mobile actions */}
          <div className="flex-shrink-0 flex items-center gap-1.5 ms-auto md:hidden">
            <LanguageSwitcher variant="mobile" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              className="w-8 h-8 flex items-center justify-center rounded-lg rd-surface cursor-pointer flex-shrink-0 active:scale-[0.97] transition-transform"
              style={{ color: "var(--rd-text-body)" }}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "color-mix(in srgb, var(--rd-text-ink) 35%, transparent)" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className="absolute top-16 inset-x-4 rd-surface p-3"
            style={{ borderRadius: 6 }}
          >
            <div className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(link)
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-md active:bg-[color:var(--rd-divider-faint)] transition-colors"
                    style={{
                      color: active ? "var(--rd-accent-brown)" : "var(--rd-text-body)",
                      fontWeight: active ? 600 : 400,
                      fontSize: "var(--rd-body-size)",
                    }}
                  >
                    <link.icon className="w-4 h-4" aria-hidden="true" />
                    {link.label}
                  </a>
                )
              })}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
              <button
                className="w-full px-4 py-2.5 rounded-md transition-colors active:scale-[0.98]"
                style={{
                  background: "var(--rd-accent-brown)",
                  color: "var(--rd-surface)",
                  fontSize: "var(--rd-body-size)",
                  fontWeight: 600,
                }}
              >
                {t("startExploring")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
