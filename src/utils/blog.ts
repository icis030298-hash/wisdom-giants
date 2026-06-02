export function getReadTime(content: string, locale: string): number {
  if (locale === "ko" || locale === "ja") {
    return Math.max(1, Math.ceil(content.length / 500))
  } else {
    const words = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }
}
