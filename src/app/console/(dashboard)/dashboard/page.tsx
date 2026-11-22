'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Package, Users, ClipboardList, Eye, TrendingUp, BookOpen, Download,
  Monitor, Smartphone, Tablet, Plus, Bell, Star, Check, X, ArrowRight,
  MessageCircle, ShieldAlert,
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
import { apiGet, apiPut } from '@/lib/api';
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
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiGet<DashboardData>('/dashboard'),
    refetchOnMount: 'always',
    refetchInterval: 25_000,
  });

  const testimonialMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      apiPut(`/testimonials/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const stats = data?.stats;
  const charts = data?.charts;
  const attention = data?.attention;
  const hasAttention = (attention?.total || 0) > 0;

  return (
    <div>
      <PageHeader title="Dashboard" description="Vinayak Enterprises — Admin Console" />

      {/* Real-time Notification Banner for Leads & Testimonials */}
      {hasAttention && (
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  New Customer Inquiries &amp; Reviews Awaiting Action
                </h3>
                <span className="bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-sm">
                  {attention?.total} Pending
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {(attention?.newLeads || 0) > 0 && `${attention?.newLeads} new contact forms · `}
                {(attention?.pendingRFQs || 0) > 0 && `${attention?.pendingRFQs} quote requests · `}
                {(attention?.pendingTestimonials || 0) > 0 && `${attention?.pendingTestimonials} client testimonials pending approval`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {(attention?.newLeads || 0) > 0 && (
              <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700 text-xs shadow-xs">
                <Link href={`${ADMIN_BASE}/leads`}>View {attention?.newLeads} Leads →</Link>
              </Button>
            )}
            {(attention?.pendingRFQs || 0) > 0 && (
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-xs shadow-xs">
                <Link href={`${ADMIN_BASE}/rfqs`}>View {attention?.pendingRFQs} RFQs →</Link>
              </Button>
            )}
            {(attention?.pendingTestimonials || 0) > 0 && (
              <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700 text-xs shadow-xs">
                <Link href={`${ADMIN_BASE}/testimonials`}>Approve Reviews →</Link>
              </Button>
            )}
          </div>
        </div>
      )}

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

      {/* Live Inquiries & Testimonial Review Cards */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Recent Leads */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1a3a6b]" />
                Recent Customer Leads &amp; Inquiries
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Contact forms &amp; inquiries from website</p>
            </div>
            <Link href={`${ADMIN_BASE}/leads`} className="text-xs font-semibold text-[#1a3a6b] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {(data?.recentLeads || []).map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-slate-800 truncate">{lead.name}</p>
                      <Badge
                        variant={lead.status === 'new' ? 'default' : 'secondary'}
                        className={`text-[10px] px-1.5 py-0 ${lead.status === 'new' ? 'bg-emerald-600 text-white' : ''}`}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lead.company ? `${lead.company} · ` : ''}{lead.phone || lead.email}
                    </p>
                    {lead.productInterested && (
                      <p className="text-[10px] text-[#1a3a6b] font-medium truncate mt-0.5">
                        Interested: {lead.productInterested}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${lead.name}, regarding your inquiry with Vinayak Enterprises:`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2" asChild>
                      <Link href={`${ADMIN_BASE}/leads`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {(!data?.recentLeads || data.recentLeads.length === 0) && (
                <p className="text-center text-xs text-slate-400 py-6">No leads received yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Testimonials */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Pending Testimonials Needing Approval
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Client reviews submitted from website review form</p>
            </div>
            <Link href={`${ADMIN_BASE}/testimonials`} className="text-xs font-semibold text-[#1a3a6b] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {(data?.pendingTestimonials || []).map((t) => (
                <div
                  key={t._id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-xs text-slate-800">{t.name} <span className="font-normal text-slate-500">({t.company})</span></p>
                      <div className="flex text-amber-500 text-xs mt-0.5">
                        {'★'.repeat(t.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        disabled={testimonialMutation.isPending}
                        onClick={() => testimonialMutation.mutate({ id: t._id, status: 'approved' })}
                        className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={testimonialMutation.isPending}
                        onClick={() => testimonialMutation.mutate({ id: t._id, status: 'rejected' })}
                        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 line-clamp-2">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              ))}
              {(!data?.pendingTestimonials || data.pendingTestimonials.length === 0) && (
                <div className="text-center py-6 text-xs text-slate-400">
                  <Check className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                  <p className="font-semibold text-slate-600">No pending testimonials</p>
                  <p className="text-slate-400 mt-0.5">All customer reviews are reviewed and up to date.</p>
                </div>
              )}
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
