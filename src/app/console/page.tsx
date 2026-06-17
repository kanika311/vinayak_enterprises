'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_BASE } from '@/lib/constants';

export default function ConsoleRootPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    router.replace(token ? `${ADMIN_BASE}/dashboard` : `${ADMIN_BASE}/login`);
  }, [router]);
  return null;
}
