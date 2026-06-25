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
import { ContactActions } from '@/components/website/contact-actions';
import { fadeUp, staggerContainer, scaleIn } from '@/components/website/motion';
import { Phone, Mail, MapPin, Clock, Building2 } from 'lucide-react';

type FormType = 'inquiry' | 'quote' | 'catalogue';

const contactItems = [
  { icon: Building2, label: 'Business Name', value: SITE.name },
  { icon: MapPin, label: 'Location', value: SITE.location },
  { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phoneTel}` },
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}` },
  { icon: Clock, label: 'Business Hours', value: SITE.workingHoursLong },
];

export default function ContactPage() {
  const [formType, setFormType] = useState<FormType>('inquiry');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (formType === 'quote') {
        await apiPost('/rfqs', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          companyName: form.company || 'Not specified',
          requirements: form.message,
          productName: form.message.slice(0, 120),
          quantity: 1,
        });
      } else {
        await apiPost('/leads', {
          ...form,
          leadSource: formType === 'catalogue' ? 'catalogue_download' : 'contact_form',
          productInterested: formType === 'catalogue' ? 'Catalogue Request' : undefined,
          country: 'India',
        });
      }
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Could not send your request. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const formTitles: Record<FormType, string> = {
    inquiry: 'General Inquiry',
    quote: 'Request Quotation',
    catalogue: 'Catalogue Request',
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader title="Contact Us" subtitle="Manufacturer · Bulk Supplier · Distributor — Ambala, Haryana" dark />

      <div className="container mx-auto px-4 py-8">
        <ContactActions className="mb-10 justify-center" />
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
            {contactItems.map((item) => (
              <motion.div
                key={item.label}
                variants={scaleIn}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                className="flex items-start gap-4 bg-white rounded-xl border p-5"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-slate-500 mt-0.5 hover:text-[#1a3a6b] break-all">{item.value}</a>
                  ) : (
                    <p className="text-sm text-slate-500 mt-0.5">{item.value}</p>
                  )}
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
            <div className="flex flex-wrap gap-2 mb-6">
              {(['inquiry', 'quote', 'catalogue'] as FormType[]).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={formType === type ? 'default' : 'outline'}
                  className={formType === type ? 'bg-[#1a3a6b]' : ''}
                  onClick={() => { setFormType(type); setSent(false); setError(''); }}
                >
                  {formTitles[type]}
                </Button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <p className="text-5xl mb-4">✅</p>
                  <h2 className="text-xl font-bold text-slate-900">Request Submitted!</h2>
                  <p className="text-slate-500 mt-2">Our team will contact you at {SITE.phone} or {SITE.email} shortly.</p>
                </motion.div>
              ) : (
                <motion.form key={formType} onSubmit={handleSubmit} className="space-y-5" initial="hidden" animate="visible" variants={staggerContainer}>
                  {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                  <motion.p variants={fadeUp} className="text-sm text-slate-500">
                    {formType === 'inquiry' && 'Send us a general enquiry about products or institutional supply.'}
                    {formType === 'quote' && 'Request a competitive quotation for bulk or institutional orders.'}
                    {formType === 'catalogue' && 'Request our latest product catalogue and price list.'}
                  </motion.p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { key: 'name', label: 'Name *', type: 'text', required: true },
                      { key: 'company', label: 'Institution / Company', type: 'text', required: false },
                      { key: 'email', label: 'Email *', type: 'email', required: true },
                      { key: 'phone', label: 'Phone *', type: 'tel', required: true },
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
                    <Textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={
                      formType === 'catalogue' ? 'Mention product categories you are interested in...' : 'Describe your requirements...'
                    } />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
                      {loading ? 'Sending...' : `Submit ${formTitles[formType]}`}
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
