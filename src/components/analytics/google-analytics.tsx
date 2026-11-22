'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

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
