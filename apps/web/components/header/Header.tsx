'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, Settings, User, Command } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownItem, Badge, Input } from '@ui';

interface HeaderProps {
  user: {
    name: string;
    avatar_url?: string;
    email?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notifications] = useState([
    { id: '1', title: 'New task assigned', message: 'You have been assigned to "Design Review"', time: '5m ago', read: false },
    { id: '2', title: 'Project updated', message: 'Project Alpha has been updated', time: '1h ago', read: false },
    { id: '3', title: 'Message received', message: 'New message in #general', time: '2h ago', read: true },
    { id: '4', title: 'Event reminder', message: 'Team standup in 15 minutes', time: '3h ago', read: true }
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  const supabase = supabaseBrowser();
  const unreadCount = notifications.filter(n => !n.read).length;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Global search functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement actual search functionality
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    console.log('Marking notification as read:', notificationId);
    // TODO: Implement mark as read functionality
  };

  const markAllNotificationsAsRead = () => {
    console.log('Marking all notifications as read');
    // TODO: Implement mark all as read functionality
  };

  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800"
    >
      {/* Search Section */}
      <div className="flex-1 max-w-2xl" ref={searchRef}>
        <div className="relative">
          {showSearch ? (
            <form onSubmit={handleSearch} className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, tasks, messages..."
                className="w-full pl-10 pr-4"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  <div className="p-3">
                    <div className="text-sm text-gray-500 mb-2">Search results for &ldquo;{searchQuery}&rdquo;</div>
                    <div className="space-y-2">
                      <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <div className="font-medium text-gray-900 dark:text-gray-100">Project Alpha</div>
                        <div className="text-sm text-gray-500">Active project in Engineering</div>
                      </div>
                      <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <div className="font-medium text-gray-900 dark:text-gray-100">Design Review Task</div>
                        <div className="text-sm text-gray-500">Task in Project Alpha</div>
                      </div>
                      <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <div className="font-medium text-gray-900 dark:text-gray-100">#general</div>
                        <div className="text-sm text-gray-500">Channel in workspace</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center w-full max-w-md rounded-md border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-3 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              Search...
              <div className="ml-auto flex items-center space-x-1">
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                  <Command className="h-3 w-3 inline mr-1" />
                  K
                </kbd>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Dropdown
          trigger={
            <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="danger"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </button>
          }
          align="right"
          className="w-80"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${notification.read ? 'border-transparent' : 'border-indigo-500'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">{notification.time}</span>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 ml-auto"></div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-sm text-center text-indigo-600 hover:text-indigo-700">
              View all notifications
            </button>
          </div>
        </Dropdown>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User Menu */}
        <Dropdown
          trigger={
            <button className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Image
                src={user.avatar_url ?? `https://i.pravatar.cc/150?u=${user.name}`}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={() => router.push('/settings')}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownItem>
          <DropdownItem onClick={() => router.push('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownItem>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          <DropdownItem onClick={signOut} className="text-red-600 dark:text-red-400">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
} 