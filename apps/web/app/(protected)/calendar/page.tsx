'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarView } from '@/components/calendar/CalendarView';

// Define proper interfaces
interface Event {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  duration: number | null;
  location: string | null;
  meeting_url: string | null;
  recorded: boolean;
  recording_url: string | null;
  category?: string | null;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | null;
  sync_google?: boolean;
  sync_outlook?: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface EventData {
  title: string;
  description: string | null;
  date: string;
  time: string;
  duration: number | null;
  location: string | null;
  meeting_url: string | null;
  category?: string | null;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | null;
  sync_google?: boolean;
  sync_outlook?: boolean;
  recorded: boolean;
  recording_url: string | null;
}

// Mock events data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    workspace_id: 'ws1',
    title: 'Team Standup',
    description: 'Daily standup meeting with the development team',
    date: new Date().toISOString().split('T')[0], // Today
    time: '09:00',
    duration: 30,
    location: 'Conference Room A',
    meeting_url: 'https://zoom.us/j/123456789',
    recorded: false,
    recording_url: null,
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    workspace_id: 'ws1',
    title: 'Client Presentation',
    description: 'Quarterly review presentation for ABC Corp',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00',
    duration: 90,
    location: null,
    meeting_url: 'https://meet.google.com/xyz-abc-def',
    recorded: true,
    recording_url: 'https://drive.google.com/recording123',
    created_by: 'user2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    workspace_id: 'ws1',
    title: 'Project Planning',
    description: 'Planning session for Q1 2024 roadmap',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: '10:00',
    duration: 120,
    location: 'Main Office',
    meeting_url: null,
    recorded: false,
    recording_url: null,
    created_by: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    workspace_id: 'ws1',
    title: 'Design Review',
    description: 'Review new UI designs and prototypes',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    time: '15:30',
    duration: 60,
    location: 'Design Studio',
    meeting_url: 'https://zoom.us/j/987654321',
    recorded: false,
    recording_url: null,
    created_by: 'user3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const searchParams = useSearchParams();
  const view = (searchParams.get('view') ?? 'month') as 'month' | 'week' | 'agenda';

  const handleEventCreate = (eventData: Partial<EventData>) => {
    const newEvent: Event = {
      id: `event_${Date.now()}`,
      workspace_id: 'ws1',
      title: eventData.title || '',
      description: eventData.description || null,
      date: eventData.date || '',
      time: eventData.time || '09:00',
      duration: eventData.duration || null,
      location: eventData.location || null,
      meeting_url: eventData.meeting_url || null,
      category: eventData.category || null,
      recurrence: eventData.recurrence || 'none',
      sync_google: eventData.sync_google || false,
      sync_outlook: eventData.sync_outlook || false,
      recorded: false,
      recording_url: null,
      created_by: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEvents(prev => [...prev, newEvent]);
    console.log('Created event:', newEvent);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    console.log('Deleted event:', eventId);
  };

  return (
    <CalendarView
      events={events}
      onEventCreate={handleEventCreate}
      onEventDelete={handleEventDelete}
      initialView={view}
    />
  );
}
