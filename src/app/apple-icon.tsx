import { ImageResponse } from 'next/og'
import { BRAND_SOLID_DATA_URI } from '@/components/brand-art'

export const runtime = 'edge'
export const contentType = 'image/png'

export function generateImageMetadata() {
  return [
    { id: '180', size: { width: 180, height: 180 }, alt: 'Apple Touch Icon 180x180' },
    { id: '512', size: { width: 512, height: 512 }, alt: 'Apple Touch Icon 512x512' },
  ]
}

export default function Icon({ id }: { id: string }) {
  let w = parseInt(id, 10)
  if (isNaN(w)) w = 512

  // iOS composites its own rounded-rect mask and does not honour
  // transparency, so this one keeps a filled ground. Cream rather than the
  // old navy: on a home screen the mark should read as the site does.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf7f0',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRAND_SOLID_DATA_URI} width={Math.round(w * 0.82)} height={Math.round(w * 0.82)} alt="" />
      </div>
    ),
    { width: w, height: w }
  )
}
