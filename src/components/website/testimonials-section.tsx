'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { Carousel } from '@/components/website/carousel';
import { Button } from '@/components/ui/button';
import { staggerContainer, fadeUp } from '@/components/website/motion';

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  designation?: string;
  productName?: string;
  review: string;
  rating: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: () => apiGet<Testimonial[]>('/testimonials'),
  });

  const list = testimonials || [];

  return (
    <section id="testimonials" className="py-12 bg-[#f7f5f2] overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <motion.p variants={fadeUp} className="text-orange-600 font-semibold text-sm uppercase tracking-wide mb-1">
              Client Feedback
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              What Our Customers Say
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 text-sm mt-1">
              Reviews from schools, colleges, hospitals &amp; laboratories we supply.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 shrink-0 font-semibold">
              <Link href="/share-experience">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Share Your Experience
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {list.length > 0 ? (
          <Carousel itemClassName="w-[85%] sm:w-[48%] lg:w-[32%]">
            {list.map((t) => (
              <div
                key={t._id}
                className="h-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <Quote className="h-8 w-8 text-orange-200 mb-2" />
                <Stars rating={t.rating} />
                <p className="text-slate-700 leading-relaxed mt-3 flex-1">&ldquo;{t.review}&rdquo;</p>
                {t.productName && (
                  <p className="text-xs text-[#1a3a6b] mt-3">
                    On: <span className="font-medium">{t.productName}</span>
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">
                    {t.designation ? `${t.designation}, ` : ''}
                    {t.company}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Quote className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-600">Be the first to share your experience with our products!</p>
            <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600 font-semibold">
              <Link href="/share-experience">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Write a Review
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
