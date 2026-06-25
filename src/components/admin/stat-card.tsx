import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatNumber } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  className?: string;
  href?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className, href }: StatCardProps) {
  const content = (
    <Card className={cn(href && 'hover:shadow-md hover:border-[#1a3a6b]/30 transition-all cursor-pointer', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? formatNumber(value) : value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
