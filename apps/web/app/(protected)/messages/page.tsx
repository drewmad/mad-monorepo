import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
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
  searchParams: { channel?: string };
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  // Get current workspace ID from session or use default
  const workspaceId = session.user?.user_metadata?.current_workspace_id || 'default-workspace';
  const userId = session.user?.id || '';

  // Load channels for the workspace
  const { channels, error: channelsError } = await getChannels(workspaceId, userId);
  
  // Find the default or selected channel
  let currentChannel: Channel | null = null;
  let messages: Message[] = [];

  if (channels.length > 0) {
    if (searchParams.channel) {
      // Find the specific channel requested
      currentChannel = channels.find(ch => ch.id === searchParams.channel) || channels[0];
    } else {
      // Default to first channel (usually general)
      currentChannel = channels[0];
    }

    if (currentChannel) {
      // Load messages for the current channel
      const { messages: channelMessages, error: messagesError } = await getMessages(currentChannel.id);
      if (!messagesError) {
        messages = channelMessages;
      }
    }
  }

  // Mock data fallback if no real data is available
  const mockChannels: Channel[] = [
    {
      id: 'general',
      workspace_id: workspaceId,
      name: 'general',
      description: 'General team discussions',
      type: 'public',
      project_id: null,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      unread_count: 3
    },
    {
      id: 'random',
      workspace_id: workspaceId,
      name: 'random',
      description: 'Random chatter and fun stuff',
      type: 'public',
      project_id: null,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      unread_count: 0
    }
  ];

  const mockMessages: Message[] = [
    {
      id: 'msg1',
      workspace_id: workspaceId,
      channel_id: currentChannel?.id || 'general',
      user_id: userId,
      text: 'Welcome to the team chat! This is where we collaborate and stay connected.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      parent_id: null,
      edited_at: null,
      reactions: null,
      attachments: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: {
        id: userId,
        name: session.user?.user_metadata?.full_name || 'You',
        avatar_url: null,
        role: 'owner'
      }
    }
  ];

  // Use real data if available, otherwise fallback to mock data
  const finalChannels = channels.length > 0 ? channels : mockChannels;
  const finalMessages = messages.length > 0 ? messages : mockMessages;
  const finalCurrentChannel = currentChannel || mockChannels[0];

  if (channelsError) {
    console.error('Error loading channels:', channelsError);
  }

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Team communication and collaboration</p>
        </div>
      </div>

      <MessagesInterface
        workspaceId={workspaceId}
        currentUserId={userId}
        initialChannels={finalChannels}
        initialMessages={finalMessages}
        initialCurrentChannel={finalCurrentChannel}
      />
    </main>
  );
} 