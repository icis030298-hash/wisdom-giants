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

  const silhouettePath = `M 260 110 C 230 110, 210 130, 200 170 L 170 230 C 165 240, 175 245, 175 245 L 170 250 L 180 250 L 175 260 C 170 270, 180 280, 185 280 C 170 290, 170 310, 170 310 L 185 340 L 210 350 L 220 380 C 200 420, 210 450, 265 450 C 320 450, 330 420, 310 380 C 300 370, 300 350, 300 340 C 310 330, 320 320, 320 320 C 310 310, 310 300, 310 300 C 330 290, 330 280, 330 280 C 320 270, 320 260, 320 260 C 340 240, 340 230, 340 230 C 330 210, 330 200, 330 200 C 320 180, 320 170, 320 170 C 300 140, 290 120, 260 110 Z`;

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
          <circle cx="256" cy="256" r="220" fill="#F59E0B"/>
          <path d={silhouettePath} fill="#0B0F19"/>
        </svg>
      </div>
    ),
    { width: w, height: w }
  )
}
