/**
 * The brand mark's geometry, with no React and no 'use client'.
 *
 * It lives apart from brand-mark.tsx because the icon routes are edge
 * handlers: importing a constant out of a 'use client' module from server
 * code hands back a client reference rather than the value, and Satori then
 * fails on it with "a.startsWith is not a function".
 *
 * A figure standing on a shoulder — the lower arc is the giant, the form
 * above it is the person who climbed up. One colour: the palette has one
 * accent, and the mark it replaces was an amber disc with a navy silhouette,
 * both retired.
 *
 * public/brand-ring.svg and public/brand-solid.svg carry the same paths as
 * standalone files and must be kept in step with these.
 */

export const BRAND_BROWN = '#6b3f2a' // --rd-accent-brown
export const BRAND_CREAM = '#faf7f0' // --rd-bg-base

export const SHOULDER_PATH = 'M28 492 C28 372 128 306 256 306 C384 306 484 372 484 492 Z'
export const HEAD_CENTER = { cx: 256, cy: 182, r: 41 }
export const TORSO_PATH = 'M214 284 C214 236 298 236 298 284 Z'

/**
 * The solid mark as a complete SVG document.
 *
 * next/og rasterises through Satori, whose clipPath support is partial, and
 * the shoulder arc runs well past the disc — at y=492 it spans 456px against
 * the circle's 87px, so an unclipped render would not look like the mark at
 * all. Handing Satori a whole SVG as an <img> routes it through resvg, which
 * clips correctly.
 */
export const BRAND_SOLID_SVG =
  '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' +
  '<defs><clipPath id="s"><circle cx="256" cy="256" r="240"/></clipPath></defs>' +
  `<circle cx="256" cy="256" r="240" fill="${BRAND_BROWN}"/>` +
  '<g clip-path="url(#s)">' +
  `<path d="${SHOULDER_PATH}" fill="${BRAND_CREAM}"/>` +
  `<circle cx="${HEAD_CENTER.cx}" cy="${HEAD_CENTER.cy}" r="${HEAD_CENTER.r}" fill="${BRAND_CREAM}"/>` +
  `<path d="${TORSO_PATH}" fill="${BRAND_CREAM}"/>` +
  '</g></svg>'

export const BRAND_SOLID_DATA_URI =
  'data:image/svg+xml;utf8,' + encodeURIComponent(BRAND_SOLID_SVG)
