'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchOrders } from '@/store/slices/ordersSlice';
import { ArrowDownCircle, ArrowUpCircle, Filter, Search, Download, FileText, Image as ImageIconLucide, X, Eye, ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { TransactionReceipt } from '@/components/Receipt/TransactionReceipt';
import { downloadReceiptAsPDF, downloadReceiptAsPNG, previewReceipt } from '@/lib/downloadReceipt';
import toast from 'react-hot-toast';

dayjs.locale('fr');

export default function HistoriquePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);

  const [filter, setFilter] = useState<'ALL' | 'DEPOT' | 'RETRAIT'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadPDF = async (order: any) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    setSelectedOrder({ ...order, user });
    setDownloading(true);

    // Wait for the receipt to render
    setTimeout(async () => {
      try {
        await downloadReceiptAsPDF(order.id);
        toast.success('Reçu PDF téléchargé avec succès');
        setSelectedOrder(null);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        toast.error('Erreur lors du téléchargement du PDF');
      } finally {
        setDownloading(false);
      }
    }, 500);
  };

  const handleDownloadPNG = async (order: any) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    setSelectedOrder({ ...order, user });
    setDownloading(true);

    // Wait for the receipt to render
    setTimeout(async () => {
      try {
        await downloadReceiptAsPNG(order.id);
        toast.success('Reçu PNG téléchargé avec succès');
        setSelectedOrder(null);
      } catch (error) {
        console.error('Error downloading PNG:', error);
        toast.error('Erreur lors du téléchargement du PNG');
      } finally {
        setDownloading(false);
      }
    }, 500);
  };

  const handlePreview = async (order: any) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    setSelectedOrder({ ...order, user });
    setDownloading(true);

    // Wait for the receipt to render
    setTimeout(async () => {
      try {
        await previewReceipt(order.id);
        setSelectedOrder(null);
      } catch (error) {
        console.error('Error previewing receipt:', error);
        toast.error('Erreur lors de la prévisualisation');
      } finally {
        setDownloading(false);
      }
    }, 500);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-0 pb-4 sm:pb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Historique</h2>

        {/* Filtres */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition text-sm sm:text-base ${
                filter === 'ALL'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('DEPOT')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition text-sm sm:text-base ${
                filter === 'DEPOT'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Dépôts
            </button>
            <button
              onClick={() => setFilter('RETRAIT')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition text-sm sm:text-base ${
                filter === 'RETRAIT'
                  ? 'bg-secondary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Retraits
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un bookmaker..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm sm:text-base"
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
          <div className="space-y-2 sm:space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {order.type === 'DEPOT' ? (
                      <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                        <ArrowDownCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                    ) : (
                      <div className="bg-secondary/10 p-1.5 sm:p-2 rounded-lg">
                        <ArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900">{order.bookmaker.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {dayjs(order.createdAt).format('DD MMM YYYY, HH:mm')}
                      </p>
                    </div>
                  </div>
                  {getStateBadge(order.state)}
                </div>

                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Montant</p>
                    <p className="font-bold text-base sm:text-lg text-gray-900">{order.amount} FCFA</p>
                  </div>
                  {order.fees > 0 && (
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Frais</p>
                      <p className="font-semibold text-sm sm:text-base text-gray-900">{order.fees} FCFA</p>
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

                {/* Payment link button for pending orders */}
                {order.state === 'COMING' && order.employeePaymentMethod?.paymentLink && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 mb-2">
                      Cliquez sur le bouton ci-dessous pour contacter l&apos;agent et finaliser votre demande :
                    </p>
                    <button
                      onClick={() => window.open(order.employeePaymentMethod.paymentLink, '_blank')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm active:scale-95"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ouvrir le lien
                    </button>
                  </div>
                )}

                {/* Download buttons */}
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handlePreview(order)}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Aperçu</span>
                    <span className="sm:hidden">👁️</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(order)}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPNG(order)}
                    disabled={downloading}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <ImageIconLucide className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">PNG</span>
                    <span className="sm:hidden">PNG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hidden receipt for download */}
        {selectedOrder && (
          <div className="fixed -top-full -left-full opacity-0 pointer-events-none">
            <TransactionReceipt order={selectedOrder} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
