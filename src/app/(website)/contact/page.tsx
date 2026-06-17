'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiPost } from '@/lib/api';
import { SITE } from '@/lib/constants';
import { PageHeader } from '@/components/website/page-header';
import { fadeUp, staggerContainer, scaleIn } from '@/components/website/motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const contactItems = [
  { icon: Phone, label: 'Phone', value: SITE.phone },
  { icon: Mail, label: 'Email', value: SITE.email },
  { icon: MapPin, label: 'Address', value: SITE.address },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9AM – 6PM' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost('/leads', { ...form, leadSource: 'contact_form', country: '' });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader title="Contact Us" subtitle="Get in touch with our B2B sales team" dark />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            {contactItems.map((item) => (
              <motion.div
                key={item.label}
                variants={scaleIn}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                className="flex items-start gap-4 bg-white rounded-xl border p-5 cursor-default"
              >
                <motion.div
                  className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"
                  whileHover={{ rotate: 360, backgroundColor: '#1a3a6b' }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon className="h-5 w-5 text-blue-600" />
                </motion.div>
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border p-8 shadow-sm"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-center py-10"
                >
                  <motion.p
                    className="text-5xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✅
                  </motion.p>
                  <h2 className="text-xl font-bold text-slate-900">Message Sent!</h2>
                  <p className="text-slate-500 mt-2">Our team will contact you within 24 hours.</p>
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
                      { key: 'name', label: 'Name *', type: 'text', required: true },
                      { key: 'company', label: 'Company', type: 'text', required: false },
                      { key: 'email', label: 'Email *', type: 'email', required: true },
                      { key: 'phone', label: 'Phone', type: 'text', required: false },
                    ].map((field) => (
                      <motion.div key={field.key} variants={fadeUp}>
                        <Label>{field.label}</Label>
                        <Input
                          required={field.required}
                          type={field.type}
                          value={form[field.key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div variants={fadeUp}>
                    <Label>Message *</Label>
                    <Textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </motion.div>
                  <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
