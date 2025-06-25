'use client';

import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface ProtectedLayoutClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
  };
  initialWorkspaces: Array<{
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    userRole?: string;
  }>;
  initialCurrentWorkspace: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    userRole?: string;
  } | null;
  children: React.ReactNode;
}

export default function ProtectedLayoutClient({
  user,
  initialWorkspaces,
  initialCurrentWorkspace,
  children
}: ProtectedLayoutClientProps) {
  const { dispatch } = useApp();

  useEffect(() => {
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_WORKSPACES', payload: initialWorkspaces });

    let workspace = initialCurrentWorkspace;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentWorkspace');
      if (stored) {
        try {
          workspace = JSON.parse(stored);
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    if (workspace) {
      dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace });
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
      }
    }
  }, [dispatch, user, initialWorkspaces, initialCurrentWorkspace]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[368px]"> {/* 80px + 288px */}
        <Header user={user} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
