'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Star, ArrowLeft, UploadCloud, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    company: '',
    designation: '',
    productName: '',
    review: '',
    rating: 5,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB.');
      return;
    }

    setError('');
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('company', form.company.trim());
      if (form.designation.trim()) fd.append('designation', form.designation.trim());
      if (form.productName.trim()) fd.append('productName', form.productName.trim());
      fd.append('review', form.review.trim());
      fd.append('rating', String(form.rating));
      if (photo) {
        fd.append('photo', photo);
      }

      return apiPost('/testimonials/submit', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => setSent(true),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Could not submit your review. Please try again.');
    },
  });

  return (
    <div className="bg-[#f7f5f2] min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Top Back Link */}
        <div className="mb-4">
          <Link
            href="/#testimonials"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#1a3a6b] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to reviews
          </Link>
        </div>

        {/* Form Card Directly at Top */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6 border-b border-slate-100 pb-5">
            <span className="inline-block bg-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
              Customer Feedback
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b] tracking-tight">
              Share Your Experience
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tell us about our scientific equipment and models. Your review and photo will appear on the homepage after approval.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Thank You!</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-md mx-auto">
                Your review has been submitted successfully and will appear on the website once our team approves it.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Button className="bg-[#1a3a6b] hover:bg-[#15305a]" onClick={() => router.push('/')}>
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    removePhoto();
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
                <Label className="text-slate-700 font-semibold">Your Rating</Label>
                <div className="mt-2">
                  <Stars rating={form.rating} onRate={(n) => setForm({ ...form, rating: n })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 font-semibold">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">
                    Company / Institution <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. AIIMS / City Public School"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">Designation</Label>
                  <Input
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Lab Incharge / HOD Anatomy"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">Product Purchased</Label>
                  <Input
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    placeholder="e.g. Human Torso Model / Vilakshan Netra"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700 font-semibold">
                  Your Review <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  required
                  rows={4}
                  value={form.review}
                  onChange={(e) => setForm({ ...form, review: e.target.value })}
                  placeholder="Tell us about the accuracy, build quality, and delivery experience of our products..."
                  className="mt-1.5"
                />
              </div>

              {/* PHOTO UPLOAD FIELD */}
              <div>
                <Label className="text-slate-700 font-semibold block mb-1.5">
                  Upload Photo of Product / Lab Setup <span className="text-slate-400 font-normal">(Optional)</span>
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="testimonial-photo-input"
                />

                {!photoPreview ? (
                  <label
                    htmlFor="testimonial-photo-input"
                    className="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50/60 hover:bg-orange-50/30 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-orange-600 transition-colors mb-2">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-orange-600">
                      Click to upload lab or product photo
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      JPG, PNG, WebP up to 10MB
                    </span>
                  </label>
                ) : (
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="h-16 w-16 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {photo?.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {photo ? `${(photo.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                        </p>
                        <span className="inline-flex items-center text-[10px] text-green-700 font-semibold mt-0.5">
                          ✓ Photo ready to upload
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 font-bold tracking-wide uppercase text-sm shadow-md"
                disabled={
                  mutation.isPending || !form.name.trim() || !form.company.trim() || !form.review.trim()
                }
              >
                {mutation.isPending ? 'Submitting Review...' : 'Submit Review'}
              </Button>
              <p className="text-xs text-slate-400 text-center">
                Your review and photo will be published after verification.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
