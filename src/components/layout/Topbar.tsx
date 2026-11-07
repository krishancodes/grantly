import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, ChevronDown, User, Settings, LogOut, Check, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getNotifications, markNotificationRead, markAllRead } from '../../lib/storage';
import { Notification } from '../../types';
import { getProfile } from '../../lib/storage';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/explore': 'Explore Scholarships',
  '/applications': 'My Applications',
  '/saved': 'Saved Scholarships',
  '/assistant': 'AI Assistant',
  '/profile': 'My Profile',
  '/settings': 'Settings',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const notifTypeColors: Record<string, string> = {
  match: 'bg-primary-light text-primary',
  deadline: 'bg-orange-50 text-warning',
  tip: 'bg-green-50 text-success',
  status: 'bg-gray-100 text-secondary-text',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());
  const profile = getProfile();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const title = PAGE_TITLES[location.pathname] ?? 'Grantly';
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleMarkRead(id: string) {
    markNotificationRead(id);
    setNotifications(getNotifications());
  }

  function handleMarkAll() {
    markAllRead();
    setNotifications(getNotifications());
  }

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 sticky top-0 z-10">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-secondary-text hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <h1 className="text-base font-semibold text-main-text hidden sm:block">{title}</h1>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
          className="relative p-2 rounded-lg text-secondary-text hover:bg-gray-100 hover:text-main-text transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-border shadow-dropdown z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-main-text">Notifications</span>
              {unread > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">Mark all read</button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-secondary-text">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n.id)}
                    className={cn('flex gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-gray-50 transition-colors', !n.read && 'bg-primary-light/30')}
                  >
                    <div className={cn('mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold', notifTypeColors[n.type])}>
                      {n.type === 'match' ? <Zap className="w-3.5 h-3.5" /> : n.type === 'deadline' ? '!' : n.type === 'tip' ? '💡' : <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-main-text leading-tight">{n.title}</p>
                      <p className="text-xs text-secondary-text mt-0.5 leading-tight">{n.message}</p>
                      <p className="text-xs text-secondary-text mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">{profile.name.charAt(0)}</span>
          </div>
          <span className="text-sm font-medium text-main-text hidden md:block">{profile.name.split(' ')[0]}</span>
          <ChevronDown className="w-4 h-4 text-secondary-text hidden md:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-border shadow-dropdown z-50">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-main-text">{profile.name}</p>
              <p className="text-xs text-secondary-text truncate">{profile.email}</p>
            </div>
            <div className="py-1.5">
              <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-main-text hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4 text-secondary-text" /> My Profile
              </button>
              <button onClick={() => { navigate('/settings'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-main-text hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-secondary-text" /> Settings
              </button>
            </div>
            <div className="border-t border-border py-1.5">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
