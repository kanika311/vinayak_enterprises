'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { mapSettingsToSite, type SiteContact } from '@/lib/site-contact';

export function useSiteContact() {
  const { data, isLoading } = useQuery({
    queryKey: ['settings-public'],
    queryFn: () => apiGet<Record<string, string>>('/settings/public'),
    staleTime: 30_000,
  });

  const site: SiteContact = mapSettingsToSite(data);
  return { site, isLoading, settings: data };
}
