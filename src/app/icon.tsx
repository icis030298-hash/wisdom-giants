import { ImageResponse } from 'next/og'
import { BRAND_SOLID_DATA_URI } from '@/components/brand-art'

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
  let w = parseInt(id, 10)
  if (isNaN(w)) w = 512

  // The disc is the icon. There is no plate behind it any more — the old one
  // was a navy rounded square, a colour the site no longer uses anywhere, and
  // a square around a circle only shrinks the circle. Transparent lets the
  // mark sit on whatever the OS or the browser tab puts behind it.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRAND_SOLID_DATA_URI} width={w} height={w} alt="" />
      </div>
    ),
    { width: w, height: w }
  )
}
