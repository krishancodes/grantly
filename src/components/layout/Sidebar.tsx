import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, Search, FileText, Bookmark,
  MessageSquare, User, Settings, X, GraduationCap
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/applications', label: 'My Applications', icon: FileText },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
];

const BOTTOM_ITEMS = [
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-60 bg-white border-r border-border z-40 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:z-20',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-main-text tracking-tight text-base">Grantly</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-secondary-text hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="mb-1">
            <p className="px-3 mb-2 text-xs font-medium text-secondary-text uppercase tracking-wider">Menu</p>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-secondary-text hover:bg-gray-50 hover:text-main-text'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-primary' : 'text-secondary-text group-hover:text-main-text')} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-border py-4 px-3 flex-shrink-0">
          {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-primary-light text-primary'
                    : 'text-secondary-text hover:bg-gray-50 hover:text-main-text'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-primary' : 'text-secondary-text group-hover:text-main-text')} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
