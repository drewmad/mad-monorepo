'use client';

import { useState, useRef, useEffect, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Avatar, Badge, Dropdown, DropdownItem, IconButton, PresenceIndicator } from '@ui';
import { SectionMenu } from './SectionMenu';
import { createMessage, getMessages, createChannel } from '@/actions/messages';
import type { Database } from '@mad/db';
import { usePresence, useCollaborativeEditing } from '@/hooks';

interface Channel {
    id: string;
    workspace_id: string;
    name: string;
    description: string | null;
    type: 'public' | 'private' | 'direct' | 'project';
    project_id: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    unread_count?: number;
}

interface Message {
    id: string;
    workspace_id: string;
    channel_id: string;
    user_id: string;
    text: string;
    timestamp: string;
    parent_id: string | null;
    edited_at: string | null;
    reactions: Database['public']['Tables']['messages']['Row']['reactions'];
    attachments: Database['public']['Tables']['messages']['Row']['attachments'];
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        name: string;
        avatar_url?: string | null;
    };
    read_by?: string[];
    replies?: Database['public']['Tables']['messages']['Row'][];
}

interface MessagesInterfaceProps {
    workspaceId: string;
    currentUserId: string;
    initialChannels?: Channel[];
    initialMessages?: Message[];
    initialCurrentChannel?: Channel | null;
    view?: 'channels' | 'direct' | 'threads';
}

