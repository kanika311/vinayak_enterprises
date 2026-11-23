'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

type SiteLogoProps = {
  /** header = white bar; footer = dark bar */
  variant?: 'header' | 'footer';
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ variant = 'header', className }: SiteLogoProps) {
  const isFooter = variant === 'footer';
  const [tilt, setTilt] = useState(12);
  const [isPulsing, setIsPulsing] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
    setTilt(12 + x * 14);
  };

  const handlePointerLeave = () => {
    setTilt(12);
  };

  const handleClick = () => {
    setIsPulsing(false);
    setTimeout(() => setIsPulsing(true), 10);
    setTimeout(() => setIsPulsing(false), 800);
  };

  const inkColor = isFooter ? '#1f3f73' : '#1f3f73';
  const cutoutColor = '#ffffff';
  const accentColor = '#f26b21';

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center shrink-0 transition-transform select-none',
        className
      )}
      aria-label={SITE.name}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* SVG Mark */}
        <div className="relative shrink-0 w-11 sm:w-13 md:w-14 aspect-[210/160]">
          <svg
            viewBox="0 0 210 160"
            aria-hidden="true"
            className="w-full h-full overflow-visible transition-transform duration-200 group-hover:scale-105 cursor-pointer"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
          >
            {/* V Letter */}
            <g className="v">
              <polygon
                fill={inkColor}
                points="0,20 44,20 70,118 96,30 118,30 84,150 56,150"
                className="transition-colors duration-300"
              />
            </g>

            {/* E Bars */}
            <rect fill={inkColor} x="118" y="20" width="84" height="14" className="transition-colors duration-300" />
            <rect fill={inkColor} x="118" y="88" width="84" height="14" className="transition-colors duration-300" />
            <rect fill={inkColor} x="84" y="134" width="118" height="16" className="transition-colors duration-300" />

            {/* Microscope within E */}
            <g
              style={{
                transformOrigin: '150px 128px',
                transform: `rotate(${tilt}deg)`,
                transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {/* Arm cutout border */}
              <path
                d="M158 26 C186 44 186 104 150 122"
                fill="none"
                stroke={cutoutColor}
                strokeWidth={14}
                strokeLinecap="round"
              />
              <path
                d="M158 26 C186 44 186 104 150 122"
                fill="none"
                stroke={inkColor}
                strokeWidth={8}
                strokeLinecap="round"
                className="transition-colors duration-300"
              />

              {/* Base cutout border */}
              <path
                d="M122 124 Q150 146 178 124"
                fill="none"
                stroke={cutoutColor}
                strokeWidth={13}
                strokeLinecap="round"
              />
              <path
                d="M122 124 Q150 146 178 124"
                fill="none"
                stroke={inkColor}
                strokeWidth={7}
                strokeLinecap="round"
                className="transition-colors duration-300"
              />

              {/* Stage & Adjuster */}
              <rect
                fill={inkColor}
                stroke={cutoutColor}
                strokeWidth={3}
                x="138"
                y="74"
                width="24"
                height="6"
                rx="2"
              />
              <rect
                fill={inkColor}
                stroke={cutoutColor}
                strokeWidth={3}
                x="145"
                y="64"
                width="10"
                height="12"
                rx="2"
              />

              {/* Tube */}
              <rect
                fill={inkColor}
                stroke={cutoutColor}
                strokeWidth={3}
                x="139"
                y="14"
                width="18"
                height="52"
                rx="4"
              />
              <rect
                fill={inkColor}
                stroke={cutoutColor}
                strokeWidth={3}
                x="143"
                y="4"
                width="10"
                height="12"
                rx="2"
              />

              {/* Pulsing Light Halo */}
              {isPulsing && (
                <circle
                  cx="148"
                  cy="40"
                  r="12"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="2.5"
                  className="animate-ping"
                  style={{ transformOrigin: '148px 40px' }}
                />
              )}

              {/* Focal Orange Dot */}
              <circle cx="148" cy="40" r="5.5" fill={accentColor} />
            </g>
          </svg>
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
