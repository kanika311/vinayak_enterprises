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
import type { Product } from '@/types';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => apiGet<{ products: Product[]; total: number; pages: number; page: number }>('/products', { page, limit: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage microscopes, anatomy models, lab equipment and more"
        action={
          <Button asChild>
            <Link href={`${ADMIN_BASE}/products/new`}><Plus className="mr-2 h-4 w-4" /> Add Product</Link>
          </Button>
        }
      />

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products by name or SKU..." onSearch={() => setPage(1)} />
      </div>

      {isLoading ? <LoadingSpinner /> : !data?.products?.length ? (
        <EmptyState message="No products found" />
      ) : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{typeof product.category === 'object' ? product.category.name : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'published' ? 'success' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.views}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`${ADMIN_BASE}/products/${product._id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(product._id)}>
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
