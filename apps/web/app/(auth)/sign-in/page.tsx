'use client';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input, Button } from '@ui/index';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = supabaseBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow dark:bg-gray-800"
      >
        <h1 className="text-2xl font-bold">Sign in</h1>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <p className="text-center text-sm">
          No account?{' '}
          <a href="/sign-up" className="text-indigo-600 hover:underline">
            Create one
          </a>
        </p>
      </form>
    </main>
  );
} 