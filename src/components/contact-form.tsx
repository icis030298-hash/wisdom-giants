'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const t = useTranslations('Contact')
  const tContactForm = useTranslations("ContactForm")
  const locale = useLocale()

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', subject: '', message: '' })
      setStatus('idle')
      setErrors({})
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Auto close after success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = t('name') + ' required'
    if (!form.email.trim()) newErrors.email = t('email') + ' required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = tContactForm('enterAValidEmail')
    if (!form.message.trim()) newErrors.message = t('message') + ' required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  // The focus ring is the accent brown rather than amber, and it stays a
  // ring rather than only a border colour: on cream the two border states are
  // close enough in lightness that colour alone would not carry the error.
  const inputClass = (field: string) =>
    `w-full px-4 py-3 border text-sm rd-bg-surface rd-text-ink outline-none transition-all ${
      errors[field] ? 'rd-input-error' : 'rd-input'
    }`

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in rd-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <div
        className="relative w-full max-w-lg rd-surface overflow-hidden animate-fade-in-up shadow-[0_16px_40px_rgba(60,42,28,0.18)]"
        style={{ borderRadius: "var(--rd-card-radius)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 rd-hairline-bottom">
          <div>
            <h2 className="font-serif text-lg font-bold rd-text-ink">{t('title')}</h2>
            <p className="rd-caption mt-0.5">contact@giantswisdom.com</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg rd-text-muted hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--rd-divider-faint)" }}>
              <CheckCircle className="w-8 h-8" style={{ color: "#2f6b46" }} />
            </div>
            <p className="text-lg font-semibold rd-text-ink">{t('success')}</p>
            <p className="text-sm rd-text-body">
              {tContactForm('thisWindowWillClose')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium rd-text-body mb-1.5">{t('name')} *</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={t('namePlaceholder')}
                  className={inputClass('name')}
                  disabled={status === 'sending'}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: "var(--rd-error)" }}>{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium rd-text-body mb-1.5">{t('email')} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder={t('emailPlaceholder')}
                  className={inputClass('email')}
                  disabled={status === 'sending'}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: "var(--rd-error)" }}>{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium rd-text-body mb-1.5">{t('subject')}</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder={t('subjectPlaceholder')}
                className={inputClass('subject')}
                disabled={status === 'sending'}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium rd-text-body mb-1.5">{t('message')} *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder={t('messagePlaceholder')}
                rows={5}
                className={`${inputClass('message')} resize-none`}
                disabled={status === 'sending'}
              />
              {errors.message && <p className="text-xs mt-1" style={{ color: "var(--rd-error)" }}>{errors.message}</p>}
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm" style={{ background: "var(--rd-error-bg)", border: "1px solid var(--rd-error)", borderRadius: "var(--rd-card-radius)", color: "var(--rd-error)" }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                {t('error')}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 py-3.5 rd-bg-accent border font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ borderRadius: "var(--rd-card-radius)", borderColor: "var(--rd-accent-brown)", transitionDuration: "120ms" }}
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('send')}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
