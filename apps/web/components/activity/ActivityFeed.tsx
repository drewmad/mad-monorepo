'use client';

import { Card } from '@ui';

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
}

export function ActivityFeed({ activities, title = 'Recent Activity' }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No recent activity.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-lg">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
