'use client';

import { useState } from 'react';
import { MessagesInterface } from '@/components/messages/MessagesInterface';
import type { Database } from '@mad/db';

type Channel = Database['public']['Tables']['channels']['Row'] & {
  unread_count?: number;
};

type Message = Database['public']['Tables']['messages']['Row'] & {
  user?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
};

// Mock channels data
const mockChannels: Channel[] = [
  {
    id: 'general',
    workspace_id: 'ws1',
    name: 'general',
    description: 'General team discussions',
    type: 'public',
    project_id: null,
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 3
  },
  {
    id: 'random',
    workspace_id: 'ws1',
    name: 'random',
    description: 'Random chatter and fun stuff',
    type: 'public',
    project_id: null,
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 0
  },
  {
    id: 'design-team',
    workspace_id: 'ws1',
    name: 'design-team',
    description: 'Design team coordination',
    type: 'private',
    project_id: null,
    created_by: 'user2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 1
  },
  {
    id: 'project-alpha',
    workspace_id: 'ws1',
    name: 'Project Alpha',
    description: 'Discussion for Project Alpha',
    type: 'project',
    project_id: 'proj1',
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 0
  },
  {
    id: 'dm-alice',
    workspace_id: 'ws1',
    name: 'Alice Johnson',
    description: null,
    type: 'direct',
    project_id: null,
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 2
  },
  {
    id: 'dm-bob',
    workspace_id: 'ws1',
    name: 'Bob Wilson',
    description: null,
    type: 'direct',
    project_id: null,
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    unread_count: 0
  }
];

// Mock messages data
const mockMessages: Message[] = [
  {
    id: 'msg1',
    workspace_id: 'ws1',
    channel_id: 'general',
    user_id: 'user1',
    text: 'Good morning everyone! Ready for another productive day? 🌅',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    parent_id: null,
    edited_at: null,
    reactions: { '👍': ['user2', 'user3'], '🔥': ['user4'] },
    attachments: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'user1',
      name: 'John Doe',
      avatar_url: null
    }
  },
  {
    id: 'msg2',
    workspace_id: 'ws1',
    channel_id: 'general',
    user_id: 'user2',
    text: 'Absolutely! Just finished reviewing the Q4 reports. Looking great so far.',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 minutes ago
    parent_id: 'msg1',
    edited_at: null,
    reactions: null,
    attachments: null,
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    user: {
      id: 'user2',
      name: 'Alice Johnson',
      avatar_url: null
    }
  },
  {
    id: 'msg3',
    workspace_id: 'ws1',
    channel_id: 'general',
    user_id: 'user3',
    text: 'Quick reminder: Team standup in 15 minutes! 📅\n\nToday\'s agenda:\n- Sprint review\n- Next week planning\n- Blockers discussion',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    parent_id: null,
    edited_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    reactions: { '✅': ['user1', 'user2', 'user4', 'user5'] },
    attachments: null,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    user: {
      id: 'user3',
      name: 'Sarah Chen',
      avatar_url: null
    }
  },
  {
    id: 'msg4',
    workspace_id: 'ws1',
    channel_id: 'general',
    user_id: 'user4',
    text: 'Thanks for the reminder! See everyone there 👋',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    parent_id: 'msg3',
    edited_at: null,
    reactions: null,
    attachments: null,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: {
      id: 'user4',
      name: 'Mike Torres',
      avatar_url: null
    }
  }
];

export default function MessagesPage() {
  const [channels] = useState<Channel[]>(mockChannels);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(mockChannels[0]);

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
    // In a real app, you would fetch messages for the selected channel here
    // For now, we filter existing messages by channel_id
    const channelMessages = mockMessages.filter(msg => msg.channel_id === channel.id);
    setMessages(channelMessages);
  };

  const handleMessageSend = (channelId: string, text: string, parentId?: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      workspace_id: 'ws1',
      channel_id: channelId,
      user_id: 'current_user',
      text,
      timestamp: new Date().toISOString(),
      parent_id: parentId || null,
      edited_at: null,
      reactions: null,
      attachments: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'current_user',
        name: 'You',
        avatar_url: null
      }
    };

    setMessages(prev => [...prev, newMessage]);
    console.log('Sent message:', newMessage);
  };

  const handleChannelCreate = (channelData: Partial<Channel>) => {
    const newChannel = {
      id: `channel_${Date.now()}`,
      workspace_id: 'ws1',
      name: channelData.name || '',
      description: channelData.description || null,
      type: channelData.type || 'public',
      project_id: channelData.project_id || null,
      created_by: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      unread_count: 0
    };

    console.log('Created channel:', newChannel);
    // In a real app, you would add this to the channels list and update state
  };

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <MessagesInterface
        channels={channels}
        messages={messages}
        currentChannel={currentChannel}
        onChannelSelect={handleChannelSelect}
        onMessageSend={handleMessageSend}
        onChannelCreate={handleChannelCreate}
      />
    </main>
  );
} 