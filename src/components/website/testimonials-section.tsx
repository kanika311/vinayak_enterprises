'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Star, Quote, X, MessageSquarePlus } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { Carousel } from '@/components/website/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

function Stars({ rating, onRate }: { rating: number; onRate?: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type={onRate ? 'button' : undefined}
          onClick={onRate ? () => onRate(i + 1) : undefined}
          className={onRate ? 'cursor-pointer' : 'cursor-default'}
          disabled={!onRate}
          aria-label={`${i + 1} star`}
        >
          <Star className={`h-5 w-5 transition-colors ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', company: '', designation: '', productName: '', review: '', rating: 5 });

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: () => apiGet<Testimonial[]>('/testimonials'),
  });

  const mutation = useMutation({
    mutationFn: () => apiPost('/testimonials/submit', form),
    onSuccess: () => setSent(true),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Could not submit your review. Please try again.');
    },
  });

  const list = testimonials || [];

  const resetAndClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setError('');
      setForm({ name: '', company: '', designation: '', productName: '', review: '', rating: 5 });
    }, 300);
  };

  return (
    <section className="py-10 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
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
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">
              What Our Customers Say
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-sm mt-1">
              Reviews from schools, colleges, hospitals &amp; laboratories we supply.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Button onClick={() => setOpen(true)} className="bg-orange-500 hover:bg-orange-600 shrink-0">
              <MessageSquarePlus className="mr-2 h-4 w-4" /> Share Your Experience
            </Button>
          </motion.div>
        </motion.div>

        {list.length > 0 ? (
          <Carousel itemClassName="w-[85%] sm:w-[48%] lg:w-[32%]">
            {list.map((t) => (
              <div key={t._id} className="h-full bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <Quote className="h-8 w-8 text-blue-100 mb-2" />
                <Stars rating={t.rating} />
                <p className="text-slate-700 leading-relaxed mt-3 flex-1">&ldquo;{t.review}&rdquo;</p>
                {t.productName && (
                  <p className="text-xs text-blue-600 mt-3">On: <span className="font-medium">{t.productName}</span></p>
                )}
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.designation ? `${t.designation}, ` : ''}{t.company}</p>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white px-6 py-12 text-center">
            <Quote className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">Be the first to share your experience with our products!</p>
            <Button onClick={() => setOpen(true)} className="mt-4 bg-orange-500 hover:bg-orange-600">
              <MessageSquarePlus className="mr-2 h-4 w-4" /> Write a Review
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-5">
                <h3 className="text-lg font-bold text-[#1a3a6b]">Share Your Experience</h3>
                <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-700" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {sent ? (
                <div className="p-10 text-center">
                  <p className="text-5xl mb-3">🙏</p>
                  <h4 className="text-xl font-bold text-slate-900">Thank You!</h4>
                  <p className="text-slate-500 mt-2">Your review has been submitted and will appear once approved by our team.</p>
                  <Button className="mt-6 bg-[#1a3a6b]" onClick={resetAndClose}>Close</Button>
                </div>
              ) : (
                <form
                  className="p-5 space-y-4"
                  onSubmit={(e) => { e.preventDefault(); setError(''); mutation.mutate(); }}
                >
                  {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

                  <div>
                    <Label>Your Rating</Label>
                    <div className="mt-1"><Stars rating={form.rating} onRate={(n) => setForm({ ...form, rating: n })} /></div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div><Label>Company / Institution *</Label><Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
                    <div><Label>Designation</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Lab Incharge" /></div>
                    <div><Label>Product Purchased</Label><Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="e.g. Human Torso Model" /></div>
                  </div>

                  <div>
                    <Label>Your Review *</Label>
                    <Textarea required rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} placeholder="Tell us about your experience with our products and service..." />
                  </div>

                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <p className="text-xs text-slate-400 text-center">Your review will be published after approval.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
