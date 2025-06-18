'use client';

import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { useSidebar } from '@/components/sidebar/context';

interface ProtectedLayoutClientProps {
  user: {
    name: string;
    avatar_url?: string;
    email?: string;
  };
  children: React.ReactNode;
}

export default function ProtectedLayoutClient({ user, children }: ProtectedLayoutClientProps) {
  const { expanded } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          expanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <Header user={user} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
} 