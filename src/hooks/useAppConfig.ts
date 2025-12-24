'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useAppConfig() {
  const { config, isLoading } = useSelector((state: RootState) => state.config);

  return {
    // Nom de l'application
    appName: config.appName || 'AliceBot',
    appTagline: config.appTagline || 'Application',

    // Couleurs
    primaryColor: config.primaryColor || '#3B82F6',
    secondaryColor: config.secondaryColor || '#10B981',
    accentColor: config.theme_colors?.accent || '#F59E0B',

    // Logos
    appLogo: config.appLogo,
    logoLight: config.logo_light,
    logoDark: config.logo_dark,

    // Support
    whatsappSupport: config.whatsapp_support,
    emailSupport: config.email_support,

    // Limites
    minDeposit: config.min_deposit || 500,
    minWithdrawal: config.min_withdrawal || 1000,

    // État
    isLoading,
    config, // Config complète si besoin
  };
}
