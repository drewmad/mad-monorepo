'use client';

interface PresenceIndicatorProps {
  presence: Record<string, string>;
  userMap?: Record<string, string>;
}

export default function PresenceIndicator({ presence, userMap }: PresenceIndicatorProps) {
  const active = Object.entries(presence).filter(([, status]) => status !== 'offline');
  if (active.length === 0) return null;

  return (
    <div className="text-xs text-gray-500 mb-2">
      {active.map(([id, status]) => (
        <span key={id} className="mr-2">
          {(userMap?.[id] || id).split('@')[0]} {status}
        </span>
      ))}
    </div>
  );
}
