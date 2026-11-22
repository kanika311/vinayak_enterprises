'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Star, ArrowLeft } from 'lucide-react';
import { apiPost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function Stars({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onRate(i + 1)}
          className="cursor-pointer hover:scale-110 transition-transform"
          aria-label={`${i + 1} star`}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ShareExperienceClient() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    designation: '',
    productName: '',
    review: '',
    rating: 5,
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiPost('/testimonials/submit', {
        name: form.name.trim(),
        company: form.company.trim(),
        designation: form.designation.trim() || undefined,
        productName: form.productName.trim() || undefined,
        review: form.review.trim(),
        rating: form.rating,
      }),
    onSuccess: () => setSent(true),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Could not submit your review. Please try again.');
    },
  });

  return (
    <div className="bg-[#f7f5f2] min-h-screen">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <Link
            href="/#testimonials"
            className="inline-flex items-center text-sm text-slate-500 hover:text-[#1a3a6b] mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to reviews
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-slate-600 mt-2 max-w-xl">
            Tell us about our products and service. Your review will appear on the website after approval.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {sent ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">🙏</p>
              <h2 className="text-2xl font-bold text-slate-900">Thank You!</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-md mx-auto">
                Your review has been submitted and will appear on the website once our team approves it.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Button className="bg-[#1a3a6b] hover:bg-[#15305a]" onClick={() => router.push('/')}>
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: '',
                      company: '',
                      designation: '',
                      productName: '',
                      review: '',
                      rating: 5,
                    });
                  }}
                >
                  Submit Another
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setError('');
                mutation.mutate();
              }}
            >
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
              )}

              <div>
                <Label className="text-slate-700">Your Rating</Label>
                <div className="mt-2">
                  <Stars rating={form.rating} onRate={(n) => setForm({ ...form, rating: n })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">
                    Company / Institution <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Designation</Label>
                  <Input
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Lab Incharge"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Product Purchased</Label>
                  <Input
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    placeholder="e.g. Human Torso Model"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700">
                  Your Review <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  required
                  rows={5}
                  value={form.review}
                  onChange={(e) => setForm({ ...form, review: e.target.value })}
                  placeholder="Tell us about your experience with our products and service..."
                  className="mt-1.5"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 font-bold tracking-wide uppercase text-sm"
                disabled={
                  mutation.isPending || !form.name.trim() || !form.company.trim() || !form.review.trim()
                }
              >
                {mutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
              <p className="text-xs text-slate-400 text-center">
                Your review will be published after approval.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
