'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import {
  LayoutDashboard,
  Users,
  Link as LinkIcon,
  Settings,
  Palette,
  LogOut,
  Menu,
  X,
  Bell,
  Crown,
  UserCog,
  MessageSquare,
  Megaphone,
  Gift,
  Gamepad2,
  Mail
} from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';

export function SuperAdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.chat);
  const { appName, appLogo } = useAppConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { name: 'Assignations', href: '/super-admin/agent-assignments', icon: LinkIcon },
    { name: 'Bookmakers', href: '/super-admin/bookmakers', icon: Gamepad2 },
    { name: 'Configuration', href: '/super-admin/configuration', icon: Settings },
    { name: 'Parrainage', href: '/super-admin/configuration-parrainage', icon: Gift },
    { name: 'Newsletters', href: '/super-admin/newsletters', icon: Mail },
    { name: 'Thème', href: '/super-admin/theme-configurator', icon: Palette },
    { name: 'Annonces', href: '/super-admin/annonces', icon: Megaphone },
    { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/super-admin') {
      return pathname === '/super-admin';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/super-admin')}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              {appLogo ? (
                <>
                  <img src={appLogo} alt={appName} className="h-8 sm:h-10 w-auto object-contain" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-500">Super Admin</span>
                </>
              ) : (
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {appName} <span className="hidden sm:inline text-sm font-normal text-gray-500">Super Admin</span>
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => {
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
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500">Super Administrateur</div>
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

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition"
            >
              {mobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const showBadge = item.href === '/admin/chat' && unreadCount > 0;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full px-5 py-4 rounded-xl font-semibold text-base transition-all flex items-center gap-4 active:scale-95 relative
                    ${active
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                    }
                  `}
                >
                  <Icon className="h-6 w-6" />
                  {item.name}
                  {showBadge && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-5 py-4 rounded-xl font-semibold text-base text-red-600 hover:bg-red-50 active:bg-red-100 transition flex items-center gap-4 active:scale-95"
              >
                <LogOut className="h-6 w-6" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
