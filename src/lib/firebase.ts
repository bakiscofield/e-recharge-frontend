'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

/**
 * Configuration Firebase Cloud Messaging
 * Les credentials sont chargés depuis les variables d'environnement
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialiser Firebase (singleton)
let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    // Ne pas initialiser côté serveur (Next.js SSR)
    return null;
  }

  if (!firebaseApp) {
    // Vérifier si Firebase est déjà initialisé
    const apps = getApps();
    if (apps.length > 0) {
      firebaseApp = apps[0];
    } else {
      // Vérifier que toutes les variables sont présentes
      if (
        !firebaseConfig.apiKey ||
        !firebaseConfig.authDomain ||
        !firebaseConfig.projectId
      ) {
        console.warn('⚠️  Firebase configuration incomplete. FCM disabled.');
        return null;
      }

      firebaseApp = initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized');
    }
  }

  return firebaseApp;
}

/**
 * Récupérer l'instance Firebase Messaging
 * @returns Instance de Firebase Messaging ou null
 */
export function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const app = getFirebaseApp();
    if (!app) return null;

    return getMessaging(app);
  } catch (error) {
    console.error('❌ Error getting Firebase Messaging:', error);
    return null;
  }
}

/**
 * Récupérer le token FCM (Firebase Cloud Messaging)
 * @returns Promise<string | null> Token FCM ou null si erreur
 */
export async function getFcmToken(): Promise<string | null> {
  try {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') {
      console.warn('⚠️  getFcmToken called on server side');
      return null;
    }

    // Vérifier la permission des notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('⚠️  Notification permission denied');
      return null;
    }

    const messaging = getMessagingInstance();
    if (!messaging) {
      console.warn('⚠️  Firebase Messaging not initialized');
      return null;
    }

    // Vérifier que la clé VAPID est configurée
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('❌ NEXT_PUBLIC_FIREBASE_VAPID_KEY not configured');
      return null;
    }

    // Vérifier si un service worker est enregistré
    if (!('serviceWorker' in navigator)) {
      console.error('❌ Service Worker not supported');
      return null;
    }

    // Attendre que le service worker soit prêt
    console.log('⏳ Waiting for service worker to be ready...');
    const registration = await navigator.serviceWorker.ready;

    // Vérifier que le service worker est bien actif
    if (!registration.active) {
      console.error('❌ Service Worker not active');
      return null;
    }

    console.log('✅ Service Worker ready:', registration.active.scriptURL);

    // Attendre un peu plus pour s'assurer que Firebase est bien chargé dans le SW
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer le token FCM avec le service worker principal sw.js
    console.log('🔑 Requesting FCM token...');
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('✅ FCM token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('⚠️  No FCM token obtained');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

/**
 * Écouter les messages FCM en foreground (app ouverte)
 * @param callback Fonction à appeler quand un message est reçu
 * @returns Fonction pour se désabonner
 */
export function onForegroundMessage(
  callback: (payload: any) => void,
): (() => void) | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const messaging = getMessagingInstance();
    if (!messaging) {
      return null;
    }

    // Écouter les messages en foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📬 FCM foreground message received:', payload);
      callback(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up foreground message listener:', error);
    return null;
  }
}

/**
 * Vérifier si Firebase est correctement configuré
 * @returns boolean
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  );
}

/**
 * Vérifier si les notifications sont supportées
 * @returns boolean
 */
export function areNotificationsSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator
  );
}
