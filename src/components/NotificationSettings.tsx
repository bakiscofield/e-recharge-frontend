'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { areNotificationsSupported, isFirebaseConfigured } from '@/lib/firebase';
import toast from 'react-hot-toast';

/**
 * Composant NotificationSettings
 *
 * Permet aux utilisateurs de :
 * - Voir l'état des notifications (activées/désactivées)
 * - Activer/désactiver les notifications
 * - Envoyer une notification de test
 */
export function NotificationSettings() {
  const user = useAppSelector((state) => state.auth.user);
  const [isSending, setIsSending] = useState(false);

  // Vérifier si les notifications sont supportées
  const notificationsSupported = areNotificationsSupported();
  const firebaseConfigured = isFirebaseConfigured();

  // Vérifier l'état actuel de la permission
  const permission = typeof window !== 'undefined' ? Notification.permission : 'default';

  const handleEnableNotifications = async () => {
    try {
      if (!notificationsSupported) {
        toast.error('Les notifications ne sont pas supportées sur ce navigateur');
        return;
      }

      if (!firebaseConfigured) {
        toast.error('Firebase n\'est pas configuré');
        return;
      }

      const result = await Notification.requestPermission();

      if (result === 'granted') {
        toast.success('Notifications activées ! Rechargez la page pour finaliser.');
        // Recharger la page pour réinitialiser le hook FCM
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Permission refusée. Activez les notifications dans les paramètres du navigateur.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Erreur lors de l\'activation des notifications');
    }
  };

  const handleSendTestNotification = async () => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setIsSending(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const authToken = localStorage.getItem('token');

      if (!apiUrl || !authToken) {
        toast.error('Configuration manquante');
        return;
      }

      const response = await fetch(`${apiUrl}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: '🧪 Test de notification',
          body: `Test envoyé à ${new Date().toLocaleTimeString('fr-FR')}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'envoi');
      }

      toast.success('Notification de test envoyée ! Vérifiez vos notifications.');
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de la notification de test');
    } finally {
      setIsSending(false);
    }
  };

  if (!notificationsSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Notifications non supportées
        </h3>
        <p className="text-sm text-yellow-700">
          Votre navigateur ne supporte pas les notifications push.
        </p>
      </div>
    );
  }

  if (!firebaseConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Firebase non configuré
        </h3>
        <p className="text-sm text-yellow-700">
          Firebase Cloud Messaging n'est pas correctement configuré.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Paramètres de notifications
        </h3>
        <p className="text-sm text-gray-600">
          Gérez vos préférences de notifications push
        </p>
      </div>

      <div className="space-y-3">
        {/* État actuel */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">État des notifications</p>
            <p className="text-sm text-gray-600">
              {permission === 'granted' && '✅ Activées'}
              {permission === 'denied' && '❌ Refusées'}
              {permission === 'default' && '⚠️ Non configurées'}
            </p>
          </div>

          {permission !== 'granted' && (
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Activer
            </button>
          )}
        </div>

        {/* Bouton de test */}
        {permission === 'granted' && user?.isSuperAdmin && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="font-medium text-blue-900">Test de notification</p>
              <p className="text-sm text-blue-700">
                Envoyer une notification de test pour vérifier le bon fonctionnement
              </p>
            </div>

            <button
              onClick={handleSendTestNotification}
              disabled={isSending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Envoi...' : 'Tester'}
            </button>
          </div>
        )}

        {/* Informations supplémentaires */}
        {permission === 'denied' && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              Les notifications ont été refusées. Pour les activer, veuillez :
            </p>
            <ol className="mt-2 text-sm text-red-700 list-decimal list-inside space-y-1">
              <li>Cliquez sur l'icône 🔒 dans la barre d'adresse</li>
              <li>Trouvez "Notifications" dans les paramètres</li>
              <li>Changez l'option en "Autoriser"</li>
              <li>Rechargez la page</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
