'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, Plus, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { staggerContainer, fadeUp } from '@/components/website/motion';

export interface TestimonialItem {
  _id: string;
  name: string;
  company: string;
  designation?: string;
  productName?: string;
  review: string;
  rating: number;
  image?: { url: string; publicId?: string };
  createdAt?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    _id: 'default-test-1',
    name: 'Dr. R. K. Sharma',
    company: 'Government Medical College & Hospital',
    designation: 'Head of Anatomy Dept',
    productName: '85cm Unisex Torso & Skull Models',
    review:
      'The anatomical accuracy of the PVC models from Vinayak Enterprises is outstanding. Dissectible organs fit perfectly and withstand daily student handling.',
    rating: 5,
    createdAt: '2026-11-20T10:00:00.000Z',
  },
  {
    _id: 'default-test-2',
    name: 'Prof. Ananya Sen',
    company: 'Modern Institute of Science & Technology',
    designation: 'Lab Director',
    productName: 'Vilakshan Netra Binocular Research Microscopes',
    review:
      'We procured 40 units of Vilakshan Netra microscopes for our biology and pharmacy labs. Superior optics, robust mechanical stage, and great price point.',
    rating: 5,
    createdAt: '2026-11-18T10:00:00.000Z',
  },
  {
    _id: 'default-test-3',
    name: 'Vikas Malhotra',
    company: 'National Paramedical & Nursing Institute',
    designation: 'Principal',
    productName: 'Full-Body Adult CPR Training Manikins',
    review:
      'Our nursing students use the CPR manikins daily. The chest compression resistance and airway feedback provide realistic life-support training.',
    rating: 5,
    createdAt: '2026-11-15T10:00:00.000Z',
  },
];

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-teal-100 text-teal-800 border-teal-200',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name[0] || 'V').toUpperCase();
}

function formatReviewDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  initialTestimonials,
}: {
  initialTestimonials?: TestimonialItem[];
}) {
  const { data: testimonials = initialTestimonials } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: () => apiGet<TestimonialItem[]>('/testimonials'),
    initialData: initialTestimonials,
  });

  const list =
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section id="testimonials" className="py-14 bg-[#f8f9fa] overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Header: Single Centered Title + "+ Write a Review" Pill Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-8"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3a6b] tracking-tight"
          >
            Testimonials
          </motion.h2>

          {/* Centered '+ Write a Review' Pill Button (matching reference) */}
          <motion.div variants={fadeUp} className="mt-4 flex justify-center">
            <Link
              href="/share-experience"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 hover:border-orange-500 shadow-sm hover:shadow-md text-slate-800 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-slate-100"
            >
              <Plus className="h-4 w-4 text-orange-600 font-bold" />
              <span>Write a Review</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Multi-Column Masonry Grid of All Approved Testimonials */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {list.map((t) => (
            <div
              key={t._id}
              className="break-inside-avoid bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Reviewer Header: Avatar + Name/Institution + Green Verified Badge */}
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 select-none ${getAvatarColor(
                        t.name
                      )}`}
                    >
                      {getInitials(t.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight truncate">
                        {t.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                        {t.designation ? `${t.designation} · ` : ''}
                        {t.company}
                      </p>
                    </div>
                  </div>

                  {/* Green Verified Customer Check Badge */}
                  <div
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                    title="Verified Institutional Customer"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                </div>

                {/* 5 Gold Stars */}
                <div className="mb-2">
                  <Stars rating={t.rating} />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  &ldquo;{t.review.replace(/^["“”]+|["“”]+$/g, '')}&rdquo;
                </p>

                {/* Purchased Product Tag */}
                {t.productName && (
                  <div className="mt-2.5">
                    <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                      Purchased: {t.productName}
                    </span>
                  </div>
                )}

                {/* Customer Uploaded Photo (if present) */}
                {t.image?.url && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={t.image.url}
                      alt={`Product photo by ${t.name}`}
                      className="w-full h-auto max-h-56 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Date & Verification Tag */}
              {t.createdAt && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{formatReviewDate(t.createdAt)}</span>
                  <span className="text-slate-400 text-[10px]">Vinayak Client</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
