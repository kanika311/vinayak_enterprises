'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/admin/loading';
import { apiGet, apiPut } from '@/lib/api';

export default function SettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiGet<Record<string, string>>('/settings'),
  });

  useEffect(() => {
    if (data) setForm(data as Record<string, string>);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => apiPut('/settings', form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
      await queryClient.invalidateQueries({ queryKey: ['settings-public'] });
      setMessage('Saved — contact details will update on the website.');
      setTimeout(() => setMessage(''), 4000);
    },
    onError: () => setMessage('Failed to save settings. Try again.'),
  });

  if (isLoading) return <LoadingSpinner />;

  const fields = [
    { key: 'companyName', label: 'Company Name', group: 'Company' },
    { key: 'companyEmail', label: 'Company Email (Gmail)', group: 'Company' },
    { key: 'companyPhone', label: 'Company Phone', group: 'Company' },
    { key: 'companyAddress', label: 'Company Address', group: 'Company' },
    { key: 'workingHours', label: 'Working Hours (short)', group: 'Company' },
    { key: 'whatsappNumber', label: 'WhatsApp Number', group: 'Social' },
    { key: 'facebook', label: 'Facebook URL', group: 'Social' },
    { key: 'linkedin', label: 'LinkedIn URL', group: 'Social' },
    { key: 'googleAnalyticsId', label: 'Google Analytics ID', group: 'Analytics' },
    { key: 'googleSearchConsole', label: 'Google Search Console', group: 'Analytics' },
  ];

  const groups = [...new Set(fields.map((f) => f.group))];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="These details show on header, footer, contact page and WhatsApp button"
        action={
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        }
      />

      {message && (
        <p className={`mb-4 text-sm ${message.startsWith('Saved') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group) => (
          <Card key={group}>
            <CardHeader><CardTitle>{group}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {fields.filter((f) => f.group === group).map((field) => (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  <Input
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={
                      field.key === 'companyEmail'
                        ? 'you@gmail.com'
                        : field.key === 'companyPhone' || field.key === 'whatsappNumber'
                          ? '9416029492'
                          : undefined
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
        <p className="text-xs text-slate-500">After saving, refresh the website to see updates.</p>
      </div>
    </div>
  );
}
