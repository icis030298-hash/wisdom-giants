'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Sparkles, Mail, Loader2, Check } from 'lucide-react'

export function NewsletterForm() {
  const t = useTranslations('Newsletter')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      })
      const data = await res.json()

      if (data.message === 'already_subscribed') {
        setStatus('success')
      } else if (data.message === 'success') {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('[Newsletter submit error]:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 animate-fade-in text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-white font-serif font-bold text-lg mb-1">
          {t('successMessage')}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed">
          {t('successSubtext')}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            disabled={status === 'loading'}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-900/60 border border-stone-800 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm backdrop-blur-md disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm transition-all hover:shadow-lg hover:shadow-amber-500/15 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:shadow-none cursor-pointer whitespace-nowrap"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
              <span>{t('subscribing')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{t('subscribeButton')}</span>
            </>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2 text-center sm:text-left">
          An error occurred. Please try again.
        </p>
      )}
    </div>
  )
}
export default NewsletterForm
