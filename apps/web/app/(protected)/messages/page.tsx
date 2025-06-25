import { requireAuth } from '@/lib/user';
import { Suspense } from 'react';
import { getChannels, getMessages } from '@/actions/messages';
import { MessagesInterface } from '@/components/messages/MessagesInterface';
import type { Database } from '@mad/db';

type Channel = Database['public']['Tables']['channels']['Row'] & {
  unread_count?: number;
  lastMessage?: Database['public']['Tables']['messages']['Row'] | null;
  messageCount?: number;
};

type Message = Database['public']['Tables']['messages']['Row'] & {
  user?: {
    id: string;
    name: string;
    avatar_url?: string | null;
    role?: string;
  };
  replies?: Database['public']['Tables']['messages']['Row'][];
};

interface MessagesPageProps {
  searchParams: { channel?: string; view?: string };
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const session = await requireAuth();
  const workspaceId = session.user?.user_metadata?.current_workspace_id;
  const userId = session.user?.id || '';

  if (!workspaceId) {
    return (
      <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
        <p className="text-gray-600">No workspace selected.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Team communication and collaboration</p>
        </div>
      </div>

      <Suspense fallback={<p>Loading messages...</p>}>
        <MessagesContent
          workspaceId={workspaceId}
          userId={userId}
          searchParams={searchParams}
        />
      </Suspense>
    </main>
  );
}

async function MessagesContent({
  workspaceId,
  userId,
  searchParams
}: {
  workspaceId: string;
  userId: string;
  searchParams: { channel?: string; view?: string };
}) {
  const { channels, error: channelsError } = await getChannels(workspaceId, userId);

  if (channelsError) {
    console.error('Error loading channels:', channelsError);
    throw new Error('Failed to load channels');
  }

  if (!channels || channels.length === 0) {
    return <p>No channels found. Create a channel to start messaging.</p>;
  }

  const view = (searchParams.view ?? 'channels') as 'channels' | 'direct' | 'threads';
  let channelList = channels;
  if (view === 'direct') {
    channelList = channels.filter(ch => ch.type === 'direct');
  }

  if (!channelList || channelList.length === 0) {
    return <p>No channels found for this view.</p>;
  }

  let currentChannel: Channel | null = null;
  if (channelList.length > 0) {
    if (searchParams.channel) {
      currentChannel = channelList.find(ch => ch.id === searchParams.channel) || channelList[0];
    } else {
      currentChannel = channelList[0];
    }
  }

  let messages: Message[] = [];
  if (currentChannel) {
    const { messages: channelMessages, error: messagesError } = await getMessages(currentChannel.id);
    if (messagesError) {
      console.error('Error loading messages:', messagesError);
    } else {
      messages = channelMessages;
    }
  }

  return (
    <MessagesInterface
      workspaceId={workspaceId}
      currentUserId={userId}
      initialChannels={channelList}
      initialMessages={messages}
      initialCurrentChannel={currentChannel}
      view={view}
    />
  );
}
