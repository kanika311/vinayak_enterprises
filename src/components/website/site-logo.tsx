'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

type SiteLogoProps = {
  /** header = white bar; footer = dark bar (logo sits on light plate) */
  variant?: 'header' | 'footer';
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ variant = 'header', className, priority }: SiteLogoProps) {
  const isFooter = variant === 'footer';

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center shrink-0 rounded-lg transition-opacity hover:opacity-95',
        isFooter && 'bg-white px-3 py-2 shadow-md ring-1 ring-white/20',
        className
      )}
      aria-label={SITE.name}
    >
      <Image
        src="/logo.png"
        alt={SITE.name}
        width={1408}
        height={768}
        priority={priority}
        className={cn(
          'w-auto object-contain object-left',
          isFooter ? 'h-12 sm:h-14' : 'h-11 sm:h-14 md:h-[3.75rem]'
        )}
      />
    </Link>
  );
}
