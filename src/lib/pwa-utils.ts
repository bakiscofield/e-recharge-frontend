/**
 * PWA Utilities Library
 * Provides comprehensive utilities for Progressive Web App management
 */

export interface ServiceWorkerStatus {
  registered: boolean;
  active: boolean;
  waiting: boolean;
  installing: boolean;
  version?: string;
}

export interface CacheSizes {
  static: number;
  dynamic: number;
  images: number;
  api: number;
  total: number;
}

export class PWAUtils {
  /**
   * Check if Service Worker is supported
   */
  static isServiceWorkerSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }

  /**
   * Get the current Service Worker status
   */
  static async getServiceWorkerStatus(): Promise<ServiceWorkerStatus> {
    if (!this.isServiceWorkerSupported()) {
      return { registered: false, active: false, waiting: false, installing: false };
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();

      return {
        registered: !!registration,
        active: !!registration?.active,
        waiting: !!registration?.waiting,
        installing: !!registration?.installing,
      };
    } catch (error) {
      console.error('[PWA] Error getting SW status:', error);
      return { registered: false, active: false, waiting: false, installing: false };
    }
  }

  /**
   * Get the Service Worker version
   */
  static async getServiceWorkerVersion(): Promise<string | null> {
    if (!this.isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || null);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );

      // Timeout après 5 secondes
      setTimeout(() => resolve(null), 5000);
    });
  }

  /**
   * Get cache sizes for all cache categories
   */
  static async getCacheSizes(): Promise<CacheSizes | null> {
    if (!this.isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data as CacheSizes);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZES' },
        [messageChannel.port2]
      );

      // Timeout après 5 secondes
      setTimeout(() => resolve(null), 5000);
    });
  }

  /**
   * Clear all application caches
   */
  static async clearAllCaches(): Promise<boolean> {
    if (!this.isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );

      // Timeout après 10 secondes
      setTimeout(() => resolve(false), 10000);
    });
  }

  /**
   * Clear a specific cache by name
   */
  static async clearCacheByName(cacheName: string): Promise<boolean> {
    if (!this.isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE_BY_NAME', cacheName },
        [messageChannel.port2]
      );

      // Timeout après 5 secondes
      setTimeout(() => resolve(false), 5000);
    });
  }

  /**
   * Check if the app is installable as PWA
   */
  static isInstallable(): boolean {
    return typeof window !== 'undefined' && 'BeforeInstallPromptEvent' in window;
  }

  /**
   * Check if the app is running in standalone mode (installed PWA)
   */
  static isStandalone(): boolean {
    if (typeof window === 'undefined') return false;

    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  /**
   * Check if the app is running on iOS
   */
  static isIOS(): boolean {
    if (typeof window === 'undefined') return false;

    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  /**
   * Check if the app is running on Android
   */
  static isAndroid(): boolean {
    if (typeof window === 'undefined') return false;

    return /Android/.test(navigator.userAgent);
  }

  /**
   * Get the current network status
   */
  static getNetworkStatus(): {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  } {
    if (typeof window === 'undefined') {
      return { online: true };
    }

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    };
  }

  /**
   * Request notification permission
   */
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  /**
   * Show a notification
   */
  static async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    const permission = await this.requestNotificationPermission();

    if (permission !== 'granted') {
      return false;
    }

    try {
      if (this.isServiceWorkerSupported() && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
          await registration.showNotification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-96x96.png',
            ...options,
          });
          return true;
        }
      }

      // Fallback to regular notification
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        ...options,
      });
      return true;
    } catch (error) {
      console.error('[PWA] Error showing notification:', error);
      return false;
    }
  }

  /**
   * Request background sync (for offline operations)
   */
  static async requestBackgroundSync(tag: string): Promise<boolean> {
    if (!this.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      if ('sync' in registration) {
        await (registration as any).sync.register(tag);
        console.log('[PWA] Background sync registered:', tag);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[PWA] Error requesting background sync:', error);
      return false;
    }
  }

  /**
   * Request periodic background sync
   */
  static async requestPeriodicBackgroundSync(
    tag: string,
    minInterval: number
  ): Promise<boolean> {
    if (!this.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      if ('periodicSync' in registration) {
        await (registration as any).periodicSync.register(tag, {
          minInterval: minInterval,
        });
        console.log('[PWA] Periodic background sync registered:', tag);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[PWA] Error requesting periodic background sync:', error);
      return false;
    }
  }

  /**
   * Update the Service Worker
   */
  static async updateServiceWorker(): Promise<boolean> {
    if (!this.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration) {
        await registration.update();
        console.log('[PWA] Service Worker update initiated');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[PWA] Error updating Service Worker:', error);
      return false;
    }
  }

  /**
   * Unregister the Service Worker
   */
  static async unregisterServiceWorker(): Promise<boolean> {
    if (!this.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration) {
        await registration.unregister();
        console.log('[PWA] Service Worker unregistered');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[PWA] Error unregistering Service Worker:', error);
      return false;
    }
  }

  /**
   * Get app info and diagnostics
   */
  static async getAppInfo() {
    const swStatus = await this.getServiceWorkerStatus();
    const swVersion = await this.getServiceWorkerVersion();
    const cacheSizes = await this.getCacheSizes();
    const networkStatus = this.getNetworkStatus();

    return {
      serviceWorker: {
        ...swStatus,
        version: swVersion,
      },
      cache: cacheSizes,
      network: networkStatus,
      platform: {
        isStandalone: this.isStandalone(),
        isIOS: this.isIOS(),
        isAndroid: this.isAndroid(),
        isInstallable: this.isInstallable(),
      },
      notifications: {
        permission: typeof window !== 'undefined' && 'Notification' in window
          ? Notification.permission
          : 'denied',
      },
    };
  }
}

/**
 * Install Prompt Manager
 * Manages the PWA installation prompt
 */
export class InstallPromptManager {
  private deferredPrompt: any = null;
  private onInstallableCallback?: (canInstall: boolean) => void;
  private onInstalledCallback?: () => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupListeners();
    }
  }

  private setupListeners() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('[PWA] Install prompt available');

      if (this.onInstallableCallback) {
        this.onInstallableCallback(true);
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      this.deferredPrompt = null;

      if (this.onInstalledCallback) {
        this.onInstalledCallback();
      }
    });
  }

  /**
   * Set callback for when the app becomes installable
   */
  onInstallable(callback: (canInstall: boolean) => void) {
    this.onInstallableCallback = callback;

    // Si le prompt est déjà disponible, appeler immédiatement
    if (this.deferredPrompt) {
      callback(true);
    }
  }

  /**
   * Set callback for when the app is installed
   */
  onInstalled(callback: () => void) {
    this.onInstalledCallback = callback;
  }

  /**
   * Check if the install prompt is available
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Show the install prompt
   */
  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return 'unavailable';
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log('[PWA] Install prompt outcome:', outcome);

      this.deferredPrompt = null;

      return outcome as 'accepted' | 'dismissed';
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
      return 'unavailable';
    }
  }
}
