'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import { Ticket, Calendar, Trophy, FileText, Download, Eye, ChevronRight, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

interface Coupon {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  documentUrl?: string;
  documentUrls?: string[];
  type: 'MATCH' | 'COUPON';
  date: string;
  isActive: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'coupons'>('matches');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Erreur chargement coupons:', error);
      // Données de démonstration si l'API n'existe pas encore
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const matches = coupons.filter((c) => c.type === 'MATCH');
  const couponsList = coupons.filter((c) => c.type === 'COUPON');

  const todayMatches = matches.filter((m) => dayjs(m.date).isSame(dayjs(), 'day'));
  const upcomingMatches = matches.filter((m) => dayjs(m.date).isAfter(dayjs(), 'day'));

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-0 pb-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full mb-3">
            <Ticket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons du Jour</h1>
          <p className="text-gray-600 mt-1">Matchs et pronostics du jour</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
              activeTab === 'matches'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy className="h-5 w-5" />
            Matchs du Jour
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
              activeTab === 'coupons'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-5 w-5" />
            Coupons
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Contenu Matchs */}
            {activeTab === 'matches' && (
              <div className="space-y-6">
                {/* Matchs du jour */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="font-bold text-gray-900">Aujourd'hui</h2>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {dayjs().format('DD MMM')}
                    </span>
                  </div>

                  {todayMatches.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center">
                      <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucun match prévu aujourd'hui</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Revenez plus tard pour les prochains matchs
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onView={() => setSelectedCoupon(match)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Matchs à venir */}
                {upcomingMatches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <h2 className="font-bold text-gray-900">À venir</h2>
                    </div>
                    <div className="space-y-3">
                      {upcomingMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onView={() => setSelectedCoupon(match)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {matches.length === 0 && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 text-center">
                    <Trophy className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Aucun match disponible</h3>
                    <p className="text-gray-600 text-sm">
                      Les matchs et pronostics seront publiés prochainement.
                      Revenez régulièrement pour ne rien manquer !
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contenu Coupons */}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                {couponsList.length === 0 ? (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 text-center">
                    <FileText className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Aucun coupon disponible</h3>
                    <p className="text-gray-600 text-sm">
                      Les coupons et pronostics seront publiés prochainement.
                      Consultez cette page régulièrement !
                    </p>
                  </div>
                ) : (
                  couponsList.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onView={() => setSelectedCoupon(coupon)}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Modal de détails */}
        {selectedCoupon && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setSelectedCoupon(null)}
          >
            <div
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modal */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{selectedCoupon.title || 'Détails'}</h3>
                  <button
                    onClick={() => setSelectedCoupon(null)}
                    className="p-1 hover:bg-white/20 rounded-full transition"
                  >
                    <ChevronRight className="h-6 w-6 rotate-90" />
                  </button>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  {dayjs(selectedCoupon.date).format('dddd DD MMMM YYYY')}
                </p>
              </div>

              {/* Contenu modal - défilement vertical */}
              <div className="p-4 overflow-y-auto max-h-[75vh] space-y-4">
                {/* Image principale */}
                {selectedCoupon.imageUrl && (
                  <img
                    src={selectedCoupon.imageUrl}
                    alt={selectedCoupon.title || 'Image'}
                    className="w-full rounded-lg"
                  />
                )}

                {/* Description et contenu */}
                {(selectedCoupon.description || selectedCoupon.content) && (
                  <div className="prose prose-sm max-w-none">
                    {selectedCoupon.description && (
                      <p className="text-gray-600 mb-2">{selectedCoupon.description}</p>
                    )}
                    {selectedCoupon.content && (
                      <div className="text-gray-800 whitespace-pre-wrap">
                        {selectedCoupon.content}
                      </div>
                    )}
                  </div>
                )}

                {/* Documents multiples - affichés verticalement */}
                {((selectedCoupon.documentUrls && selectedCoupon.documentUrls.length > 0) || selectedCoupon.documentUrl) && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      Documents ({selectedCoupon.documentUrls?.length || 1})
                    </p>

                    {/* Afficher les documents comme images si ce sont des images */}
                    {(selectedCoupon.documentUrls || [selectedCoupon.documentUrl]).filter(Boolean).map((url, index) => {
                      const isImage = url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

                      if (isImage) {
                        return (
                          <div key={index} className="space-y-2">
                            <img
                              src={url}
                              alt={`Document ${index + 1}`}
                              className="w-full rounded-lg border border-gray-200"
                            />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
                            >
                              <Eye className="h-4 w-4" />
                              Ouvrir en grand
                            </a>
                          </div>
                        );
                      }

                      // Pour les PDF et autres documents
                      return (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition"
                        >
                          <FileText className="h-6 w-6 flex-shrink-0" />
                          <span className="flex-1 truncate text-sm">
                            {url?.split('/').pop() || `Document ${index + 1}`}
                          </span>
                          <Download className="h-5 w-5 flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Composant carte match
function MatchCard({ match, onView }: { match: Coupon; onView: () => void }) {
  const docCount = match.documentUrls?.length || (match.documentUrl ? 1 : 0);

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onView}
    >
      {/* Image preview si disponible */}
      {match.imageUrl && (
        <img
          src={match.imageUrl}
          alt={match.title || 'Match'}
          className="w-full h-32 object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{match.title || 'Match du jour'}</h3>
            {match.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{match.description}</p>
            )}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {dayjs(match.date).format('HH:mm')}
              </span>
              <span className="text-xs text-gray-500">
                {dayjs(match.date).format('DD MMM YYYY')}
              </span>
              {docCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {docCount} doc{docCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
            <Eye className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant carte coupon
function CouponCard({ coupon, onView }: { coupon: Coupon; onView: () => void }) {
  const docCount = coupon.documentUrls?.length || (coupon.documentUrl ? 1 : 0);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onView}
    >
      {/* Image preview */}
      {coupon.imageUrl && (
        <img
          src={coupon.imageUrl}
          alt={coupon.title || 'Coupon'}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="font-bold text-gray-900">{coupon.title || 'Coupon du jour'}</h3>
        {coupon.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{coupon.description}</p>
        )}

        <div className="flex items-center flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-500">
            Publié le {dayjs(coupon.createdAt).format('DD/MM/YYYY')}
          </span>
          {docCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {docCount} document{docCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          <Eye className="h-5 w-5" />
          Voir les détails
        </button>
      </div>
    </div>
  );
}
