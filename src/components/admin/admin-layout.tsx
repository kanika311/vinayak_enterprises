'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { apiGet } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';
import { AdminSidebar } from '@/components/admin/sidebar';
import { LoadingSpinner } from '@/components/admin/loading';
import type { Admin } from '@/types';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace(`${ADMIN_BASE}/login`);
        return;
      }
      try {
        const admin = await apiGet<Admin>('/auth/me');
        dispatch(setCredentials({ admin, token }));
        setReady(true);
      } catch {
        localStorage.removeItem('token');
        router.replace(`${ADMIN_BASE}/login`);
      }
    };
    init();
  }, [dispatch, router]);

  if (!ready) return <div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
