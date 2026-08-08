import { ImageResponse } from 'next/og'
import { SILHOUETTE_PATH } from '@/components/brand-mark'

export const runtime = 'edge'
export const contentType = 'image/png'

export function generateImageMetadata() {
  return [
    { id: '180', size: { width: 180, height: 180 }, alt: 'Apple Touch Icon 180x180' },
    { id: '512', size: { width: 512, height: 512 }, alt: 'Apple Touch Icon 512x512' },
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
