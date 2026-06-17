'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiGet, apiPut } from '@/lib/api';

const CMS_PAGES = [
  { slug: 'homepage', title: 'Homepage' },
  { slug: 'about-us', title: 'About Us' },
  { slug: 'why-choose-us', title: 'Why Choose Us' },
  { slug: 'faq', title: 'FAQ' },
  { slug: 'contact', title: 'Contact Page' },
  { slug: 'footer', title: 'Footer' },
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'terms', title: 'Terms & Conditions' },
];

interface PageData { _id?: string; slug: string; title: string; sections: { key: string; title?: string; content: unknown }[]; }

export default function PagesCMSPage() {
  const [selected, setSelected] = useState('homepage');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['page', selected],
    queryFn: async () => {
      try {
        const page = await apiGet<PageData>(`/pages/${selected}`);
        setContent(JSON.stringify(page.sections, null, 2));
        return page;
      } catch {
        setContent('[]');
        return null;
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => apiPut(`/pages/${selected}`, {
      title: CMS_PAGES.find((p) => p.slug === selected)?.title,
      sections: JSON.parse(content),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['page', selected] }),
  });

  return (
    <div>
      <PageHeader title="Website Content CMS" description="Manage pages without code changes" />
      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Pages</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {CMS_PAGES.map((page) => (
              <Button key={page.slug} variant={selected === page.slug ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => setSelected(page.slug)}>
                {page.title}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>{CMS_PAGES.find((p) => p.slug === selected)?.title} Content</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <LoadingSpinner /> : (
              <>
                <textarea
                  className="w-full h-96 rounded-md border p-4 font-mono text-sm"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='[{"key":"hero","title":"Hero Section","content":{"heading":"...","subheading":"..."}}]'
                />
                <Button className="mt-4" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
