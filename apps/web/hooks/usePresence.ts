'use client';

import { useState } from 'react';
import { useWebSocket } from './useWebSocket';

interface PresenceMessage {
  type: 'presence';
  userId: string;
  status: string;
}

export function usePresence(url: string, userId: string) {
  const [presence, setPresence] = useState<Record<string, string>>({});

  const { sendMessage } = useWebSocket(url, (data: PresenceMessage) => {
    if (data.type === 'presence') {
      setPresence(prev => ({ ...prev, [data.userId]: data.status }));
    }
  });

  const updateStatus = (status: string) => {
    sendMessage({ type: 'presence', userId, status });
  };

  return { presence, updateStatus };
}
