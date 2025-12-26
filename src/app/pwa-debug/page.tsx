'use client';

import { useEffect, useState } from 'react';
import { PWAUtils } from '@/lib/pwa-utils';
import {
  RefreshCw,
  Trash2,
  Info,
  Wifi,
  WifiOff,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface AppInfo {
  serviceWorker: {
    registered: boolean;
    active: boolean;
    waiting: boolean;
    installing: boolean;
    version?: string;
  };
  cache: {
    static: number;
    dynamic: number;
    images: number;
    api: number;
    total: number;
  } | null;
  network: {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
  platform: {
    isStandalone: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isInstallable: boolean;
  };
  notifications: {
    permission: NotificationPermission;
  };
}

export default function PWADebugPage() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearingCache, setClearingCache] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadAppInfo = async () => {
    setLoading(true);
    const info = await PWAUtils.getAppInfo();
    setAppInfo(info as AppInfo);
    setLoading(false);
  };

  useEffect(() => {
    loadAppInfo();
  }, []);

  const handleClearCache = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider tous les caches ?')) {
      return;
    }

    setClearingCache(true);
    const success = await PWAUtils.clearAllCaches();

    if (success) {
      alert('Cache vidé avec succès. La page va se recharger.');
      window.location.reload();
    } else {
      alert('Erreur lors du vidage du cache');
    }

    setClearingCache(false);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    const success = await PWAUtils.updateServiceWorker();

    if (success) {
      alert('Vérification des mises à jour...');
      setTimeout(() => loadAppInfo(), 2000);
    } else {
      alert('Erreur lors de la vérification des mises à jour');
    }

    setUpdating(false);
  };

  const handleRequestNotificationPermission = async () => {
    const permission = await PWAUtils.requestNotificationPermission();
    alert(`Permission notifications: ${permission}`);
    loadAppInfo();
  };

  const handleTestNotification = async () => {
    const success = await PWAUtils.showNotification('Test AliceBot', {
      body: 'Ceci est une notification de test',
      icon: '/icons/icon-192x192.png',
    });

    if (!success) {
      alert('Impossible d\'afficher la notification. Vérifiez les permissions.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!appInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Impossible de charger les informations PWA
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            PWA Debug & Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Informations détaillées sur votre Progressive Web App
          </p>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => loadAppInfo()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {updating ? 'Vérification...' : 'Vérifier mises à jour'}
            </button>
            <button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {clearingCache ? 'Vidage...' : 'Vider cache'}
            </button>
          </div>
        </div>

        {/* Service Worker */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Service Worker
          </h2>
          <div className="space-y-3">
            <InfoRow
              label="Enregistré"
              value={appInfo.serviceWorker.registered}
              type="boolean"
            />
            <InfoRow
              label="Actif"
              value={appInfo.serviceWorker.active}
              type="boolean"
            />
            <InfoRow
              label="En attente"
              value={appInfo.serviceWorker.waiting}
              type="boolean"
            />
            <InfoRow
              label="Installation en cours"
              value={appInfo.serviceWorker.installing}
              type="boolean"
            />
            {appInfo.serviceWorker.version && (
              <InfoRow label="Version" value={appInfo.serviceWorker.version} />
            )}
          </div>
        </div>

        {/* Cache */}
        {appInfo.cache && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cache Storage
            </h2>
            <div className="space-y-3">
              <InfoRow label="Cache statique" value={`${appInfo.cache.static} entrées`} />
              <InfoRow label="Cache dynamique" value={`${appInfo.cache.dynamic} entrées`} />
              <InfoRow label="Cache images" value={`${appInfo.cache.images} entrées`} />
              <InfoRow label="Cache API" value={`${appInfo.cache.api} entrées`} />
              <InfoRow
                label="Total"
                value={`${appInfo.cache.total} entrées`}
                highlight
              />
            </div>
          </div>
        )}

        {/* Réseau */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Réseau
          </h2>
          <div className="space-y-3">
            <InfoRow
              label="Statut"
              value={appInfo.network.online}
              type="boolean"
              icon={appInfo.network.online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            />
            {appInfo.network.effectiveType && (
              <InfoRow label="Type de connexion" value={appInfo.network.effectiveType} />
            )}
            {appInfo.network.downlink !== undefined && (
              <InfoRow label="Vitesse téléchargement" value={`${appInfo.network.downlink} Mbps`} />
            )}
            {appInfo.network.rtt !== undefined && (
              <InfoRow label="Latence (RTT)" value={`${appInfo.network.rtt} ms`} />
            )}
          </div>
        </div>

        {/* Plateforme */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Plateforme
          </h2>
          <div className="space-y-3">
            <InfoRow
              label="Mode standalone"
              value={appInfo.platform.isStandalone}
              type="boolean"
            />
            <InfoRow
              label="Installable"
              value={appInfo.platform.isInstallable}
              type="boolean"
            />
            <InfoRow label="iOS" value={appInfo.platform.isIOS} type="boolean" />
            <InfoRow label="Android" value={appInfo.platform.isAndroid} type="boolean" />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Notifications
          </h2>
          <div className="space-y-3">
            <InfoRow
              label="Permission"
              value={appInfo.notifications.permission}
              badge
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRequestNotificationPermission}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
              >
                Demander permission
              </button>
              <button
                onClick={handleTestNotification}
                disabled={appInfo.notifications.permission !== 'granted'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm disabled:opacity-50"
              >
                Tester notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  type,
  icon,
  highlight,
  badge,
}: {
  label: string;
  value: any;
  type?: 'boolean' | 'string';
  icon?: React.ReactNode;
  highlight?: boolean;
  badge?: boolean;
}) {
  const displayValue = () => {
    if (type === 'boolean') {
      return value ? (
        <span className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          Oui
        </span>
      ) : (
        <span className="flex items-center gap-2 text-red-600">
          <XCircle className="w-4 h-4" />
          Non
        </span>
      );
    }

    if (badge) {
      const colorClass =
        value === 'granted'
          ? 'bg-green-100 text-green-800'
          : value === 'denied'
          ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800';

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {value}
        </span>
      );
    }

    return value;
  };

  return (
    <div
      className={`flex justify-between items-center py-2 ${
        highlight ? 'font-semibold border-t-2 border-blue-500 pt-4' : ''
      }`}
    >
      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-gray-900 dark:text-white">{displayValue()}</span>
    </div>
  );
}
