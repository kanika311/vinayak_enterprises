'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingSpinner } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet, apiDelete } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => apiGet<{ blogs: Blog[]; pages: number; page: number }>('/blogs', { page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/blogs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  return (
    <div>
      <PageHeader title="Blog Management" description="Create and manage blog posts" action={<Button asChild><Link href={`${ADMIN_BASE}/blogs/new`}><Plus className="mr-2 h-4 w-4" /> New Post</Link></Button>} />
      {isLoading ? <LoadingSpinner /> : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.blogs?.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.author?.name}</TableCell>
                  <TableCell>{blog.status}</TableCell>
                  <TableCell>{blog.views}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(blog._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
