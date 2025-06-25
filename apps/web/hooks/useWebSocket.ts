'use client';

import { useEffect, useRef } from 'react';

export function useWebSocket<T>(url: string, onMessage: (data: T) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as T;
        onMessage(data);
      } catch {
        // ignore invalid JSON
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
      socket.close();
    };
  }, [url, onMessage]);

  const sendMessage = (data: T) => {
    socketRef.current?.send(JSON.stringify(data));
  };

  return { sendMessage };
}
