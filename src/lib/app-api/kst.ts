const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * Calendar day in Asia/Seoul as YYYY-MM-DD. The daily quota resets at KST
 * midnight and the server runs on UTC, so every date comparison in
 * /api/app/* goes through here — never `new Date().toISOString().slice(0,10)`.
 * KST has no DST, so a fixed +9h offset is exact.
 */
export function kstDate(now: Date = new Date()): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}
