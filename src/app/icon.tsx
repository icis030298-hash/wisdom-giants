import { ImageResponse } from 'next/og'
import { SILHOUETTE_PATH } from '@/components/brand-mark'

export const runtime = 'edge'
export const contentType = 'image/png'

export function generateImageMetadata() {
  return [
    { id: '16', size: { width: 16, height: 16 }, alt: 'App Icon 16x16' },
    { id: '32', size: { width: 32, height: 32 }, alt: 'App Icon 32x32' },
    { id: '48', size: { width: 48, height: 48 }, alt: 'App Icon 48x48' },
    { id: '192', size: { width: 192, height: 192 }, alt: 'App Icon 192x192' },
    { id: '512', size: { width: 512, height: 512 }, alt: 'App Icon 512x512' },
  ]
}

export default function Icon({ id }: { id: string }) {
  let w = parseInt(id, 10);
  if (isNaN(w)) w = 512;

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
          <path d={SILHOUETTE_PATH} fill="#0B0F19"/>
        </svg>
      </div>
    ),
    { width: w, height: w }
  )
}
