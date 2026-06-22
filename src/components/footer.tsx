'use client'

import { useState } from 'react'
import { Sparkles, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ContactForm } from '@/components/contact-form'

import { useLocale } from 'next-intl'
import { NewsletterForm } from '@/components/NewsletterForm'

export default function Footer() {
  const t = useTranslations('Footer')
  const tn = useTranslations('Newsletter')
  const locale = useLocale()
  const [contactOpen, setContactOpen] = useState(false)

  const footerLinks = {
    explore: [
      { label: t('links.allGiants'), href: '/#giants' },
      { label: t('links.dnaTest'), href: '/test' },
      { label: t('links.debate'), href: '/debate' },
      { label: t('links.blog'), href: '/blog' },
      { label: t('links.consult'), href: '/consult' },
    ],
    info: [
      { label: t('links.about'), href: '/about' },
      { label: t('links.privacy'), href: '/privacy' },
      { label: t('links.terms'), href: '/terms' },
      { label: t('links.disclaimer'), href: '/disclaimer' },
      { label: t('links.contact'), href: '/contact' },
    ],
  }

  return (
    <>
      <ContactForm isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      <footer className="relative py-24 px-6 border-t border-border/30 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Footer Newsletter Subscription */}
          <div className="border-b border-white/5 pb-12 mb-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <h4 className="text-amber-400 font-bold mb-2 tracking-wide uppercase text-sm">
                {tn("badge")}
              </h4>
              <h3 className="text-white font-serif font-bold text-xl mb-1">
                {tn("title")}
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                {tn("subtitle")}
              </p>
            </div>
            <div className="w-full lg:w-auto shrink-0">
              <NewsletterForm />
            </div>
          </div>

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
                <Link
                  href="/contact"
                  className="text-muted-foreground/50 hover:text-amber-400/80 transition-all"
                  aria-label="Contact us"
                >
                  <Mail className="w-5 h-5" />
                </Link>
                <a
                  href="https://www.instagram.com/giantswisdom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/50 hover:text-amber-400/80 transition-all"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://x.com/GiantsWisdom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/50 hover:text-amber-400/80 transition-all"
                  aria-label="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
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

              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-10 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-muted-foreground/40 font-light tracking-wide">
              &copy; 2026 Giants Wisdom. {
                locale === 'fr' ? 'Tous droits réservés.' :
                locale === 'es' ? 'Todos los derechos reservados.' :
                locale === 'de' ? 'Alle Rechte vorbehalten.' :
                locale === 'ko' ? '모든 권리 보유.' :
                'All rights reserved.'
              }
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
