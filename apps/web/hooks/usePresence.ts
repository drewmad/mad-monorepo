'use client';

import { useEffect, useRef, useState } from 'react';

interface PresenceMessage {
  type: 'presence';
  userId: string;
  online: boolean;
}

export function usePresence(roomId: string) {
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;
    const ws = new WebSocket(`ws://localhost:4000/presence?roomId=${roomId}`);
    wsRef.current = ws;

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as PresenceMessage;
        if (data.type === 'presence') {
          setPresence(prev => ({ ...prev, [data.userId]: data.online }));
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const sendPresence = (userId: string, online: boolean) => {
    const msg: PresenceMessage = { type: 'presence', userId, online };
    wsRef.current?.send(JSON.stringify(msg));
  };

  return { presence, sendPresence };
}
