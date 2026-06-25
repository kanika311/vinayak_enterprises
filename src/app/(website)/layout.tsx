import type { Metadata } from 'next';
import { WebsiteHeader } from '@/components/website/header';
import { WebsiteFooter } from '@/components/website/footer';
import { PageTransition } from '@/components/website/page-transition';
import { SEO } from '@/lib/constants';

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <WebsiteFooter />
    </div>
  );
}
