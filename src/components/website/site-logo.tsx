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
        'group inline-flex items-center shrink-0 select-none',
        className
      )}
      aria-label={SITE.name}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Brand Logo Mark */}
        <div className="relative shrink-0 h-10 sm:h-11 md:h-12 aspect-[1024/839] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <Image
            src="/logo.png"
            alt={SITE.name}
            width={72}
            height={59}
            priority={priority}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Lockup */}
        <div className="flex flex-col text-left leading-none tracking-tight">
          <span
            className="font-extrabold tracking-tight text-[15px] sm:text-[18px] md:text-[20px] font-sans transition-colors text-[#1f3f73] group-hover:text-[#162f56]"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '0.02em' }}
          >
            VINAYAK ENTERPRISES
          </span>
          <div className="h-[2px] bg-[#f26b21] w-full my-[3px] sm:my-[4px] rounded-full transition-transform origin-left group-hover:scale-x-105" />
          <div
            className="flex items-center justify-between gap-1 text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold tracking-wider text-[#1f3f73]/90"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
            <span>MANUFACTURER</span>
            <span className="text-[#f26b21] text-[6px]">●</span>
            <span>BULK SUPPLIER</span>
            <span className="text-[#f26b21] text-[6px]">●</span>
            <span>DISTRIBUTOR</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SiteLogo;
