'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TimerContextValue {
  isRunning: boolean;
  elapsed: number; // seconds
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Load stored timer state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('timerState');
    if (stored) {
      try {
        const data = JSON.parse(stored) as {
          isRunning: boolean;
          startTime: number | null;
          elapsed: number;
        };
        setIsRunning(data.isRunning);
        setStartTime(data.startTime);
        setElapsed(data.elapsed);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Persist timer state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'timerState',
      JSON.stringify({ isRunning, startTime, elapsed })
    );
  }, [isRunning, startTime, elapsed]);

  // Tick when running
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const start = () => {
    setStartTime(Date.now());
    setElapsed(0);
    setIsRunning(true);
  };

  const pause = () => {
    if (startTime) {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }
    setIsRunning(false);
  };

  const resume = () => {
    setStartTime(Date.now() - elapsed * 1000);
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsed(0);
  };

  return (
    <TimerContext.Provider value={{ isRunning, elapsed, start, pause, resume, reset }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within a TimerProvider');
  return ctx;
}
