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
      newErrors.email = locale === 'ko' ? '올바른 이메일을 입력하세요' : locale === 'de' ? 'Gültige E-Mail eingeben' : 'Enter a valid email'
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

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:ring-2 focus:ring-amber-500/40 ${
      errors[field] ? 'border-red-500/60' : 'border-white/10 focus:border-amber-500/40'
    }`

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <div className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">{t('title')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">contact@giantswisdom.com</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-lg font-semibold text-foreground">{t('success')}</p>
            <p className="text-sm text-muted-foreground">
              {locale === 'ko' ? '잠시 후 창이 닫힙니다.' : locale === 'de' ? 'Das Fenster wird gleich geschlossen.' : 'This window will close shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('name')} *</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={t('namePlaceholder')}
                  className={inputClass('name')}
                  disabled={status === 'sending'}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('email')} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder={t('emailPlaceholder')}
                  className={inputClass('email')}
                  disabled={status === 'sending'}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('subject')}</label>
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
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{t('message')} *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder={t('messagePlaceholder')}
                rows={5}
                className={`${inputClass('message')} resize-none`}
                disabled={status === 'sending'}
              />
              {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {t('error')}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
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
