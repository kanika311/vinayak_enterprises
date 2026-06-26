'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Users, BookOpen,
  Settings, LogOut, Menu, X, ClipboardList, Plus, Star,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { ADMIN_BASE, SITE } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';

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
      { href: `${ADMIN_BASE}/products`, label: 'All Products', icon: Package, description: 'Manage product catalogue' },
      { href: `${ADMIN_BASE}/products/new`, label: 'Add Product', icon: Plus, description: 'Create a new product' },
      { href: `${ADMIN_BASE}/categories`, label: 'Categories', icon: FolderTree, description: 'Product categories' },
    ],
  },
  {
    title: 'Blogs',
    items: [
      { href: `${ADMIN_BASE}/blogs`, label: 'All Blogs', icon: BookOpen, description: 'Manage blog posts' },
      { href: `${ADMIN_BASE}/blogs/new`, label: 'Add Blog', icon: Plus, description: 'Write a new blog post' },
    ],
  },
  {
    title: 'Content',
    items: [
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

  const isActive = (href: string) => {
    if (href === `${ADMIN_BASE}/products` || href === `${ADMIN_BASE}/blogs`) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const NavContent = () => (
    <>
      <div className="flex h-16 items-center border-b px-6 bg-[#1a3a6b]">
        <div className="h-9 w-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
          {SITE.shortName}
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
                    <span>{item.label}</span>
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
