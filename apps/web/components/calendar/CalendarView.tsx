'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Card, Button, Badge, Modal, Input, Textarea, Select, Toggle } from '@ui';
import { useModal } from '@/contexts/AppContext';

interface Event {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM format
  duration: number | null; // minutes
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

interface CalendarViewProps {
  events: Event[];
  onEventCreate?: (event: Partial<Event>) => void;
  onEventDelete?: (eventId: string) => void;
  initialView?: 'month' | 'week' | 'agenda';
}

export function CalendarView({
  events,
  onEventCreate,
  onEventDelete,
  initialView = 'month',
}: CalendarViewProps) {
  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'agenda'>(initialView);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    duration: '60',
    location: '',
    meeting_url: '',
    category: 'meeting',
    recurrence: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    sync_google: false,
    sync_outlook: false,
  });

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar data based on view
  let startDate: Date;
  let endDate: Date;
  if (view === 'week') {
    startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  }

  // Generate calendar days
  const calendarDays = [];
  const day = new Date(startDate);
  while (day <= endDate) {
    calendarDays.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCreateEvent = () => {
    const eventData = {
      title: newEvent.title,
      description: newEvent.description || null,
      date: newEvent.date,
      time: newEvent.time,
      duration: newEvent.duration ? parseInt(newEvent.duration) : null,
      location: newEvent.location || null,
      meeting_url: newEvent.meeting_url || null,
      category: newEvent.category || null,
      recurrence: newEvent.recurrence || 'none',
      sync_google: newEvent.sync_google,
      sync_outlook: newEvent.sync_outlook,
      recorded: false,
      recording_url: null,
    };

    onEventCreate?.(eventData);
    setShowCreateEvent(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '09:00',
      duration: '60',
      location: '',
      meeting_url: '',
      category: 'meeting',
      recurrence: 'none',
      sync_google: false,
      sync_outlook: false,
    });
  };

  const handleDateClick = (date: Date) => {
    setNewEvent({
      ...newEvent,
      date: date.toISOString().split('T')[0],
    });
    setShowCreateEvent(true);
  };

  const handleDeleteEvent = (event: Event) => {
    openModal('confirmation', {
      title: 'Delete Event',
      message: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        onEventDelete?.(event.id);
      },
    });
  };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todaysEvents = events.filter(event => event.date === todayStr);
  const agendaEvents = [...events].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your events and meetings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={goToToday} variant="secondary">
            Today
          </Button>
          <Button
            onClick={() => {
              setView('month');
              router.push(`${pathname}?view=month`);
            }}
            variant={view === 'month' ? 'primary' : 'ghost'}
          >
            Month
          </Button>
          <Button
            onClick={() => {
              setView('week');
              router.push(`${pathname}?view=week`);
            }}
            variant={view === 'week' ? 'primary' : 'ghost'}
          >
            Week
          </Button>
          <Button
            onClick={() => {
              setView('agenda');
              router.push(`${pathname}?view=agenda`);
            }}
            variant={view === 'agenda' ? 'primary' : 'ghost'}
          >
            Agenda
          </Button>
          <Button onClick={() => setShowCreateEvent(true)} variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <Button onClick={goToPreviousMonth} variant="ghost" className="p-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
                <Button onClick={goToNextMonth} variant="ghost" className="p-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            {view !== 'agenda' && (
              <>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === today.toDateString();
                    const dayEvents = getEventsForDate(day);

                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`
                      min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                      ${view === 'month' && !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                      ${isToday ? 'bg-indigo-50 border-indigo-200' : ''}
                    `}
                      >
                        <div
                          className={`
                      text-sm font-medium mb-1
                      ${isToday ? 'text-indigo-600' : view === 'month' ? (isCurrentMonth ? 'text-gray-900' : 'text-gray-400') : 'text-gray-900'}
                    `}
                        >
                          {day.getDate()}
                        </div>

                        {/* Events for this day */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              onClick={e => {
                                e.stopPropagation();
                                console.log('Open event:', event);
                              }}
                              className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded truncate hover:bg-indigo-200 transition-colors"
                            >
                              {formatTime(event.time)} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {view === 'agenda' && (
              <div className="space-y-2">
                {agendaEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(new Date(event.date))} at {formatTime(event.time)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Today's Agenda Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Agenda</h3>
            <div className="text-sm text-gray-600 mb-4">{formatDate(today)}</div>

            {todaysEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">No events today</p>
                <Button
                  onClick={() => {
                    setNewEvent({ ...newEvent, date: todayStr });
                    setShowCreateEvent(true);
                  }}
                  variant="ghost"
                  className="mt-2 text-sm"
                >
                  Add an event
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysEvents
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(event => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatTime(event.time)}
                            {event.duration && ` (${event.duration}min)`}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
                          )}
                          {event.meeting_url && (
                            <a
                              href={event.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
                            >
                              🔗 Join meeting
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Events</span>
                <Badge variant="primary">{events.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Meetings</span>
                <Badge variant="default">{events.filter(e => e.meeting_url).length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recorded</span>
                <Badge variant="success">{events.filter(e => e.recorded).length}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateEvent}
        onClose={() => {
          setShowCreateEvent(false);
          setNewEvent({
            title: '',
            description: '',
            date: '',
            time: '09:00',
            duration: '60',
            location: '',
            meeting_url: '',
            category: 'meeting',
            recurrence: 'none',
            sync_google: false,
            sync_outlook: false,
          });
        }}
        title="Create New Event"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Event Title"
            placeholder="Team meeting, Client call, etc."
            value={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            required
          />

          <Textarea
            label="Description (optional)"
            placeholder="Event details, agenda, notes..."
            value={newEvent.description}
            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Date"
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              type="time"
              value={newEvent.time}
              onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
              required
            />
            <Select
              label="Duration"
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '90', label: '1.5 hours' },
                { value: '120', label: '2 hours' },
                { value: '240', label: '4 hours' },
                { value: '', label: 'All day' },
              ]}
              value={newEvent.duration}
              onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
            />
            <Select
              label="Category"
              options={[
                { value: 'meeting', label: 'Meeting' },
                { value: 'call', label: 'Call' },
                { value: 'training', label: 'Training' },
                { value: 'other', label: 'Other' },
              ]}
              value={newEvent.category}
              onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
            />
            <Select
              label="Repeat"
              options={[
                { value: 'none', label: 'Does not repeat' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              value={newEvent.recurrence}
              onChange={e =>
                setNewEvent({
                  ...newEvent,
                  recurrence: e.target.value as 'none' | 'daily' | 'weekly' | 'monthly',
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location (optional)"
              placeholder="Conference room, address, etc."
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />
            <Input
              label="Meeting URL (optional)"
              placeholder="https://zoom.us/j/..."
              value={newEvent.meeting_url}
              onChange={e => setNewEvent({ ...newEvent, meeting_url: e.target.value })}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium">Sync Google</label>
              <Toggle
                enabled={newEvent.sync_google}
                onChange={v => setNewEvent({ ...newEvent, sync_google: v })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sync Outlook</label>
              <Toggle
                enabled={newEvent.sync_outlook}
                onChange={v => setNewEvent({ ...newEvent, sync_outlook: v })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowCreateEvent(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateEvent}
              disabled={!newEvent.title.trim() || !newEvent.date}
            >
              Create Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
