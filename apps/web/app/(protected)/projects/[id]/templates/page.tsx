import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function ProjectTemplatesPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <div className="p-6">Templates coming soon.</div>
  );
}
