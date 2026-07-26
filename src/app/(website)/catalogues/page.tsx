'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Download, ExternalLink, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import { fadeUp, staggerContainer } from '@/components/website/motion';
import { whatsappChatUrl } from '@/lib/site-contact';
import { useSiteContact } from '@/hooks/use-site-contact';

interface Catalogue {
  _id: string;
  title: string;
  description?: string;
  file: { url: string; filename?: string };
  downloadCount: number;
}

function isPdf(url: string) {
  return /\.pdf($|\?)/i.test(url);
}

const HIGHLIGHTS = [
  'CPR & Training Manikins',
  'Vilakshan Netra Microscopes',
  'Human Anatomy Models',
  'Skeleton & Lab Equipment',
];

export default function CataloguesPage() {
  const { site } = useSiteContact();
  const { data, isLoading } = useQuery({
    queryKey: ['catalogues-public'],
    queryFn: () => apiGet<{ catalogues: Catalogue[] }>('/catalogues'),
  });

  const catalogues = data?.catalogues || [];
  const primary = catalogues[0];

  return (
    <div className="bg-[#f7f5f2] min-h-screen">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#2a4a7a_0%,_#1a3a6b_50%,_#122845_100%)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container mx-auto px-4 py-14 md:py-16 relative z-10 text-white">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.p variants={fadeUp} className="text-orange-300 text-sm font-semibold uppercase tracking-wide mb-3">
              Product Brochure
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Download Our Catalogue
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-200 text-base md:text-lg leading-relaxed mb-6">
              Explore CPR manikins, microscopes, anatomy models, skeletons and laboratory equipment —
              manufactured and supplied from Ambala across India.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {primary && (
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <a href={primary.file.url} target="_blank" rel="noopener noreferrer">
                    {isPdf(primary.file.url) ? (
                      <><Download className="mr-2 h-4 w-4" /> Download Catalogue</>
                    ) : (
                      <><ExternalLink className="mr-2 h-4 w-4" /> View Catalogue</>
                    )}
                  </a>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 bg-transparent">
                <Link href="/request-quote">Request Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-5">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border h-48 animate-pulse" />
              ))
            ) : catalogues.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed px-6 py-16 text-center text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-700">Catalogues coming soon</p>
                <p className="text-sm mt-1">WhatsApp us for the latest product brochure.</p>
                <Button asChild className="mt-5 bg-green-600 hover:bg-green-700">
                  <a href={whatsappChatUrl(site.whatsapp)} target="_blank" rel="noopener noreferrer">
                    Request on WhatsApp
                  </a>
                </Button>
              </div>
            ) : (
              catalogues.map((cat, index) => {
                const pdf = isPdf(cat.file.url);
                return (
                  <motion.article
                    key={cat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="grid sm:grid-cols-[140px_1fr] gap-0">
                      <div className="bg-gradient-to-br from-[#1a3a6b] to-[#2a5080] p-6 flex flex-col items-center justify-center text-white min-h-[160px]">
                        <BookOpen className="h-10 w-10 mb-2 opacity-90" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                          {pdf ? 'PDF' : 'Online'}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{cat.title}</h2>
                          {cat.description && (
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xl">
                              {cat.description}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-3">
                            {pdf
                              ? `${cat.downloadCount} downloads`
                              : 'Interactive catalogue · opens in new tab'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button asChild className="bg-[#1a3a6b] hover:bg-[#15305a]">
                            <a href={cat.file.url} target="_blank" rel="noopener noreferrer">
                              {pdf ? (
                                <><Download className="mr-2 h-4 w-4" /> Download</>
                              ) : (
                                <><ExternalLink className="mr-2 h-4 w-4" /> View Catalogue</>
                              )}
                            </a>
                          </Button>
                          <Button asChild variant="outline">
                            <a href={whatsappChatUrl(site.whatsapp, `Namaste! Mujhe ${cat.title} chahiye. Please share details.`)} target="_blank" rel="noopener noreferrer">
                              Ask on WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>

          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">What&apos;s Inside</h3>
              <ul className="space-y-3">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#1a3a6b] text-white p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">Need a custom quote?</h3>
              <p className="text-sm text-blue-100 mb-5 leading-relaxed">
                Institutions, schools, colleges and hospitals — get factory-direct bulk pricing.
              </p>
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                <Link href="/request-quote">Get Quote</Link>
              </Button>
              <Button asChild variant="outline" className="w-full mt-2 border-white/40 text-white hover:bg-white/10 bg-transparent">
                <a href={whatsappChatUrl(site.whatsapp)} target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
