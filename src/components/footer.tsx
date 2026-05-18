'use client'

import { useState } from 'react'
import { Sparkles, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ContactForm } from '@/components/contact-form'

export default function Footer() {
  const t = useTranslations('Footer')
  const [contactOpen, setContactOpen] = useState(false)

  const footerLinks = {
    explore: [
      { label: t('links.allGiants'), href: '/#giants' },
      { label: t('links.dnaTest'), href: '/test' },
    ],
    info: [
      { label: t('links.about'), href: '/about' },
      { label: t('links.privacy'), href: '/privacy' },
      { label: t('links.terms'), href: '/terms' },
    ],
  }

  return (
    <>
      <ContactForm isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      <footer className="relative py-24 px-6 border-t border-border/30 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-foreground/90 tracking-tight">
                    Giants Wisdom
                  </span>
                  <p className="text-[10px] text-muted-foreground/60 tracking-wider uppercase">{t('brand.subtitle')}</p>
                </div>
              </Link>
              <p className="text-muted-foreground/70 text-sm leading-relaxed mb-8 max-w-sm">
                {t('brand.description')}
              </p>
              {/* Email / Contact icon */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setContactOpen(true)}
                  className="text-muted-foreground/50 hover:text-amber-400/80 transition-all"
                  aria-label="Contact us"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Explore links */}
            <div>
              <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-6">{t('sections.explore')}</h4>
              <ul className="space-y-4">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as any} className="text-muted-foreground/60 hover:text-amber-400/80 transition-colors text-sm font-light">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info links */}
            <div>
              <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-6">{t('sections.info')}</h4>
              <ul className="space-y-4">
                {footerLinks.info.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as any} className="text-muted-foreground/60 hover:text-amber-400/80 transition-colors text-sm font-light">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {/* Contact button */}
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="text-muted-foreground/60 hover:text-amber-400/80 transition-colors text-sm font-light"
                  >
                    {t('links.contact')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-10 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-muted-foreground/40 font-light tracking-wide">
              &copy; 2026 Giants Wisdom. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
