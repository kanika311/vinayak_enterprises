'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

type SiteLogoProps = {
  /** header = white bar; footer = dark bar */
  variant?: 'header' | 'footer';
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ variant = 'header', className, priority }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center shrink-0 select-none py-1',
        className
      )}
      aria-label={SITE.name}
    >
      {/* Brand Logo Mark Only (Clean, Uncluttered) */}
      <div className="relative shrink-0 h-11 sm:h-12 md:h-14 aspect-[1024/839] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/logo.png"
          alt={SITE.name}
          width={100}
          height={82}
          priority={priority}
          className="w-full h-full object-contain"
        />
      </div>
    </Link>
  );
}

export default SiteLogo;
