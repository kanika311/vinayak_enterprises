'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet } from '@/lib/api';

interface SEOEntry { _id: string; pagePath: string; metaTitle?: string; metaDescription?: string; canonicalUrl?: string; }

export default function SEOPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['seo'],
    queryFn: () => apiGet<SEOEntry[]>('/seo'),
  });

  return (
    <div>
      <PageHeader title="SEO Management" description="Meta tags, sitemap, robots.txt, Open Graph, schema markup" />
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader><CardTitle>Sitemap &amp; Robots</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Auto-generated sitemap and robots.txt from your content.</p>
            <div className="flex gap-2">
              <Button variant="outline" asChild><a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/v1/sitemap.xml`} target="_blank">View Sitemap</a></Button>
              <Button variant="outline" asChild><a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/v1/robots.txt`} target="_blank">View Robots.txt</a></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>SEO Features</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Meta Tags per page</li>
              <li>Canonical URLs</li>
              <li>Open Graph tags</li>
              <li>JSON-LD Schema Markup</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Page Path</TableHead><TableHead>Meta Title</TableHead><TableHead>Meta Description</TableHead><TableHead>Canonical</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell className="font-medium">{entry.pagePath}</TableCell>
                  <TableCell>{entry.metaTitle || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.metaDescription || '-'}</TableCell>
                  <TableCell>{entry.canonicalUrl || '-'}</TableCell>
                </TableRow>
              ))}
              {!data?.length && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No SEO entries yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
