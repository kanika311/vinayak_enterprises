'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { SearchBar } from '@/components/admin/search-bar';
import { Pagination } from '@/components/admin/pagination';
import { LoadingSpinner, EmptyState } from '@/components/admin/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiGet, apiDelete } from '@/lib/api';
import { ADMIN_BASE } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page, search, status],
    queryFn: () => apiGet<{ blogs: Blog[]; pages: number; page: number }>('/blogs', {
      page,
      limit: 10,
      search: search || undefined,
      status: status || undefined,
    }),
    refetchOnMount: 'always',
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs-public'] });
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <PageHeader
        title="Blog Management"
        description="Create, edit and publish blog posts"
        action={
          <Button asChild>
            <Link href={`${ADMIN_BASE}/blogs/new`}><Plus className="mr-2 h-4 w-4" /> New Post</Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search blogs..." onSearch={() => setPage(1)} />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-40"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {isLoading ? <LoadingSpinner /> : !data?.blogs?.length ? (
        <EmptyState message="No blog posts found" />
      ) : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                    <TableCell>{blog.author?.name}</TableCell>
                    <TableCell>
                      <Badge variant={blog.status === 'published' ? 'success' : 'secondary'}>{blog.status}</Badge>
                    </TableCell>
                    <TableCell>{blog.views}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(blog.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`${ADMIN_BASE}/blogs/${blog._id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(blog._id, blog.title)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
