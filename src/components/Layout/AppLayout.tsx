'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useAppConfig } from '@/hooks/useAppConfig';
import FallingSymbols from '@/components/Animations/FallingSymbols';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import api from '@/lib/api';
import type { ThemeConfig } from '@/types/shared';
import {
  Home,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Gift,
  CreditCard,
  Info,
  MessageCircle,
  Bell,
  LogOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const { unreadCount: chatUnreadCount } = useSelector((state: RootState) => state.chat);
  const { appName, appLogo } = useAppConfig();
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const applyTheme = (theme: any) => {
    if (!theme) return;

    const root = document.documentElement;

    // Couleurs
    if (theme.primaryColor) root.style.setProperty('--theme-primary', theme.primaryColor);
    if (theme.secondaryColor) root.style.setProperty('--theme-secondary', theme.secondaryColor);
    if (theme.accentColor) root.style.setProperty('--theme-accent', theme.accentColor);
    if (theme.backgroundColor) root.style.setProperty('--theme-background', theme.backgroundColor);
    if (theme.surfaceColor) root.style.setProperty('--theme-surface', theme.surfaceColor);
    if (theme.textColor) root.style.setProperty('--theme-text', theme.textColor);

    // Effets
    if (theme.glowIntensity) root.style.setProperty('--theme-glow-intensity', theme.glowIntensity.toString());
    if (theme.animationSpeed) root.style.setProperty('--theme-animation-speed', theme.animationSpeed.toString());
    if (theme.moneyColor) root.style.setProperty('--theme-money-color', theme.moneyColor);

    console.log('🎨 Thème appliqué:', theme);
  };

  const fetchTheme = async () => {
    try {
      const response = await api.get('/theme/active');
      const theme = response.data;

      // Vérifier si le thème a changé
      const themeChanged = JSON.stringify(theme) !== JSON.stringify(themeConfig);

      if (themeChanged) {
        console.log('🔄 Nouveau thème détecté, application...');
        setThemeConfig(theme);
        applyTheme(theme);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    }
  };

  // Charger le thème initial
  useEffect(() => {
    if (token) {
      fetchTheme();
    }
  }, [token]);

  // Rafraîchir le thème automatiquement toutes les 5 secondes
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchTheme();
    }, 5000); // Vérifier les changements toutes les 5 secondes

    return () => clearInterval(interval);
  }, [token, themeConfig]);

  // Rafraîchir le thème quand la fenêtre redevient visible
  useEffect(() => {
    if (!token) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Fenêtre visible, vérification du thème...');
        fetchTheme();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token]);

  // Écouter les événements de mise à jour du thème
  useEffect(() => {
    if (!token) return;

    const handleThemeUpdate = () => {
      console.log('⚡ Événement theme-updated reçu, rafraîchissement immédiat...');
      fetchTheme();
    };

    window.addEventListener('theme-updated', handleThemeUpdate);

    return () => {
      window.removeEventListener('theme-updated', handleThemeUpdate);
    };
  }, [token]);

  const navItems = [
    { icon: ArrowDownCircle, label: 'Dépôt', path: '/depot' },
    { icon: ArrowUpCircle, label: 'Retrait', path: '/retrait' },
    { icon: History, label: 'Historique', path: '/historique' },
    { icon: Gift, label: 'Parrainage', path: '/parrainage' },
    { icon: CreditCard, label: 'Mes IDs', path: '/mes-ids' },
    { icon: Info, label: 'Infos', path: '/informations' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Arrière-plan dynamique */}
      {themeConfig?.clientBackgroundType === 'image' && themeConfig?.clientBackgroundImage ? (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${themeConfig.clientBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // Sur mobile, on utilise scroll au lieu de fixed pour de meilleures performances
            backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll',
          }}
        />
      ) : themeConfig?.particlesEnabled !== false ? (
        <FallingSymbols themeConfig={themeConfig} />
      ) : null}

      {/* Annonce Modal */}
      <AnnouncementModal />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {appLogo ? (
                <img src={appLogo} alt={appName} className="h-10 w-auto object-contain" />
              ) : (
                <h1 className="text-xl font-bold text-primary">{appName}</h1>
              )}
              <div>
                <p className="text-xs text-gray-600 font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/chat')}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <MessageCircle className="h-6 w-6 text-gray-700" />
                {chatUnreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push('/notifications')}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Bell className="h-6 w-6 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <LogOut className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 relative z-1">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-20">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition touch-manipulation ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
