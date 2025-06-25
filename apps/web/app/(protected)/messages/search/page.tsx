import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { searchMessages } from '@/actions/messages';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchMessagesPage({ searchParams }: SearchPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const workspaceId = session.user?.user_metadata?.current_workspace_id || 'default-workspace';
  const query = searchParams.q ?? '';
  const { messages } = query ? await searchMessages(workspaceId, query) : { messages: [] };

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <h1 className="text-3xl font-bold mb-4">Search Messages</h1>
      <form className="mb-6">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search..."
          className="border rounded px-2 py-1"
        />
        <button type="submit" className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded">
          Search
        </button>
      </form>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((m) => (
            <li key={m.id} className="p-2 border rounded">
              <div className="text-sm text-gray-600">{m.channel.name}</div>
              <div>{m.text}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
