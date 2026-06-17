'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiPost } from '@/lib/api';
import { PageHeader } from '@/components/website/page-header';
import { fadeUp, staggerContainer } from '@/components/website/motion';

export default function RequestQuotePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', companyName: '', product: '', quantity: 1, budget: '', requirements: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get('product');
    if (product) setForm((f) => ({ ...f, product }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost('/rfqs', form);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Request a Quote"
        subtitle="Get competitive B2B pricing for bulk orders"
        dark
      />

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border p-8 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="text-center py-8"
              >
                <motion.p
                  className="text-5xl mb-4"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  📋
                </motion.p>
                <h2 className="text-xl font-bold">Quote Request Submitted!</h2>
                <p className="text-slate-500 mt-2">Our sales team will send you a quote within 1–2 business days.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { key: 'name', label: 'Full Name *', type: 'text', required: true },
                    { key: 'companyName', label: 'Company Name *', type: 'text', required: true },
                    { key: 'email', label: 'Email *', type: 'email', required: true },
                    { key: 'phone', label: 'Phone', type: 'text', required: false },
                    { key: 'product', label: 'Product ID / Name', type: 'text', required: false, placeholder: 'Product name or SKU' },
                    { key: 'quantity', label: 'Quantity *', type: 'number', required: true, min: 1 },
                  ].map((field) => (
                    <motion.div key={field.key} variants={fadeUp} className={field.key === 'product' || field.key === 'quantity' ? '' : ''}>
                      <Label>{field.label}</Label>
                      <Input
                        required={field.required}
                        type={field.type}
                        min={field.min}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({
                          ...form,
                          [field.key]: field.type === 'number' ? +e.target.value : e.target.value,
                        })}
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}
                  <motion.div variants={fadeUp} className="sm:col-span-2">
                    <Label>Budget Range</Label>
                    <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. ₹50,000 - ₹1,00,000" />
                  </motion.div>
                </div>
                <motion.div variants={fadeUp}>
                  <Label>Requirements</Label>
                  <Textarea rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Customization, delivery timeline, etc." />
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Quote Request'}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
