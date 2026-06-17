'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Users, FileText, BookOpen,
  Search, MessageSquare, Building2, Mail, Image, FileCode, BarChart3,
  Settings, LogOut, Menu, X, ClipboardList, Star, Download,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { ADMIN_BASE } from '@/lib/constants';

const navItems = [
  { href: `${ADMIN_BASE}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
  { href: `${ADMIN_BASE}/products`, label: 'Products', icon: Package },
  { href: `${ADMIN_BASE}/categories`, label: 'Categories', icon: FolderTree },
  { href: `${ADMIN_BASE}/leads`, label: 'Leads', icon: Users },
  { href: `${ADMIN_BASE}/rfqs`, label: 'RFQ Requests', icon: ClipboardList },
  { href: `${ADMIN_BASE}/catalogues`, label: 'Catalogues', icon: Download },
  { href: `${ADMIN_BASE}/blogs`, label: 'Blogs', icon: BookOpen },
  { href: `${ADMIN_BASE}/seo`, label: 'SEO', icon: Search },
  { href: `${ADMIN_BASE}/testimonials`, label: 'Testimonials', icon: Star },
  { href: `${ADMIN_BASE}/customers`, label: 'Customers', icon: Building2 },
  { href: `${ADMIN_BASE}/inquiries`, label: 'Inquiries', icon: MessageSquare },
  { href: `${ADMIN_BASE}/newsletter`, label: 'Newsletter', icon: Mail },
  { href: `${ADMIN_BASE}/media`, label: 'Media Library', icon: Image },
  { href: `${ADMIN_BASE}/pages`, label: 'Website CMS', icon: FileCode },
  { href: `${ADMIN_BASE}/analytics`, label: 'Analytics', icon: BarChart3 },
  { href: `${ADMIN_BASE}/settings`, label: 'Settings', icon: Settings },
  { href: `${ADMIN_BASE}/users`, label: 'Role Management', icon: FileText },
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

  const NavContent = () => (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <MicroscopeIcon className="h-8 w-8 text-primary" />
        <div className="ml-3">
          <p className="text-sm font-bold leading-tight">Scientific Instruments</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
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

function MicroscopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 18h8M4 22h16M14 9a3 3 0 1 0-6 0M9 9V2M15 9l3-3M18 6l2 2" />
      <circle cx="9" cy="14" r="4" />
    </svg>
  );
}
