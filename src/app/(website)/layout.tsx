import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { WebsiteHeader } from '@/components/website/header';
import { WebsiteFooter } from '@/components/website/footer';
import { PageTransition } from '@/components/website/page-transition';
import { SEO } from '@/lib/constants';

const WhatsAppFloat = dynamic(
  () => import('@/components/website/whatsapp-float').then((m) => m.WhatsAppFloat)
);

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
      <WhatsAppFloat />
    </div>
  );
}
