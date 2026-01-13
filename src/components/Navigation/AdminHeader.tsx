'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  User,
  MessageSquare
} from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';
import { AdminNotificationPanel } from '@/components/Notifications/AdminNotificationPanel';

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.chat);
  const { appName, appLogo } = useAppConfig();
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Demandes', href: '/admin/demandes', icon: FileText },
    { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users, superAdminOnly: true },
    { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center gap-4">
          {/* Logo - Plus d'espace */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 hover:opacity-80 transition min-w-0"
            >
              {appLogo ? (
                <img src={appLogo} alt={appName} className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-lg font-bold text-primary whitespace-nowrap">{appName}</span>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1 flex-1 justify-center">
            {navigation
              .filter(item => !item.superAdminOnly || user?.isSuperAdmin)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const showBadge = item.href === '/admin/chat' && unreadCount > 0;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 relative
                      ${active
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Notifications */}
            <button
              onClick={() => setNotificationPanelOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500">Administrateur</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation - Icons Only */}
          <div className="flex md:hidden items-center gap-1">
            {navigation
              .filter(item => !item.superAdminOnly || user?.isSuperAdmin)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const showBadge = item.href === '/admin/chat' && unreadCount > 0;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`p-2.5 rounded-lg transition relative ${
                      active
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={item.name}
                  >
                    <Icon className="h-5 w-5" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}

            {/* Notifications Mobile */}
            <button
              onClick={() => setNotificationPanelOpen(true)}
              className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout Mobile */}
            <button
              onClick={handleLogout}
              className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      <AdminNotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </header>
  );
}