export function MessagesInterface({
    workspaceId,
    currentUserId,
    initialChannels,
    initialMessages,
    initialCurrentChannel,
    view = 'channels'
}: MessagesInterfaceProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const [channels, setChannels] = useState<Channel[]>(initialChannels ?? []);
    const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);
    const [currentChannel, setCurrentChannel] = useState<Channel | null>(initialCurrentChannel ?? null);
    const [messageText, setMessageText] = useState('');
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const [showChannelCreate, setShowChannelCreate] = useState(false);
    const [newChannel, setNewChannel] = useState({
        name: '',
        description: '',
        type: 'public' as 'public' | 'private' | 'direct' | 'project'
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [readReceipts, setReadReceipts] = useState<Record<string, string[]>>({});
    const { presence, sendPresence } = usePresence(currentChannel?.id || '');
    const { broadcastUpdate } = useCollaborativeEditing(currentChannel?.id || '', () => {});

    const displayedMessages = useMemo(() => {
        if (!currentChannel) return [];
        let result = messages;
        if (view === 'threads') {
            result = result.filter(m => Array.isArray(m.replies) && m.replies.length > 0);
        }
        if (searchQuery.trim()) {
            result = result.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return result;
    }, [messages, view, searchQuery, currentChannel]);

    useEffect(() => {
        if (!currentChannel) return;
        sendPresence(currentUserId, true);
        return () => {
            sendPresence(currentUserId, false);
        };
    }, [currentChannel, currentUserId, sendPresence]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setReadReceipts(prev => {
            const updated = { ...prev };
            messages.forEach(m => {
                if (!updated[m.id]) updated[m.id] = [currentUserId];
            });
            return updated;
        });
    }, [messages, currentUserId]);

    const handleSendMessage = () => {
        if (!messageText.trim() && selectedFiles.length === 0) return;
        if (!currentChannel) return;

        startTransition(async () => {
            const { message, error } = await createMessage({
                workspace_id: workspaceId,
                channel_id: currentChannel.id,
                user_id: currentUserId,
                text: messageText,
                timestamp: new Date().toISOString(),
                parent_id: replyToMessage?.id || null,
                attachments: selectedFiles.map(f => ({ name: f.name })) as unknown as Database['public']['Tables']['messages']['Row']['attachments'],
            });

            if (error) {
                console.error('Error sending message:', error);
            } else if (message) {
                // Add the new message to the local state
                setMessages(prev => [...prev, message]);
                setReadReceipts(prev => ({ ...prev, [message.id]: [currentUserId] }));
                setMessageText('');
                setReplyToMessage(null);
                setSelectedFiles([]);
            }
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
        broadcastUpdate(e.target.value, currentUserId);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        setIsTyping(true);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1000);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getChannelIcon = (channel: Channel) => {
        switch (channel.type) {
            case 'public':
                return '#';
            case 'private':
                return '🔒';
            case 'direct':
                return '👤';
            case 'project':
                return '📁';
            default:
                return '#';
        }
    };

    const handleChannelSelect = async (channel: Channel) => {
        setCurrentChannel(channel);
        
        // Load messages for the selected channel
        startTransition(async () => {
            const { messages: channelMessages, error } = await getMessages(channel.id);
            if (!error && channelMessages) {
                setMessages(channelMessages);
            }
        });
        
        // Update URL to reflect selected channel
        router.push(`/messages?channel=${channel.id}`);
    };

    const handleCreateChannel = () => {
        if (!newChannel.name.trim()) return;

        startTransition(async () => {
            const { channel, error } = await createChannel({
                workspace_id: workspaceId,
                name: newChannel.name,
                description: newChannel.description || null,
                type: newChannel.type,
                project_id: null,
                created_by: currentUserId,
            });

            if (error) {
                console.error('Error creating channel:', error);
            } else if (channel) {
                // Add the new channel to the local state
                setChannels(prev => [...prev, channel]);
                setShowChannelCreate(false);
                setNewChannel({ name: '', description: '', type: 'public' });
                
                // Select the new channel
                handleChannelSelect(channel);
            }
        });
    };

    const groupedChannels = channels.reduce((acc, channel) => {
        if (channel.type === 'direct') {
            if (!acc.direct) acc.direct = [];
            acc.direct.push(channel);
        } else if (channel.type === 'project') {
            if (!acc.project) acc.project = [];
            acc.project.push(channel);
        } else {
            if (!acc.channels) acc.channels = [];
            acc.channels.push(channel);
        }
        return acc;
    }, {} as Record<string, Channel[]>);

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Channel Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                        <Button
                            onClick={() => setShowChannelCreate(true)}
                            variant="ghost"
                            className="p-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* Channel List */}
                <div className="flex-1 overflow-y-auto">
                    {/* Channels */}
                    {groupedChannels.channels && (
                        <div className="p-3">
                            <div
                                className="flex items-center justify-between mb-2 group"
                                tabIndex={0}
                            >
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Channels
                                </div>
                                <SectionMenu
                                    onCreate={() => setShowChannelCreate(true)}
                                    onManage={() => console.log('Manage channels')}
                                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                                />
                            </div>
                            <div className="space-y-1">
                                {groupedChannels.channels.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => handleChannelSelect(channel)}
                                        className={`
                      w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors text-left
                      ${currentChannel?.id === channel.id
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-100'}
                    `}
                                    >
                                        <span className="text-gray-400">{getChannelIcon(channel)}</span>
                                        <span className="flex-1 truncate">{channel.name}</span>
                                        {channel.unread_count && channel.unread_count > 0 && (
                                            <Badge variant="danger" size="sm">
                                                {channel.unread_count}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project Channels */}
                    {groupedChannels.project && (
                        <div className="p-3">
                            <div
                                className="flex items-center justify-between mb-2 group"
                                tabIndex={0}
                            >
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Projects
                                </div>
                                <SectionMenu
                                    onCreate={() => setShowChannelCreate(true)}
                                    onManage={() => console.log('Manage channels')}
                                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                                />
                            </div>
                            <div className="space-y-1">
                                {groupedChannels.project.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => handleChannelSelect(channel)}
                                        className={`
                      w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors text-left
                      ${currentChannel?.id === channel.id
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-100'}
                    `}
                                    >
                                        <span className="text-gray-400">{getChannelIcon(channel)}</span>
                                        <span className="flex-1 truncate">{channel.name}</span>
                                        {channel.unread_count && channel.unread_count > 0 && (
                                            <Badge variant="danger" size="sm">
                                                {channel.unread_count}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Direct Messages */}
                    {groupedChannels.direct && (
                        <div className="p-3">
                            <div
                                className="flex items-center justify-between mb-2 group"
                                tabIndex={0}
                            >
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Direct Messages
                                </div>
                                <SectionMenu
                                    onCreate={() => setShowChannelCreate(true)}
                                    onManage={() => console.log('Manage channels')}
                                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                                />
                            </div>
                            <div className="space-y-1">
                                {groupedChannels.direct.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => handleChannelSelect(channel)}
                                        className={`
                      w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors text-left
                      ${currentChannel?.id === channel.id
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-100'}
                    `}
                                    >
                                        <Avatar size="xs" initials={channel.name.charAt(0)} />
                                        <span className="flex-1 truncate">{channel.name}</span>
                                        {channel.unread_count && channel.unread_count > 0 && (
                                            <Badge variant="danger" size="sm">
                                                {channel.unread_count}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {currentChannel ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">{getChannelIcon(currentChannel)}</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{currentChannel.name}</h3>
                                        {currentChannel.description && (
                                            <p className="text-sm text-gray-500">{currentChannel.description}</p>
                                        )}
                                    </div>
                                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                                        <PresenceIndicator online={Object.values(presence).filter(Boolean).length > 0} />
                                        <span>{Object.values(presence).filter(Boolean).length}</span>
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <IconButton variant="ghost" size="sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </IconButton>
                                    <Dropdown
                                        trigger={
                                            <IconButton variant="ghost" size="sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </IconButton>
                                        }
                                        align="right"
                                    >
                                        <DropdownItem onClick={() => console.log('Channel settings')}>
                                            Channel settings
                                        </DropdownItem>
                                        <DropdownItem onClick={() => console.log('Invite members')}>
                                            Invite members
                                        </DropdownItem>
                                        <DropdownItem onClick={() => console.log('View members')}>
                                            View members
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="mb-4">
                                <Input
                                    placeholder="Search messages"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {displayedMessages.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p>No messages yet in this channel</p>
                                    <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                                </div>
                            ) : (
                                displayedMessages.map((message) => (
                                    <div key={message.id} className="flex space-x-3 group">
                                        <Avatar
                                            src={message.user?.avatar_url}
                                            initials={message.user?.name?.charAt(0) || 'U'}
                                            size="sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-900">{message.user?.name || 'Unknown User'}</span>
                                                <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                                            </div>

                                            {/* Parent message (if reply) */}
                                            {message.parent_id && (
                                                <div className="mt-1 pl-3 border-l-2 border-gray-200 text-sm text-gray-600">
                                                    <div className="bg-gray-50 rounded p-2">
                                                        Replying to previous message...
                                                    </div>
                                                </div>
                                            )}

                                            {/* Message content */}
                                            <div className="mt-1">
                                                <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
                                                {message.edited_at && (
                                                    <span className="text-xs text-gray-400 ml-1">(edited)</span>
                                                )}
                                                {message.attachments && Array.isArray(message.attachments) && (
                                                    <ul className="mt-2 space-y-1">
                                                        {(message.attachments as { name: string }[]).map((att, idx) => (
                                                            <li key={idx} className="text-sm text-indigo-600 underline">
                                                                {att.name || 'Attachment'}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Message actions */}
                                            <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setReplyToMessage(message)}
                                                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                                                >
                                                    Reply
                                                </button>
                                                <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                                                    React
                                                </button>
                                                <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                                                    Share
                                                </button>
                                            </div>

                                            {/* Reactions */}
                                            {message.reactions && typeof message.reactions === 'object' && message.reactions !== null && (
                                                <div className="flex items-center space-x-1 mt-2">
                                                    {Object.entries(message.reactions as Record<string, unknown>).map(([emoji, users]) => (
                                                        <button
                                                            key={emoji}
                                                            className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs"
                                                        >
                                                            <span>{emoji}</span>
                                                            <span>{Array.isArray(users) ? users.length : 0}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {readReceipts[message.id] && (
                                                <div className="mt-1 text-xs text-gray-400">
                                                    Read by {readReceipts[message.id].length}
                                                </div>
                                            )}
                                            {Array.isArray(message.replies) && message.replies.length > 0 && (
                                                <div className="mt-2 ml-4 space-y-2 border-l border-gray-200 pl-3">
                                                    {message.replies.map((reply: Message) => (
                                                        <div key={reply.id} className="flex space-x-2">
                                                            <Avatar src={reply.user?.avatar_url} initials={reply.user?.name?.charAt(0) || 'U'} size="xs" />
                                                            <div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm font-medium text-gray-900">{reply.user?.name}</span>
                                                                    <span className="text-xs text-gray-500">{formatTime(reply.timestamp)}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{reply.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Banner */}
                        {replyToMessage && (
                            <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-yellow-800">
                                            Replying to {replyToMessage.user?.name}
                                        </span>
                                        <span className="text-sm text-yellow-600 truncate max-w-xs">
                                            {replyToMessage.text}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setReplyToMessage(null)}
                                        className="text-yellow-600 hover:text-yellow-800"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            {isTyping && (
                                <div className="text-xs text-gray-500 mb-2">Typing...</div>
                            )}
                            <div className="flex items-end space-x-3">
                                <div className="flex-1">
                                    <Input
                                        placeholder={`Message ${currentChannel.name}`}
                                        value={messageText}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        className="resize-none"
                                    />
                                    <input
                                        multiple
                                        type="file"
                                        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                                        className="mt-2"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim()}
                                    variant="primary"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a channel</h3>
                            <p className="text-gray-500">Choose a channel from the sidebar to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Channel Modal */}
            {showChannelCreate && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowChannelCreate(false)} />
                        <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Channel</h3>

                            <div className="space-y-4">
                                <Input
                                    label="Channel Name"
                                    placeholder="general, random, etc."
                                    value={newChannel.name}
                                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                                />

                                <Input
                                    label="Description (optional)"
                                    placeholder="What's this channel about?"
                                    value={newChannel.description}
                                    onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Channel Type
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="public"
                                                checked={newChannel.type === 'public'}
                                                onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value as 'public' | 'private' | 'direct' | 'project' })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm">Public - Anyone can join</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="private"
                                                checked={newChannel.type === 'private'}
                                                onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value as 'public' | 'private' | 'direct' | 'project' })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm">Private - Invite only</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <Button variant="secondary" onClick={() => setShowChannelCreate(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleCreateChannel}
                                    disabled={!newChannel.name.trim()}
                                >
                                    Create Channel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 