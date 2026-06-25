'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Package, Users, ClipboardList, Eye, TrendingUp, BookOpen, Download,
  Monitor, Smartphone, Tablet, Plus,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { LoadingSpinner } from '@/components/admin/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiGet } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { DashboardData } from '@/types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatChartData(data: { _id: { year: number; month: number }; count: number }[]) {
  return data.map((d) => ({
    name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
    count: d.count,
  }));
}

const quickActions = [
  { href: `${ADMIN_BASE}/products/new`, label: 'Add Product', icon: Package },
  { href: `${ADMIN_BASE}/blogs/new`, label: 'New Blog Post', icon: BookOpen },
  { href: `${ADMIN_BASE}/categories`, label: 'Manage Categories', icon: Plus },
  { href: `${ADMIN_BASE}/leads`, label: 'Contact Forms', icon: Users },
  { href: `${ADMIN_BASE}/rfqs`, label: 'Quote Requests', icon: ClipboardList },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiGet<DashboardData>('/dashboard'),
    refetchOnMount: 'always',
  });

  if (isLoading) return <LoadingSpinner />;

  const stats = data?.stats;
  const charts = data?.charts;

  return (
    <div>
      <PageHeader title="Dashboard" description="Vinayak Enterprises — Admin Console" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} href={`${ADMIN_BASE}/products`} />
        <StatCard title="Contact Forms" value={stats?.totalLeads || 0} icon={Users} href={`${ADMIN_BASE}/leads`} />
        <StatCard title="Quote Requests" value={stats?.totalRFQs || 0} icon={ClipboardList} href={`${ADMIN_BASE}/rfqs`} />
        <StatCard title="Total Visitors" value={stats?.totalVisitors || 0} icon={Eye} href={`${ADMIN_BASE}/analytics`} />
        <StatCard title="Monthly Leads" value={stats?.monthlyLeads || 0} icon={TrendingUp} trend="This month" href={`${ADMIN_BASE}/leads`} />
        <StatCard title="Blog Views" value={stats?.blogViews || 0} icon={BookOpen} href={`${ADMIN_BASE}/blogs`} />
        <StatCard title="Catalogue Downloads" value={stats?.catalogueDownloads || 0} icon={Download} href={`${ADMIN_BASE}/catalogues`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.href} variant="outline" className="w-full justify-start" asChild>
                  <Link href={action.href}><Icon className="mr-2 h-4 w-4" />{action.label}</Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Products</CardTitle>
            <Link href={`${ADMIN_BASE}/products`} className="text-xs text-blue-600 hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.recentProducts || []).map((p) => (
                <Link key={p._id} href={`${ADMIN_BASE}/products/${p._id}`} className="flex items-center justify-between text-sm hover:bg-slate-50 -mx-2 px-2 py-1.5 rounded-md">
                  <span className="font-medium truncate mr-2">{p.name}</span>
                  <Badge variant={p.status === 'published' ? 'success' : 'secondary'} className="shrink-0">{p.status}</Badge>
                </Link>
              ))}
              {!data?.recentProducts?.length && <p className="text-sm text-muted-foreground">No products yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Blogs</CardTitle>
            <Link href={`${ADMIN_BASE}/blogs`} className="text-xs text-blue-600 hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.recentBlogs || []).map((b) => (
                <Link key={b._id} href={`${ADMIN_BASE}/blogs/${b._id}`} className="block text-sm hover:bg-slate-50 -mx-2 px-2 py-1.5 rounded-md">
                  <p className="font-medium truncate">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.status} · {formatDate(b.createdAt)}</p>
                </Link>
              ))}
              {!data?.recentBlogs?.length && <p className="text-sm text-muted-foreground">No blog posts yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader><CardTitle>Leads Per Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formatChartData(charts?.leadsPerMonth || [])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1a3a6b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Traffic Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formatChartData(charts?.trafficOverview || [])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Enquiry Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formatChartData(charts?.enquiryTrends || [])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Visitor Devices</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={(charts?.visitorDevices || []).map((d) => ({ name: d._id || 'unknown', value: d.count }))}
                  cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(charts?.visitorDevices || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> Desktop</span>
              <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Mobile</span>
              <span className="flex items-center gap-1"><Tablet className="h-3 w-3" /> Tablet</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Performing Products</CardTitle>
          <Link href={`${ADMIN_BASE}/products`} className="text-sm text-blue-600 hover:underline">Manage products</Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Enquiries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.topProducts || []).map((p) => (
                <TableRow key={p._id} className="cursor-pointer hover:bg-slate-50" onClick={() => window.location.href = `${ADMIN_BASE}/products/${p._id}`}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.views}</TableCell>
                  <TableCell>{p.enquiryCount}</TableCell>
                </TableRow>
              ))}
              {!data?.topProducts?.length && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No products yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
