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
  Mail,
  Info,
  Ticket,
} from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';
import { AdminNotificationPanel } from '@/components/Notifications/AdminNotificationPanel';

export function SuperAdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.chat);
  const { appName, appLogo } = useAppConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/super-admin/users', icon: Users },
    { name: 'Assignations', href: '/super-admin/agent-assignments', icon: LinkIcon },
    { name: 'Bookmakers', href: '/super-admin/bookmakers', icon: Gamepad2 },
    { name: 'Configuration', href: '/super-admin/configuration', icon: Settings },
    { name: 'Parrainage', href: '/super-admin/configuration-parrainage', icon: Gift },
    { name: 'Retraits Promo', href: '/super-admin/referral-withdrawals', icon: Gift },
    { name: 'Newsletters', href: '/super-admin/newsletters', icon: Mail },
    { name: 'Thème', href: '/super-admin/theme-configurator', icon: Palette },
    { name: 'Page Info', href: '/super-admin/info-page', icon: Info },
    { name: 'Annonces', href: '/super-admin/annonces', icon: Megaphone },
    { name: 'Coupons', href: '/super-admin/coupons', icon: Ticket },
    { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  ];

  // Items principaux à afficher dans le header desktop (5 éléments)
  const primaryNavigation = navigation.slice(0, 5);
  const secondaryNavigation = navigation.slice(5);

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
      <nav className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 justify-between items-center gap-2 max-w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => router.push('/super-admin')}
              className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition"
            >
              {appLogo ? (
                <>
                  <img src={appLogo} alt={appName} className="h-7 sm:h-8 lg:h-10 w-auto object-contain" />
                  <span className="hidden lg:inline text-xs sm:text-sm font-medium text-gray-500">Super Admin</span>
                </>
              ) : (
                <span className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                  {appName} <span className="hidden lg:inline text-xs sm:text-sm font-normal text-gray-500">Super Admin</span>
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navigation - 5 éléments principaux + Menu Plus */}
          <div className="hidden md:flex md:items-center md:gap-2 lg:gap-3 flex-1 justify-center">
            {primaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const showBadge = item.href === '/admin/chat' && unreadCount > 0;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`
                    px-3 md:px-4 lg:px-5 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 relative flex-shrink-0
                    ${active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name}</span>
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Menu Plus pour les autres éléments */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="px-3 md:px-4 lg:px-5 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 text-gray-700 hover:bg-gray-100 flex-shrink-0"
              >
                <Menu className="h-4 w-4" />
                <span>Plus</span>
              </button>

              {/* Dropdown Menu */}
              {moreMenuOpen && (
                <>
                  {/* Backdrop pour fermer le menu */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreMenuOpen(false)}
                  />

                  {/* Menu Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {secondaryNavigation.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const showBadge = item.href === '/admin/chat' && unreadCount > 0;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            router.push(item.href);
                            setMoreMenuOpen(false);
                          }}
                          className={`
                            w-full px-4 py-3 text-left flex items-center gap-3 relative transition-colors
                            ${active
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.name}</span>
                          {showBadge && (
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-2 lg:gap-3 flex-shrink-0">
            {/* Notifications */}
            <button
              onClick={() => setNotificationPanelOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
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
          <div className="flex md:hidden flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 sm:h-7 sm:w-7" />
              ) : (
                <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu - Tous les éléments */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
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
              {/* User Info */}
              <div className="px-5 py-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">Super Administrateur</div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
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

      {/* Notification Panel */}
      <AdminNotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </header>
  );
}
