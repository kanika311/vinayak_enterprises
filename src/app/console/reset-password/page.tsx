'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_BASE } from '@/lib/constants';
import { apiPost } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiPost('/auth/reset-password', { token, password });
      router.push(`${ADMIN_BASE}/login`);
    } catch {
      setError('Invalid or expired reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href={`${ADMIN_BASE}/login`} className="text-sm text-primary hover:underline">Back to login</Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
