import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function ProjectFilesPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <div className="p-6">Files coming soon.</div>
  );
}
