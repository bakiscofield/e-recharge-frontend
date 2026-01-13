'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Bell,
  Check,
  X,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: string;
}

interface AdminNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotificationPanel({ isOpen, onClose }: AdminNotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      // Polling toutes les 30 secondes quand le panel est ouvert
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, filter]);

  // Fermer le panneau si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications', { params: { limit: 50 } });
      let data = res.data;

      if (filter === 'unread') {
        data = data.filter((n: Notification) => !n.read);
      }

      setNotifications(data);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      toast.error('Erreur de chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      toast.success('Marquée comme lue');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success('Toutes les notifications sont marquées comme lues');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER_STATUS_CHANGED':
        return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
      case 'NEW_ORDER_ASSIGNED':
        return <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case 'REFERRAL_COMMISSION':
        return <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ORDER_STATUS_CHANGED':
        return 'border-l-4 border-green-500 bg-green-50 hover:bg-green-100';
      case 'NEW_ORDER_ASSIGNED':
        return 'border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100';
      case 'REFERRAL_COMMISSION':
        return 'border-l-4 border-yellow-500 bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50 hover:bg-gray-100';
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    if (diff < 60000) return "À l'instant";
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)}j`;

    return d.toLocaleDateString('fr-FR');
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary to-primary/90">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                {unreadCount} {unreadCount === 1 ? 'nouvelle' : 'nouvelles'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === 'unread'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Tout marquer
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-gray-600 text-sm">Chargement des notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">
                {filter === 'unread' ? 'Aucune nouvelle notification' : 'Aucune notification'}
              </p>
              <p className="text-gray-500 text-sm">
                {filter === 'unread'
                  ? 'Vous êtes à jour !'
                  : 'Les notifications apparaîtront ici'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg transition cursor-pointer ${getNotificationColor(
                    notification.type
                  )} ${!notification.read ? 'shadow-sm' : 'opacity-75'}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-gray-900 text-sm ${!notification.read ? 'font-bold' : 'font-semibold'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                        {notification.body}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs">
                          {formatDate(notification.createdAt)}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {notifications.length > 0
              ? `${notifications.length} notification${notifications.length > 1 ? 's' : ''} au total`
              : 'Aucune notification'}
          </p>
        </div>
      </div>
    </>
  );
}
