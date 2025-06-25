'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select } from '@ui';
import { useModal } from '@/contexts/AppContext';

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
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface EventModalProps {
    event: Event;
    onUpdate?: (event: Event) => void;
    onDelete?: (eventId: string) => void;
}

export function EventModal({ event, onUpdate, onDelete }: EventModalProps) {
    const { closeModal } = useModal();
    const [editing, setEditing] = useState(false);
    const [editedEvent, setEditedEvent] = useState({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time,
        duration: event.duration ? String(event.duration) : '',
        location: event.location || '',
        meeting_url: event.meeting_url || ''
    });

    const handleSave = () => {
        const updated: Event = {
            ...event,
            title: editedEvent.title,
            description: editedEvent.description || null,
            date: editedEvent.date,
            time: editedEvent.time,
            duration: editedEvent.duration ? parseInt(editedEvent.duration) : null,
            location: editedEvent.location || null,
            meeting_url: editedEvent.meeting_url || null,
            updated_at: new Date().toISOString()
        };
        onUpdate?.(updated);
        closeModal();
    };

    const handleDelete = () => {
        onDelete?.(event.id);
        closeModal();
    };

    return (
        <div className="space-y-4">
            <Input
                label="Event Title"
                value={editedEvent.title}
                onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                disabled={!editing}
            />
            <Textarea
                label="Description"
                value={editedEvent.description}
                onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                rows={3}
                disabled={!editing}
            />
            <div className="grid grid-cols-3 gap-4">
                <Input
                    label="Date"
                    type="date"
                    value={editedEvent.date}
                    onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                    disabled={!editing}
                />
                <Input
                    label="Time"
                    type="time"
                    value={editedEvent.time}
                    onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })}
                    disabled={!editing}
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
                        { value: '', label: 'All day' }
                    ]}
                    value={editedEvent.duration}
                    onChange={(e) => setEditedEvent({ ...editedEvent, duration: e.target.value })}
                    disabled={!editing}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Location"
                    value={editedEvent.location}
                    onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                    disabled={!editing}
                />
                <Input
                    label="Meeting URL"
                    value={editedEvent.meeting_url}
                    onChange={(e) => setEditedEvent({ ...editedEvent, meeting_url: e.target.value })}
                    disabled={!editing}
                />
            </div>
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                {editing ? (
                    <>
                        <Button variant="secondary" onClick={() => { setEditing(false); setEditedEvent({
                            title: event.title,
                            description: event.description || '',
                            date: event.date,
                            time: event.time,
                            duration: event.duration ? String(event.duration) : '',
                            location: event.location || '',
                            meeting_url: event.meeting_url || ''
                        }); }}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!editedEvent.title.trim() || !editedEvent.date}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="secondary" onClick={() => setEditing(true)}>
                            Edit
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
