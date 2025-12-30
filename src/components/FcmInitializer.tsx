'use client';

import { useFcmNotifications } from '@/hooks/useFcmNotifications';

/**
 * Composant FcmInitializer
 *
 * Ce composant initialise les notifications Firebase Cloud Messaging (FCM)
 * au chargement de l'application. Il doit être monté dans le layout principal.
 *
 * Fonctionnalités :
 * - Initialise FCM automatiquement quand l'utilisateur est connecté
 * - Demande la permission des notifications
 * - Enregistre le token FCM auprès du backend
 * - Écoute les notifications en foreground
 *
 * Usage :
 * ```tsx
 * import { FcmInitializer } from '@/components/FcmInitializer';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <FcmInitializer />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function FcmInitializer() {
  // Appeler le hook pour initialiser FCM
  useFcmNotifications();

  // Ce composant ne rend rien (invisible)
  return null;
}
