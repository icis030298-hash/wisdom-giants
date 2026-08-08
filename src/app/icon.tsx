import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'

export function generateImageMetadata() {
  return [
    { id: '16', size: { width: 16, height: 16 }, alt: 'Icon 16x16' },
    { id: '32', size: { width: 32, height: 32 }, alt: 'Icon 32x32' },
    { id: '48', size: { width: 48, height: 48 }, alt: 'Icon 48x48' },
    { id: '192', size: { width: 192, height: 192 }, alt: 'Icon 192x192' },
    { id: '512', size: { width: 512, height: 512 }, alt: 'Icon 512x512' },
  ]
}

export default function Icon({ id }: { id: string }) {
  let w = parseInt(id, 10);
  if (isNaN(w)) w = 512;
  const isSmall = w <= 16;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0F19',
          borderRadius: w * 0.22,
        }}
      >
        {isSmall ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M 2 15 Q 8 7 14 15 Z" fill="#F59E0B"/>
            <rect x="6" y="6" width="2" height="3" fill="#F59E0B"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
            <path d="M 120 450 Q 256 300 392 450 Z" fill="#F59E0B" opacity="0.8"/>
            <circle cx="256" cy="280" r="40" fill="#F59E0B" opacity="0.8"/>
            <circle cx="210" cy="300" r="15" fill="#F59E0B"/>
            <rect x="205" y="320" width="10" height="30" fill="#F59E0B"/>
            <path d="M 210 350 L 200 390 M 210 350 L 220 390" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    ),
    { width: w, height: w }
  )
}
