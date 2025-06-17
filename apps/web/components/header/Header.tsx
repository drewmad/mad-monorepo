'use client';
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useSidebar } from '../sidebar/context';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function Header({ user }: { user: { name: string; avatar_url?: string } }) {
  const { theme, setTheme } = useTheme();
  const { expanded } = useSidebar();
  const router = useRouter();

  const supabase = supabaseBrowser();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header
      className={`flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 ${
        expanded ? 'ml-64' : 'ml-20'
      } transition-all`}
    >
      <div className="flex-1">
        <div className="relative max-w-md">
          <input
            className="w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search..."
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2">
            <Image
              src={user.avatar_url ?? `https://i.pravatar.cc/150?u=${user.name}`}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          {/* simple dropdown */}
          <div className="invisible absolute right-0 mt-2 w-48 rounded-md bg-white p-2 text-sm shadow-lg group-hover:visible dark:bg-gray-700">
            <button
              className="flex w-full items-center space-x-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => router.push('/settings/profile')}
            >
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </button>
            <button
              className="flex w-full items-center space-x-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 