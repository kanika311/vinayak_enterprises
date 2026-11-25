'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, Plus, CheckCircle2 } from 'lucide-react';
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
  'bg-emerald-100 text-emerald-800 border-emerald-300',
  'bg-rose-100 text-rose-800 border-rose-300',
  'bg-sky-100 text-sky-800 border-sky-300',
  'bg-amber-100 text-amber-800 border-amber-300',
  'bg-purple-100 text-purple-800 border-purple-300',
  'bg-indigo-100 text-indigo-800 border-indigo-300',
  'bg-teal-100 text-teal-800 border-teal-300',
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
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
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

          {/* Centered '+ Write a Review' Pill Button */}
          <motion.div variants={fadeUp} className="mt-4 flex justify-center">
            <Link
              href="/share-experience"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 hover:border-orange-500 shadow-sm hover:shadow-md text-slate-800 font-extrabold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-slate-100"
            >
              <Plus className="h-4 w-4 text-orange-600 font-extrabold" />
              <span>Write a Review</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Multi-Column Masonry Grid of All Approved Testimonials */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {list.map((t) => {
            const cleanReview = t.review.replace(/^["'“”‘’\s]+|["'“”‘’\s]+$/g, '').trim();

            return (
              <div
                key={t._id}
                className="break-inside-avoid bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Reviewer Header: Avatar + Name/Institution + Green Verified Badge */}
                  <div className="flex items-start justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-extrabold text-sm shrink-0 select-none shadow-2xs ${getAvatarColor(
                          t.name
                        )}`}
                      >
                        {getInitials(t.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-[15px] sm:text-base text-slate-900 leading-tight">
                          {t.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 leading-snug mt-0.5">
                          {t.designation ? `${t.designation} · ` : ''}
                          {t.company}
                        </p>
                      </div>
                    </div>

                    {/* Green Verified Customer Check Badge */}
                    <div
                      className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 shadow-2xs"
                      title="Verified Institutional Customer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="hidden sm:inline">Verified</span>
                    </div>
                  </div>

                  {/* 5 Gold Stars */}
                  <div className="mb-2.5">
                    <Stars rating={t.rating} />
                  </div>

                  {/* Review Text: Bold, Crisp, High Contrast Font Weight */}
                  <p className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed tracking-normal">
                    &ldquo;{cleanReview}&rdquo;
                  </p>

                  {/* Purchased Product Tag */}
                  {t.productName && (
                    <div className="mt-3">
                      <span className="inline-block bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-200/90">
                        Purchased: {t.productName}
                      </span>
                    </div>
                  )}

                  {/* Customer Uploaded Photo (if present) */}
                  {t.image?.url && (
                    <div className="mt-3.5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs">
                      <img
                        src={t.image.url}
                        alt={`Product photo by ${t.name}`}
                        className="w-full h-auto max-h-60 object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Date & Verification Tag */}
                {t.createdAt && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{formatReviewDate(t.createdAt)}</span>
                    <span className="text-slate-400 text-[11px]">Vinayak Client</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
