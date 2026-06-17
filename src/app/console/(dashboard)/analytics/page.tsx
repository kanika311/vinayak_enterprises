'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { LoadingSpinner } from '@/components/admin/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, MousePointer, Package } from 'lucide-react';
import { apiGet } from '@/lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => apiGet<{
      totalEvents: number;
      bySource: { _id: string; count: number }[];
      topProducts: { _id: string; count: number }[];
      byDevice: { _id: string; count: number }[];
    }>('/analytics'),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Analytics" description="Visitors, page views, product views, lead sources" />
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard title="Total Events" value={data?.totalEvents || 0} icon={Eye} />
        <StatCard title="Lead Sources" value={data?.bySource?.length || 0} icon={MousePointer} />
        <StatCard title="Top Products Tracked" value={data?.topProducts?.length || 0} icon={Package} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Lead Sources</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={(data?.bySource || []).map((d) => ({ name: d._id, count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={12} /><YAxis /><Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={(data?.byDevice || []).map((d) => ({ name: d._id, value: d.count }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {(data?.byDevice || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
