'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { KpiCard, Button, Modal, Toggle } from '@ui';

export interface AnalyticsWidget {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
}

interface AnalyticsWidgetsProps {
  widgets: AnalyticsWidget[];
}

export function AnalyticsWidgets({ widgets }: AnalyticsWidgetsProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    widgets.forEach(w => {
      map[w.id] = true;
    });
    return map;
  });
  const [open, setOpen] = useState(false);

  const toggleWidget = (id: string) =>
    setVisible(v => ({ ...v, [id]: !v[id] }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Customize
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.filter(w => visible[w.id]).map(w => (
          <KpiCard
            key={w.id}
            title={w.title}
            value={w.value}
            change={w.change}
            icon={w.icon}
          />
        ))}
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Customize Widgets" size="sm">
        <div className="space-y-3">
          {widgets.map(w => (
            <div key={w.id} className="flex items-center justify-between">
              <span className="text-sm">{w.title}</span>
              <Toggle enabled={visible[w.id]} onChange={() => toggleWidget(w.id)} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
