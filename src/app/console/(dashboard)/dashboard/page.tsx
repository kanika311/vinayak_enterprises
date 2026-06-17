'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Package, Users, ClipboardList, Eye, TrendingUp, BookOpen, Download,
  Monitor, Smartphone, Tablet,
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
import { apiGet } from '@/lib/api';
import type { DashboardData } from '@/types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatChartData(data: { _id: { year: number; month: number }; count: number }[]) {
  return data.map((d) => ({
    name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
    count: d.count,
  }));
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiGet<DashboardData>('/dashboard'),
  });

  if (isLoading) return <LoadingSpinner />;

  const stats = data?.stats;
  const charts = data?.charts;

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your B2B scientific instruments business" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} />
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={Users} />
        <StatCard title="RFQ Requests" value={stats?.totalRFQs || 0} icon={ClipboardList} />
        <StatCard title="Total Visitors" value={stats?.totalVisitors || 0} icon={Eye} />
        <StatCard title="Monthly Leads" value={stats?.monthlyLeads || 0} icon={TrendingUp} trend="This month" />
        <StatCard title="Blog Views" value={stats?.blogViews || 0} icon={BookOpen} />
        <StatCard title="Catalogue Downloads" value={stats?.catalogueDownloads || 0} icon={Download} />
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
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
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
        <CardHeader><CardTitle>Top Performing Products</CardTitle></CardHeader>
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
                <TableRow key={p._id}>
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
