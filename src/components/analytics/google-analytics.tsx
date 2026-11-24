'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    // Do NOT track admin or console navigation as public site traffic
    if (pathname.startsWith('/console') || pathname.startsWith('/admin')) {
      return;
    }

    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    // 1. Google Analytics gtag event
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'G-T8FJ2V7T6P', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // 2. Real-time Backend Analytics & Visitor Tracking
    const device = getDeviceType();
    const referrer = typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct';

    // Unique session visitor tracking
    const isNewSession = !sessionStorage.getItem('ve_session_tracked');
    if (isNewSession) {
      sessionStorage.setItem('ve_session_tracked', 'true');
      fetch('/api/v1/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'visitor',
          path: url,
          device,
          referrer,
          browser: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 150) : '',
        }),
        keepalive: true,
      }).catch(() => {});
    }

    // Every page view
    fetch('/api/v1/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        path: url,
        device,
        referrer,
        browser: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 150) : '',
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalyticsRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
