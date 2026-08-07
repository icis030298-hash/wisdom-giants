/**
 * Helper to attach proper Korean particles (조사: 와/과, 은/는, 이/가, 을/를) based on Hangul batchim.
 */
export function getKoreanJosa(word: string, type: 'wa/gwa' | 'eun/neun' | 'i/ga' | 'eul/reul'): string {
  if (!word || word.length === 0) return word;
  const lastChar = word.charCodeAt(word.length - 1);

  // If last char is not Hangul (0xAC00 ~ 0xD7A3), default to second option
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) {
    if (type === 'wa/gwa') return `${word}와`;
    if (type === 'eun/neun') return `${word}는`;
    if (type === 'i/ga') return `${word}가`;
    if (type === 'eul/reul') return `${word}를`;
  }

  const hasBatchim = (lastChar - 0xAC00) % 28 > 0;

  switch (type) {
    case 'wa/gwa':
      return `${word}${hasBatchim ? '과' : '와'}`;
    case 'eun/neun':
      return `${word}${hasBatchim ? '은' : '는'}`;
    case 'i/ga':
      return `${word}${hasBatchim ? '이' : '가'}`;
    case 'eul/reul':
      return `${word}${hasBatchim ? '을' : '를'}`;
    default:
      return word;
  }
}
