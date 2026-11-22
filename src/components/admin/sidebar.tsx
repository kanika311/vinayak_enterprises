'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Users, BookOpen,
  Settings, LogOut, Menu, X, ClipboardList, Star, Video, PlaySquare,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { ADMIN_BASE, SITE } from '@/lib/constants';
import { apiGet } from '@/lib/api';
import type { LucideIcon } from 'lucide-react';
import type { DashboardNotificationsData } from '@/types';

type NavItem = { href: string; label: string; icon: LucideIcon; description: string };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [{ href: `${ADMIN_BASE}/dashboard`, label: 'Dashboard', icon: LayoutDashboard, description: 'Overview, stats & quick actions' }],
  },
  {
    title: 'Products',
    items: [
      { href: `${ADMIN_BASE}/products`, label: 'Products', icon: Package, description: 'Manage product catalogue' },
      { href: `${ADMIN_BASE}/categories`, label: 'Categories', icon: FolderTree, description: 'Product categories' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: `${ADMIN_BASE}/blogs`, label: 'Blogs', icon: BookOpen, description: 'Manage blog posts' },
      { href: `${ADMIN_BASE}/banners`, label: 'Banner Videos', icon: Video, description: 'Homepage hero looping background videos' },
      { href: `${ADMIN_BASE}/videos`, label: 'Showcase Videos', icon: PlaySquare, description: 'Product demos & laboratory walkthroughs' },
      { href: `${ADMIN_BASE}/testimonials`, label: 'Testimonials', icon: Star, description: 'Approve client reviews' },
    ],
  },
  {
    title: 'Website Forms',
    items: [
      { href: `${ADMIN_BASE}/leads`, label: 'Contact Forms', icon: Users, description: 'Contact page → General Inquiry & Catalogue Request' },
      { href: `${ADMIN_BASE}/rfqs`, label: 'Quote Requests', icon: ClipboardList, description: 'Get Quote page & Contact page → Request Quotation' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: `${ADMIN_BASE}/settings`, label: 'Settings', icon: Settings, description: 'Site & company settings' },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.auth.admin);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push(`${ADMIN_BASE}/login`);
  };

  const isActive = (href: string) =>
    pathname === href || !!pathname?.startsWith(`${href}/`);

  const { data: notifData } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => apiGet<DashboardNotificationsData>('/dashboard/notifications'),
    refetchInterval: 20_000,
  });

  const getBadge = (href: string) => {
    if (href.endsWith('/leads') && (notifData?.counts?.newLeads || 0) > 0) {
      return { count: notifData!.counts.newLeads, bg: 'bg-emerald-600' };
    }
    if (href.endsWith('/rfqs') && (notifData?.counts?.pendingRFQs || 0) > 0) {
      return { count: notifData!.counts.pendingRFQs, bg: 'bg-blue-600' };
    }
    if (href.endsWith('/testimonials') && (notifData?.counts?.pendingTestimonials || 0) > 0) {
      return { count: notifData!.counts.pendingTestimonials, bg: 'bg-amber-600' };
    }
    return null;
  };


  const NavContent = () => (
    <>
      <div className="flex h-16 items-center border-b px-5 bg-[#1a3a6b]">
        <div className="w-10 h-8 relative shrink-0">
          <svg viewBox="0 0 210 160" aria-hidden="true" className="w-full h-full">
            <polygon fill="#ffffff" points="0,20 44,20 70,118 96,30 118,30 84,150 56,150" />
            <rect fill="#ffffff" x="118" y="20" width="84" height="14" />
            <rect fill="#ffffff" x="118" y="88" width="84" height="14" />
            <rect fill="#ffffff" x="84" y="134" width="118" height="16" />
            <g transform="rotate(12, 150, 128)">
              <path d="M158 26 C186 44 186 104 150 122" fill="none" stroke="#1a3a6b" strokeWidth={12} strokeLinecap="round" />
              <path d="M158 26 C186 44 186 104 150 122" fill="none" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
              <path d="M122 124 Q150 146 178 124" fill="none" stroke="#1a3a6b" strokeWidth={11} strokeLinecap="round" />
              <path d="M122 124 Q150 146 178 124" fill="none" stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />
              <rect fill="#ffffff" stroke="#1a3a6b" strokeWidth={2} x="138" y="74" width="24" height="6" rx="2" />
              <rect fill="#ffffff" stroke="#1a3a6b" strokeWidth={2} x="145" y="64" width="10" height="12" rx="2" />
              <rect fill="#ffffff" stroke="#1a3a6b" strokeWidth={2} x="139" y="14" width="18" height="52" rx="4" />
              <rect fill="#ffffff" stroke="#1a3a6b" strokeWidth={2} x="143" y="4" width="10" height="12" rx="2" />
              <circle cx="148" cy="40" r="5.5" fill="#f26b21" />
            </g>
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold leading-tight text-white">{SITE.name}</p>
          <p className="text-xs text-blue-200">Admin Console</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const badge = getBadge(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    title={item.description}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[#1a3a6b] text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-orange-50 hover:text-[#1a3a6b]'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge && (
                      <span className={cn('text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full leading-none shrink-0', badge.bg)}>
                        {badge.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t p-4 bg-slate-50">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{admin?.name || 'Admin'}</p>
          <p className="text-xs text-muted-foreground capitalize">{admin?.role?.replace('_', ' ')}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Button variant="outline" size="icon" className="fixed left-4 top-4 z-50 lg:hidden" onClick={() => setOpen(!open)}>
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <NavContent />
      </aside>
    </>
  );
}
