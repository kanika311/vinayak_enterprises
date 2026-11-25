'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiPost } from '@/lib/api';
import { ContactActions } from '@/components/website/contact-actions';
import { fadeUp, staggerContainer, scaleIn } from '@/components/website/motion';
import { Phone, Mail, MapPin, Clock, Building2, Facebook, Instagram, MessageCircle, FileCheck } from 'lucide-react';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

type FormType = 'inquiry' | 'quote' | 'catalogue';

export function ContactClient() {
  const { site } = useSiteContact();
  const [formType, setFormType] = useState<FormType>('inquiry');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const contactItems = [
    { icon: Building2, label: 'Business Name', value: site.name },
    { icon: FileCheck, label: 'GST Identification (GSTIN)', value: '06AHLPA7723L1Z7 (Registered Manufacturer)' },
    { icon: MapPin, label: 'Factory & Registered Office', value: 'Ambala Cantt, Ambala, Haryana 133001, India' },
    {
      icon: Phone,
      label: site.phones.length > 1 ? 'Primary Contact Phone' : 'Phone',
      value: site.phone,
      href: `tel:${site.phoneTel}`,
    },
    ...(site.phoneSecondary
      ? [
          {
            icon: Phone,
            label: 'Secondary Contact Phone',
            value: site.phoneSecondary,
            href: `tel:${site.phoneSecondaryTel}`,
          },
        ]
      : []),
    {
      icon: Mail,
      label: 'Email Desk',
      value: site.email,
      href: `mailto:${site.email}?subject=${encodeURIComponent('Enquiry - Vinayak Enterprises')}`,
    },
    { icon: Clock, label: 'Business Hours', value: site.workingHoursLong },
  ];

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
    <div className="bg-slate-50 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1a3a6b] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-orange-600 font-semibold">Contact Us</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* 1. Form Section (Appears directly at the TOP on mobile & desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="order-1 lg:order-2 lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm"
          >
            {/* Form Top Header */}
            <div className="mb-6">
           
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3a6b] tracking-tight">
                Send an Inquiry or Request a Quotation
              </h1>
             
            </div>

            {/* Form Type Tabs */}
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
                  <p className="text-slate-500 mt-2">Our team will contact you at {site.phone} or {site.email} shortly.</p>
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
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 font-bold px-8" disabled={loading}>
                      {loading ? 'Sending...' : `Submit ${formTitles[formType]}`}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 2. Direct Contact Information & Quick Actions (Sidebar on desktop, below form on mobile) */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="order-2 lg:order-1 lg:col-span-1 space-y-4">
            {/* Quick Action Buttons */}
            <div className="bg-white rounded-xl border p-4 shadow-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Connect</p>
              <ContactActions className="gap-2.5" />
            </div>

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

            {/* Social Media & Instant Connect */}
            {(site.facebook || site.instagram || site.whatsapp) && (
              <motion.div
                variants={scaleIn}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-xl border p-5"
              >
                <p className="font-medium text-slate-900 mb-1">Follow &amp; Connect Online</p>
                <p className="text-xs text-slate-500 mb-3.5">
                  Follow our official channels for product releases, equipment updates and institutional support:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {site.facebook && (
                    <a
                      href={site.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-[#1877F2] hover:bg-[#1877F2] hover:text-white text-xs font-semibold transition-all border border-blue-200 shadow-sm"
                    >
                      <Facebook className="w-3.5 h-3.5" /> Facebook Page
                    </a>
                  )}
                  {site.instagram && (
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-50 text-[#E4405F] hover:bg-[#E4405F] hover:text-white text-xs font-semibold transition-all border border-pink-200 shadow-sm"
                    >
                      <Instagram className="w-3.5 h-3.5" /> Instagram
                    </a>
                  )}
                  <a
                    href={whatsappChatUrl(site.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-semibold transition-all border border-emerald-200 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Desk
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
