'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '@ui';
import { createTimeEntry } from '@/actions/time';

interface TimerControlsProps {
  workspaceId: string;
  userId: string;
}

export function TimerControls({ workspaceId, userId }: TimerControlsProps) {
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, startTime]);

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStart = () => {
    setRunning(true);
    setStartTime(new Date());
    setElapsed(0);
  };

  const handleStop = async () => {
    if (!startTime) return;
    const end = new Date();
    const duration = Math.round((end.getTime() - startTime.getTime()) / 60000);
    setRunning(false);
    setStartTime(null);
    setElapsed(0);
    await createTimeEntry({
      workspace_id: workspaceId,
      user_id: userId,
      description: description || null,
      start_time: startTime.toISOString(),
      end_time: end.toISOString(),
      duration_minutes: duration,
    });
    setDescription('');
  };

  const handleManual = async () => {
    if (!manualStart || !manualEnd) return;
    const start = new Date(manualStart);
    const end = new Date(manualEnd);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);
    await createTimeEntry({
      workspace_id: workspaceId,
      user_id: userId,
      description: description || null,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      duration_minutes: duration,
    });
    setManualStart('');
    setManualEnd('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="primary" onClick={running ? handleStop : handleStart}>
          {running ? 'Stop' : 'Start'}
        </Button>
        <span className="text-xl font-mono">{formatElapsed(elapsed)}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="datetime-local"
          label="Start"
          value={manualStart}
          onChange={e => setManualStart(e.target.value)}
        />
        <Input
          type="datetime-local"
          label="End"
          value={manualEnd}
          onChange={e => setManualEnd(e.target.value)}
        />
        <div className="md:col-span-2">
          <Textarea
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </div>
      <Button variant="secondary" onClick={handleManual} disabled={!manualStart || !manualEnd}>
        Add Entry
      </Button>
    </div>
  );
}
