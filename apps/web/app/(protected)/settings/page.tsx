'use client';

import { SettingsTabs } from '@/components/settings/SettingsTabs';

export default function Settings() {
  return (
    <section className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your workspace settings and preferences</p>
      </div>

      <SettingsTabs />
    </section>
  );
}
