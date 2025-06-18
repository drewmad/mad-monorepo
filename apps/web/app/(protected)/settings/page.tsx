import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/Card';

export default async function Settings() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>General workspace settings coming soon.</CardContent>
      </Card>
    </main>
  );
} 