'use client';

import { useEffect, useRef } from 'react';

interface UpdateMessage {
  type: 'update';
  content: string;
  userId: string;
}

export function useCollaborativeEditing(
  docId: string,
  onUpdate: (content: string) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!docId) return;
    const ws = new WebSocket(`ws://localhost:4000/collab?docId=${docId}`);
    wsRef.current = ws;

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as UpdateMessage;
        if (data.type === 'update') {
          onUpdate(data.content);
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
    };
  }, [docId, onUpdate]);

  const broadcastUpdate = (content: string, userId: string) => {
    const msg: UpdateMessage = { type: 'update', content, userId };
    wsRef.current?.send(JSON.stringify(msg));
  };

  return { broadcastUpdate };
}
