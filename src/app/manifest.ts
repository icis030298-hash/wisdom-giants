import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Giants Wisdom',
    short_name: 'GiantsWisdom',
    description: 'Talk with historical figures via AI',
    start_url: '/',
    display: 'standalone',
    // theme_color tints the mobile address bar. Left at navy it would have
    // been the last place the retired palette still showed, and on a cream
    // site a dark bar reads as a different app.
    background_color: '#faf7f0',
    theme_color: '#faf7f0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
