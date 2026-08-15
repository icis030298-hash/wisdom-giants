"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { Check, ChevronDown, Languages, Loader2, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Native name (endonym) and script, so the list can be grouped by writing
// system. The endonym is data, not UI copy — it is identical in every locale.
// The secondary description is produced by Intl.DisplayNames in the reader's
// own language, so no translation keys are needed for 24 x 24 combinations.
type LocaleEntry = { code: string; endonym: string; script: string }

const LOCALES: LocaleEntry[] = [
  { code: "en", endonym: "English", script: "Latn" },
  { code: "nl", endonym: "Nederlands", script: "Latn" },
  { code: "fr", endonym: "Français", script: "Latn" },
  { code: "de", endonym: "Deutsch", script: "Latn" },
  { code: "ha", endonym: "Hausa", script: "Latn" },
  { code: "id", endonym: "Bahasa Indonesia", script: "Latn" },
  { code: "it", endonym: "Italiano", script: "Latn" },
  { code: "pl", endonym: "Polski", script: "Latn" },
  { code: "pt", endonym: "Português", script: "Latn" },
  { code: "es", endonym: "Español", script: "Latn" },
  { code: "sw", endonym: "Kiswahili", script: "Latn" },
  { code: "tr", endonym: "Türkçe", script: "Latn" },
  { code: "vi", endonym: "Tiếng Việt", script: "Latn" },
  { code: "ko", endonym: "한국어", script: "Hang" },
  { code: "ja", endonym: "日本語", script: "Jpan" },
  { code: "zh", endonym: "简体中文", script: "Hans" },
  { code: "ar", endonym: "العربية", script: "Arab" },
  { code: "fa", endonym: "فارسی", script: "Arab" },
  { code: "he", endonym: "עברית", script: "Hebr" },
  { code: "ru", endonym: "Русский", script: "Cyrl" },
  { code: "uk", endonym: "Українська", script: "Cyrl" },
  { code: "el", endonym: "Ελληνικά", script: "Grek" },
  { code: "hi", endonym: "हिन्दी", script: "Deva" },
  { code: "th", endonym: "ไทย", script: "Thai" },
]

const SCRIPT_ORDER = ["Latn", "Hang", "Jpan", "Hans", "Arab", "Hebr", "Cyrl", "Grek", "Deva", "Thai"]

// Fallback headings for when Intl.DisplayNames has no script data. Written in
// the script itself rather than in any one language, so the group is still
// recognisable to every reader instead of showing a raw "Latn"/"Hang" code.
const SCRIPT_FALLBACK: Record<string, string> = {
  Latn: "Aa",
  Hang: "한글",
  Jpan: "あ / 漢",
  Hans: "汉",
  Arab: "ا ب",
  Hebr: "א ב",
  Cyrl: "Аа",
  Grek: "Αα",
  Deva: "अ",
  Thai: "ก",
}

function useDisplayNames(locale: string) {
  return useMemo(() => {
    // Intl.DisplayNames coverage varies by engine. Older Android WebViews and
    // reduced-ICU builds may not support type:"script" at all — the
    // constructor can throw, or .of() can hand back the raw subtag. Both cases
    // fall through to the endonym / script sample below so the menu stays
    // readable instead of showing "Latn" or blowing up on open.
    const make = (type: "language" | "script") => {
      try {
        if (typeof Intl === "undefined" || typeof Intl.DisplayNames !== "function") return null
        return new Intl.DisplayNames([locale], { type })
      } catch {
        return null
      }
    }
    const language = make("language")
    const script = make("script")

    const resolve = (dn: Intl.DisplayNames | null, code: string) => {
      if (!dn) return null
      try {
        const name = dn.of(code)
        // A result equal to the input means the engine had no data for it.
        return name && name !== code ? name : null
      } catch {
        return null
      }
    }

    return {
      // Reads as e.g. "독일어" for a Korean reader, "German" for an English one.
      languageOf: (code: string) => resolve(language, code),
      scriptOf: (code: string) => resolve(script, code) ?? SCRIPT_FALLBACK[code] ?? null,
    }
  }, [locale])
}

