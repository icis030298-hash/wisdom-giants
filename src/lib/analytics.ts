export const trackCTAEvent = (
  location: 'giant_page' | 'blog_post',
  target: 'dna' | 'debate' | 'counsel' | 'chat',
  locale: string,
  source_slug: string
) => {
  if (typeof window === 'undefined') return;

  try {
    const rawConsent = localStorage.getItem('giants_cookie_consent');
    if (!rawConsent) return;
    
    const consent = JSON.parse(rawConsent);
    if (!consent.analytics) return;

    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'cta_click', {
        location,
        target,
        locale,
        source_slug,
      });
    }
  } catch (err) {
    console.error('Error tracking CTA event:', err);
  }
};
