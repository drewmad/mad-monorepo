'use client';

import { Button } from '@ui';
import { useTimer } from '@/contexts/TimerContext';

function format(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts = [hrs, mins, secs].map(n => n.toString().padStart(2, '0'));
  return parts.join(':');
}

export function Timer() {
  const { isRunning, elapsed, start, pause, resume, reset } = useTimer();

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-4xl font-bold text-gray-900">{format(elapsed)}</div>
      <div className="space-x-2">
        {!isRunning && elapsed === 0 && (
          <Button onClick={start}>Start</Button>
        )}
        {isRunning && (
          <Button variant="secondary" onClick={pause}>Pause</Button>
        )}
        {!isRunning && elapsed > 0 && (
          <>
            <Button onClick={resume}>Resume</Button>
            <Button variant="secondary" onClick={reset}>Reset</Button>
          </>
        )}
      </div>
    </div>
  );
}
