'use client';

import { useState } from 'react';
import { useWebSocket } from './useWebSocket';

interface StateMessage<T> {
  type: 'state';
  value: T;
}

export function useCollaborativeState<T>(url: string, initial: T) {
  const [state, setState] = useState<T>(initial);

  const { sendMessage } = useWebSocket(url, (data: StateMessage<T>) => {
    if (data.type === 'state') {
      setState(data.value);
    }
  });

  const updateState = (value: T) => {
    setState(value);
    sendMessage({ type: 'state', value });
  };

  return [state, updateState] as const;
}
