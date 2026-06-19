'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_BASE } from '@/lib/constants';
import { apiPost } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invalid reset link</CardTitle>
          <CardDescription>This link is missing a token or has expired.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Request a new password reset from the login page. Use the link on the same device where you open the site
            (localhost links only work on your PC).
          </p>
          <Button asChild className="w-full">
            <Link href={`${ADMIN_BASE}/forgot-password`}>Request new link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await apiPost('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => router.push(`${ADMIN_BASE}/login`), 2000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Invalid or expired reset token. Request a new link.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <h2 className="text-xl font-bold">Password updated!</h2>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to login…</p>
        </CardContent>
      </Card>
    );
  }

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
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={6} required />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Set New Password'}
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
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
