'use client'

import React, { useId } from 'react'
import {
  BRAND_BROWN,
  BRAND_CREAM,
  HEAD_CENTER,
  SHOULDER_PATH,
  TORSO_PATH,
} from '@/components/brand-art'

/**
 * Two cuts of the same drawing. The ring is for 24px and up, where a stroke
 * still reads and echoes the circular portrait frames on the giant pages. The
 * solid is for favicons and app icons, where a 25/512 stroke thins to nothing
 * and the shape has to survive on mass alone.
 *
 * The geometry lives in brand-art.ts so the edge icon routes can import it
 * without crossing the client boundary.
 */
const scene = (fill: string) => (
  <>
    <path d={SHOULDER_PATH} fill={fill} />
    <circle cx={HEAD_CENTER.cx} cy={HEAD_CENTER.cy} r={HEAD_CENTER.r} fill={fill} />
    <path d={TORSO_PATH} fill={fill} />
  </>
)

/** 24px and up — the outlined seal. */
export function BrandMark({ className }: { className?: string }) {
  // The header and the footer both render this, and two identical clipPath
  // ids in one document is invalid markup: a browser resolves url(#id) to
  // whichever came first, so removing one instance can silently break the
  // other. useId gives each render its own.
  const clip = useId()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <defs>
        <clipPath id={clip}>
          <circle cx="256" cy="256" r="213" />
        </clipPath>
      </defs>
      <circle cx="256" cy="256" r="226" fill="none" stroke={BRAND_BROWN} strokeWidth="25" />
      <g clipPath={`url(#${clip})`}>{scene(BRAND_BROWN)}</g>
    </svg>
  )
}

/** Under 24px and app icons — a filled disc with the figure cut out of it. */
export function BrandMarkSolid({ className }: { className?: string }) {
  const clip = useId()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <defs>
        <clipPath id={clip}>
          <circle cx="256" cy="256" r="240" />
        </clipPath>
      </defs>
      <circle cx="256" cy="256" r="240" fill={BRAND_BROWN} />
      <g clipPath={`url(#${clip})`}>{scene(BRAND_CREAM)}</g>
    </svg>
  )
}
