'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/admin/loading';
import { apiGet, apiPut } from '@/lib/api';

export default function SettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiGet<Record<string, string>>('/settings'),
  });

  useEffect(() => {
    if (data) setForm(data as Record<string, string>);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => apiPut('/settings', form),
  });

  if (isLoading) return <LoadingSpinner />;

  const fields = [
    { key: 'companyName', label: 'Company Name', group: 'Company' },
    { key: 'companyEmail', label: 'Company Email', group: 'Company' },
    { key: 'companyPhone', label: 'Company Phone', group: 'Company' },
    { key: 'companyAddress', label: 'Company Address', group: 'Company' },
    { key: 'whatsappNumber', label: 'WhatsApp Number', group: 'Social' },
    { key: 'facebook', label: 'Facebook URL', group: 'Social' },
    { key: 'linkedin', label: 'LinkedIn URL', group: 'Social' },
    { key: 'googleAnalyticsId', label: 'Google Analytics ID', group: 'Analytics' },
    { key: 'googleSearchConsole', label: 'Google Search Console', group: 'Analytics' },
  ];

  const groups = [...new Set(fields.map((f) => f.group))];

  return (
    <div>
      <PageHeader title="Settings" description="Company details, email, social media, analytics" />
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group) => (
          <Card key={group}>
            <CardHeader><CardTitle>{group}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {fields.filter((f) => f.group === group).map((field) => (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  <Input value={form[field.key] || ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-6" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
}