export function LanguageSwitcher({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("LanguageSwitcher")
  const names = useDisplayNames(locale)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  // Keys are reported but not yet present in messages/*.json; render the
  // affordance without invented copy until they land.
  const label = (key: string) => (t.has(key) ? t(key) : undefined)

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (l: LocaleEntry) =>
      !q ||
      l.endonym.toLowerCase().includes(q) ||
      l.code.includes(q) ||
      (names.languageOf(l.code) ?? "").toLowerCase().includes(q)

    return SCRIPT_ORDER.map((script) => ({
      script,
      heading: names.scriptOf(script),
      items: LOCALES.filter((l) => l.script === script && l.code !== locale && matches(l)),
    })).filter((g) => g.items.length > 0)
  }, [query, locale, names])

  const currentVisible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (
      !q ||
      current.endonym.toLowerCase().includes(q) ||
      current.code.includes(q) ||
      (names.languageOf(current.code) ?? "").toLowerCase().includes(q)
    )
  }, [query, current, names])

  function select(next: string) {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next as any })
    })
  }

  const Row = ({ entry, isCurrent }: { entry: LocaleEntry; isCurrent: boolean }) => {
    const description = names.languageOf(entry.code)
    return (
      <button
        type="button"
        role="menuitemradio"
        aria-checked={isCurrent}
        onClick={() => select(entry.code)}
        className={`w-full flex items-center gap-2.5 rounded-md py-2 ps-2.5 pe-2 text-start transition-colors ${
          isCurrent ? "font-semibold" : "hover:bg-[color:var(--rd-divider-faint)]"
        }`}
        style={
          isCurrent
            ? {
                color: "var(--rd-accent-brown)",
                borderInlineStart: "2px solid var(--rd-accent-brown)",
                backgroundColor: "var(--rd-divider-faint)",
              }
            : { color: "var(--rd-text-body)" }
        }
      >
        <Check
          className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate leading-tight">{entry.endonym}</span>
          {description && description !== entry.endonym && (
            <span
              className="block truncate leading-tight"
              style={{
                color: isCurrent ? "var(--rd-accent-brown)" : "var(--rd-text-muted)",
                fontSize: "var(--rd-caption-size)",
                letterSpacing: "var(--rd-caption-tracking)",
              }}
            >
              {description}
            </span>
          )}
        </span>
      </button>
    )
  }

  const trigger =
    variant === "desktop" ? (
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg rd-surface transition-colors hover:bg-[color:var(--rd-divider-faint)] outline-none"
        style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-caption-size)" }}
        aria-label={current.endonym}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 motion-safe:animate-spin" style={{ color: "var(--rd-accent-brown)" }} aria-hidden="true" />
        ) : (
          <Languages className="w-4 h-4" style={{ color: "var(--rd-accent-brown)" }} aria-hidden="true" />
        )}
        <span>{current.endonym}</span>
        <ChevronDown className="w-3 h-3" style={{ color: "var(--rd-text-muted)" }} aria-hidden="true" />
      </button>
    ) : (
      <button
        className="h-8 flex items-center gap-1.5 px-2 rounded-lg rd-surface outline-none cursor-pointer flex-shrink-0"
        style={{ color: "var(--rd-text-body)", fontSize: "var(--rd-caption-size)" }}
        aria-label={current.endonym}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 motion-safe:animate-spin" style={{ color: "var(--rd-accent-brown)" }} aria-hidden="true" />
        ) : (
          <Languages className="w-4 h-4" aria-hidden="true" />
        )}
        <span className="uppercase" style={{ letterSpacing: "var(--rd-caption-tracking)" }}>
          {current.code}
        </span>
      </button>
    )

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setQuery("") }}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="rd-surface p-0 overflow-hidden shadow-[0_12px_32px_rgba(42,35,32,0.12)]"
        style={{ width: variant === "desktop" ? 320 : 280, borderRadius: 6 }}
      >
        {label("panelTitle") && (
          <DropdownMenuLabel
            className="px-3 pt-3 pb-1"
            style={{
              color: "var(--rd-text-ink)",
              fontSize: "var(--rd-sidebar-label-size)",
              fontWeight: 600,
            }}
          >
            {label("panelTitle")}
          </DropdownMenuLabel>
        )}

        <div className="px-2.5 pt-2.5 pb-2">
          <div
            className="flex items-center gap-2 rounded-md px-2.5 py-1.5"
            style={{ border: "1px solid var(--rd-border)", background: "var(--rd-bg-base)" }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--rd-text-muted)" }} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              // Radix runs its own typeahead on the menu; without this every
              // keystroke would jump focus to a menu item instead of typing.
              onKeyDown={(e) => e.stopPropagation()}
              placeholder={label("searchPlaceholder")}
              aria-label={label("searchPlaceholder")}
              className="w-full bg-transparent outline-none min-w-0"
              style={{
                color: "var(--rd-text-body)",
                fontSize: "var(--rd-caption-size)",
                lineHeight: "var(--rd-caption-leading)",
              }}
            />
          </div>
        </div>

        <div role="group" className="max-h-[min(60vh,26rem)] overflow-y-auto px-1.5 pb-2">
          {currentVisible && (
            <>
              {label("currentTag") && (
                <DropdownMenuLabel
                  className="px-1.5 pt-1 pb-1"
                  style={{
                    color: "var(--rd-text-muted)",
                    fontSize: "var(--rd-caption-size)",
                    fontWeight: 500,
                    letterSpacing: "var(--rd-caption-tracking)",
                  }}
                >
                  {label("currentTag")}
                </DropdownMenuLabel>
              )}
              <Row entry={current} isCurrent />
              <div className="my-1.5 h-px" style={{ background: "var(--rd-divider-faint)" }} />
            </>
          )}

          {groups.map((group) => (
            <div key={group.script} className="pb-1">
              {group.heading && (
                <DropdownMenuLabel
                  className="px-1.5 pt-1.5 pb-1"
                  style={{
                    color: "var(--rd-text-muted)",
                    fontSize: "var(--rd-caption-size)",
                    fontWeight: 500,
                    letterSpacing: "var(--rd-caption-tracking)",
                  }}
                >
                  {group.heading}
                </DropdownMenuLabel>
              )}
              {group.items.map((entry) => (
                <Row key={entry.code} entry={entry} isCurrent={false} />
              ))}
            </div>
          ))}

          {!currentVisible && groups.length === 0 && (
            <p
              className="px-2.5 py-4 text-center"
              style={{ color: "var(--rd-text-muted)", fontSize: "var(--rd-caption-size)" }}
            >
              {label("noResults") ?? "—"}
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
