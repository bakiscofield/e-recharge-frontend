'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  getFcmToken,
  onForegroundMessage,
  areNotificationsSupported,
  isFirebaseConfigured,
} from '@/lib/firebase';
import toast from 'react-hot-toast';

/**
 * Hook personnalisé pour gérer les notifications Firebase Cloud Messaging (FCM)
 *
 * Fonctionnalités :
 * - Demande la permission des notifications
 * - Récupère le token FCM
 * - Envoie le token au backend
 * - Écoute les messages en foreground
 * - Affiche des toasts pour les notifications
 */
export function useFcmNotifications() {
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useRef(false);

  useEffect(() => {
    // Ne rien faire si l'utilisateur n'est pas connecté
    if (!user) {
      return;
    }

    // Ne rien faire si déjà initialisé
    if (initialized.current) {
      return;
    }

    // Désactiver FCM uniquement sur localhost (problèmes avec push service)
    // Sur production (HTTPS) et sur APK mobile, FCM fonctionnera correctement
    const isLocalhost = typeof window !== 'undefined' &&
                       (window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1');

    if (isLocalhost) {
      console.log('ℹ️  FCM désactivé sur localhost - Notifications via BD uniquement');
      console.log('✅ FCM sera actif sur production/mobile (HTTPS)');
      initialized.current = true;
      return;
    }

    // Vérifier que les notifications sont supportées
    if (!areNotificationsSupported()) {
      console.warn('⚠️  Notifications not supported on this browser');
      return;
    }

    // Vérifier que Firebase est configuré
    if (!isFirebaseConfigured()) {
      console.warn('⚠️  Firebase not configured');
      return;
    }

    // Fonction d'initialisation FCM
    const initFcm = async () => {
      try {
        console.log('📱 Initializing FCM...');

        // 1. Vérifier la permission actuelle
        let permission = Notification.permission;

        // Si la permission n'a pas encore été demandée, demander maintenant
        if (permission === 'default') {
          console.log('🔔 Requesting notification permission...');
          permission = await Notification.requestPermission();
        }

        if (permission !== 'granted') {
          console.log('⚠️  Notification permission denied');
          return;
        }

        console.log('✅ Notification permission granted');

        // 2. Récupérer le token FCM
        const token = await getFcmToken();

        if (!token) {
          console.warn('⚠️  No FCM token obtained');
          return;
        }

        console.log('✅ FCM token obtained');

        // 3. Envoyer le token au backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error('❌ NEXT_PUBLIC_API_URL not configured');
          return;
        }

        // Récupérer le token JWT depuis le localStorage
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.warn('⚠️  No auth token found');
          return;
        }

        // Générer ou récupérer un deviceId unique
        const deviceId = getDeviceId();

        const response = await fetch(`${apiUrl}/notifications/subscribe-fcm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            token,
            deviceType: 'WEB',
            deviceId,
            userAgent: navigator.userAgent,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to subscribe FCM: ${response.statusText}`);
        }

        console.log('✅ FCM token registered with backend');

        // 4. Écouter les messages en foreground
        const unsubscribe = onForegroundMessage((payload) => {
          console.log('📬 Foreground message received:', payload);

          // Afficher un toast pour les notifications en foreground
          const title =
            payload.notification?.title || payload.data?.title || 'AliceBot';
          const body =
            payload.notification?.body ||
            payload.data?.body ||
            'Nouvelle notification';
          const url = payload.data?.url || payload.fcmOptions?.link || '/';

          // Afficher un toast cliquable
          toast(
            (t) => (
              <div
                onClick={() => {
                  if (url) {
                    window.location.href = url;
                  }
                  toast.dismiss(t.id);
                }}
                className="cursor-pointer"
              >
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-gray-600">{body}</div>
                <div className="text-xs text-blue-600 mt-1">Cliquer pour ouvrir</div>
              </div>
            ),
            {
              duration: 5000,
              icon: '🔔',
              position: 'top-right',
            }
          );
        });

        // Nettoyer l'écouteur au démontage
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('❌ Error initializing FCM:', error);
      }
    };

    // Marquer comme initialisé et lancer l'initialisation
    initialized.current = true;
    initFcm();

    // Nettoyer au démontage
    return () => {
      initialized.current = false;
    };
  }, [user]);
}

/**
 * Générer ou récupérer un deviceId unique pour ce navigateur
 * @returns string Device ID unique
 */
function getDeviceId(): string {
  const storageKey = 'fcm_device_id';

  // Vérifier si un deviceId existe déjà
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    // Générer un nouveau deviceId (UUID v4 simplifié)
    deviceId = generateUUID();
    localStorage.setItem(storageKey, deviceId);
    console.log('✅ Generated new device ID:', deviceId);
  }

  return deviceId;
}

/**
 * Générer un UUID v4 simple
 * @returns string UUID
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback pour les navigateurs plus anciens
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
