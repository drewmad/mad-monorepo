'use client';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input, Button } from '@ui';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = supabaseBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (!error) router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow dark:bg-gray-800"
      >
        <h1 className="text-2xl font-bold">Create account</h1>
        <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
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
          Sign up
        </Button>
        <p className="text-center text-sm">
          Have an account?{' '}
          <a href="/sign-in" className="text-indigo-600 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
} 