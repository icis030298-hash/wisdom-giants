import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
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
          <path d="M 120 450 Q 256 300 392 450 Z" fill="#F59E0B" opacity="0.8"/>
          <circle cx="256" cy="280" r="40" fill="#F59E0B" opacity="0.8"/>
          <circle cx="210" cy="300" r="15" fill="#F59E0B"/>
          <rect x="205" y="320" width="10" height="30" fill="#F59E0B"/>
          <path d="M 210 350 L 200 390 M 210 350 L 220 390" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
        </svg>
      </div>
    ),
    { ...size }
  )
}
