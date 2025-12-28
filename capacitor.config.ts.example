import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alicebot.app',
  appName: 'AliceBot',
  webDir: 'out',

  // ⚠️ IMPORTANT: Changez cette URL par l'URL de votre site déployé en production
  // Exemple: 'https://alicebot.example.com'
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'http://localhost:3000',
    cleartext: true, // Permet HTTP (à désactiver en production avec HTTPS)
  },

  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      spinnerColor: '#999999',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
