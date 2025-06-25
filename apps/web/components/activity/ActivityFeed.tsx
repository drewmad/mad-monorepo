'use client';

import { Card } from '@ui';
import type { ReactNode } from 'react';

export interface ActivityItem {
  id: string;
  icon?: ReactNode;
  message: string;
  timestamp: string;
  color?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  if (!items || items.length === 0) {
    return (
      <Card className={className + ' p-6'}>
        <p className="text-center text-sm text-gray-500">No recent activity</p>
      </Card>
    );
  }

  return (
    <Card className={className + ' p-6'}>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-start space-x-3">
            {item.icon && (
              <span className={`text-lg ${item.color ?? ''}`}>{item.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{item.message}</p>
              <p className="text-xs text-gray-500">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
