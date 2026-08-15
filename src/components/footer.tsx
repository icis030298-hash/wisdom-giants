'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ContactForm } from '@/components/contact-form'
import { BrandMark } from '@/components/brand-mark'
import { useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')
  const locale = useLocale()
  const [contactOpen, setContactOpen] = useState(false)

  const footerLinks = {
    explore: [
      { label: t('links.allGiants'), href: '/#giants' },
      { label: t('links.dnaTest'), href: '/dna' },
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

      <footer
        className="relative py-16 px-6 overflow-hidden"
        style={{
          background: "var(--rd-surface)",
          borderTop: "1px solid var(--rd-border)",
          color: "var(--rd-text-body)",
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <BrandMark className="w-10 h-10" />
                <div>
                  <span
                    className="font-serif block"
                    style={{
                      color: "var(--rd-text-ink)",
                      fontSize: "var(--rd-h1-size)",
                      fontWeight: "var(--rd-h1-weight)",
                      letterSpacing: "var(--rd-h1-tracking)",
                      lineHeight: "var(--rd-h1-leading)",
                    }}
                  >
                    Giants Wisdom
                  </span>
                  {/* No uppercase, no wide tracking. */}
                  <p
                    style={{
                      color: "var(--rd-text-muted)",
                      fontSize: "var(--rd-caption-size)",
                      letterSpacing: "var(--rd-caption-tracking)",
                      lineHeight: "var(--rd-caption-leading)",
                    }}
                  >
                    {t('brand.subtitle')}
                  </p>
                </div>
              </Link>
              <p className="mb-8 max-w-sm" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-body-size)", lineHeight: "var(--rd-body-leading)" }}>
                {t('brand.description')}
              </p>
              {/* Email / Contact icon */}
              <div className="flex items-center gap-4">
                <a
                  href="mailto:contact@giantswisdom.com"
                  className="flex items-center gap-2 transition-colors hover:opacity-70" style={{ color: "var(--rd-text-muted)" }}
                  aria-label="Contact us via email"
                >
                  <Mail className="w-5 h-5" />
                  <span style={{ fontSize: "var(--rd-caption-size)", letterSpacing: "var(--rd-caption-tracking)" }}>contact@giantswisdom.com</span>
                </a>
                <a
                  href="https://www.instagram.com/giantswisdom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-70" style={{ color: "var(--rd-text-muted)" }}
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
                  className="transition-colors hover:opacity-70" style={{ color: "var(--rd-text-muted)" }}
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
              {/* No uppercase, no wide tracking. */}
              <h4
                className="mb-5"
                style={{
                  color: "var(--rd-text-ink)",
                  fontSize: "var(--rd-sidebar-label-size)",
                  fontWeight: "var(--rd-sidebar-label-weight)",
                  lineHeight: "var(--rd-sidebar-label-leading)",
                }}
              >
                {t('sections.explore')}
              </h4>
              <ul className="space-y-4">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as any} className="transition-colors hover:underline" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-body-size)", lineHeight: "var(--rd-body-leading)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info links */}
            <div>
              <h4
                className="mb-5"
                style={{
                  color: "var(--rd-text-ink)",
                  fontSize: "var(--rd-sidebar-label-size)",
                  fontWeight: "var(--rd-sidebar-label-weight)",
                  lineHeight: "var(--rd-sidebar-label-leading)",
                }}
              >
                {t('sections.info')}
              </h4>
              <ul className="space-y-4">
                {footerLinks.info.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as any} className="transition-colors hover:underline" style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-body-size)", lineHeight: "var(--rd-body-leading)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}

              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col items-center justify-center gap-4 mt-12 text-center" style={{ borderTop: "1px solid var(--rd-divider-faint)" }}>
            <p style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)", letterSpacing: "var(--rd-caption-tracking)" }}>
              &copy; 2026 Giants Wisdom. {
                locale === 'ko' ? '모든 권리 보유.' :
                locale === 'ja' ? '無断複写・転載を禁じます。' :
                locale === 'de' ? 'Alle Rechte vorbehalten.' :
                locale === 'es' ? 'Todos los derechos reservados.' :
                locale === 'fr' ? 'Tous droits réservés.' :
                locale === 'it' ? 'Tutti i diritti riservati.' :
                locale === 'pt' ? 'Todos os direitos reservados.' :
                locale === 'ar' ? 'كل الحقوق محفوظة.' :
                locale === 'hi' ? 'सर्वाधिकार सुरक्षित।' :
                locale === 'ru' ? 'Все права защищены.' :
                locale === 'zh' ? '版权所有。' :
                'All rights reserved.'
              }
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
