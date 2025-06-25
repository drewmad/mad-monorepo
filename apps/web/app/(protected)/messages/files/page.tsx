import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { getRecentMessages } from '@/actions/messages';

export default async function FilesPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const workspaceId = session.user?.user_metadata?.current_workspace_id || 'default-workspace';
  const { messages } = await getRecentMessages(workspaceId, 50);
  const files = messages.flatMap(m => (Array.isArray(m.attachments) ? m.attachments : []));

  return (
    <section className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <h1 className="text-3xl font-bold mb-4">Shared Files</h1>
      {files.length === 0 ? (
        <p>No files shared yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file: { name: string }, idx: number) => (
            <li key={idx} className="text-indigo-600 underline">
              {file.name || 'File'}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
