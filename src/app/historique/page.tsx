'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchOrders } from '@/store/slices/ordersSlice';
import { ArrowDownCircle, ArrowUpCircle, Filter, Search } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export default function HistoriquePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  const [filter, setFilter] = useState<'ALL' | 'DEPOT' | 'RETRAIT'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    if (filter !== 'ALL' && order.type !== filter) return false;
    if (search && !order.bookmaker.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStateBadge = (state: string) => {
    const badges = {
      COMING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En cours' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmé' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' },
    };
    const badge = badges[state as keyof typeof badges] || badges.COMING;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique</h2>

        {/* Filtres */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === 'ALL'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('DEPOT')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === 'DEPOT'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Dépôts
            </button>
            <button
              onClick={() => setFilter('RETRAIT')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === 'RETRAIT'
                  ? 'bg-secondary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Retraits
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un bookmaker..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {order.type === 'DEPOT' ? (
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <ArrowDownCircle className="h-6 w-6 text-primary" />
                      </div>
                    ) : (
                      <div className="bg-secondary/10 p-2 rounded-lg">
                        <ArrowUpCircle className="h-6 w-6 text-secondary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.bookmaker.name}</h3>
                      <p className="text-sm text-gray-600">
                        {dayjs(order.createdAt).format('DD MMM YYYY, HH:mm')}
                      </p>
                    </div>
                  </div>
                  {getStateBadge(order.state)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600">Montant</p>
                    <p className="font-bold text-lg text-gray-900">{order.amount} FCFA</p>
                  </div>
                  {order.fees > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Frais</p>
                      <p className="font-semibold text-gray-900">{order.fees} FCFA</p>
                    </div>
                  )}
                </div>

                {order.cancellationReason && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Raison:</strong> {order.cancellationReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
