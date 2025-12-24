'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const { config } = useSelector((state: RootState) => state.config);

  useEffect(() => {
    if (!config || Object.keys(config).length === 0) return;

    console.log('📱 Application de la configuration:', config);

    // 1. Appliquer le nom de l'application
    if (config.appName) {
      document.title = `${config.appName} - ${config.appTagline || 'App'}`;
      console.log(`✅ Titre: ${config.appName}`);
    }

    // 2. Appliquer les couleurs via CSS Variables
    const root = document.documentElement;

    if (config.primaryColor) {
      root.style.setProperty('--color-primary', config.primaryColor);
      console.log(`🎨 Couleur primaire: ${config.primaryColor}`);
    }

    if (config.secondaryColor) {
      root.style.setProperty('--color-secondary', config.secondaryColor);
      console.log(`🎨 Couleur secondaire: ${config.secondaryColor}`);
    }

    // Couleurs du thème (si présentes)
    if (config.theme_colors) {
      root.style.setProperty('--color-accent', config.theme_colors.accent || '#F59E0B');
      root.style.setProperty('--color-background', config.theme_colors.background || '#FFFFFF');
      root.style.setProperty('--color-text', config.theme_colors.text || '#1F2937');
    }

    // 3. Mettre à jour la meta theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', config.primaryColor || '#3B82F6');

    // 4. Mettre à jour les meta Open Graph si besoin
    updateMetaTag('og:title', config.appName || 'AliceBot');
    updateMetaTag('og:description', config.appTagline || 'Application');

    console.log('✅ Configuration appliquée avec succès');
  }, [config]);

  return <>{children}</>;
}

function updateMetaTag(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}
