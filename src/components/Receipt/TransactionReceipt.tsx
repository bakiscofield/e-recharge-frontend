'use client';

import { ArrowDownCircle, ArrowUpCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { useAppConfig } from '@/hooks/useAppConfig';

interface TransactionReceiptProps {
  order: {
    id: string;
    type: 'DEPOT' | 'RETRAIT';
    amount: number;
    fees: number;
    state: string;
    createdAt: string;
    bookmaker: {
      name: string;
      logo: string | null;
    };
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    bookmakerIdentifier?: string;
  };
}

export function TransactionReceipt({ order }: TransactionReceiptProps) {
  const { appName, appLogo } = useAppConfig();

  const getStateInfo = (state: string) => {
    switch (state) {
      case 'CONFIRMED':
        return { label: 'Confirmée', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle };
      case 'COMING':
      case 'PENDING':
        return { label: 'En attente', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock };
      case 'CANCELLED':
      case 'REJECTED':
        return { label: 'Rejetée', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle };
      default:
        return { label: state, color: 'text-gray-600', bgColor: 'bg-gray-50', icon: Clock };
    }
  };

  const stateInfo = getStateInfo(order.state);
  const StateIcon = stateInfo.icon;

  return (
    <div id={`receipt-${order.id}`} className="bg-white p-8 max-w-2xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          {appLogo ? (
            <img src={appLogo} alt={appName} className="h-12 w-auto object-contain" />
          ) : (
            <h1 className="text-2xl font-bold text-primary">{appName}</h1>
          )}
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">REÇU DE TRANSACTION</h2>
            <p className="text-sm text-gray-600">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Date et heure</p>
            <p className="font-semibold text-gray-900">{dayjs(order.createdAt).format('DD MMMM YYYY, HH:mm:ss')}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${stateInfo.bgColor}`}>
            <StateIcon className={`h-5 w-5 ${stateInfo.color}`} />
            <span className={`font-bold ${stateInfo.color}`}>{stateInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Type de transaction */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {order.type === 'DEPOT' ? (
            <div className="bg-primary/10 p-3 rounded-lg">
              <ArrowDownCircle className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="bg-secondary/10 p-3 rounded-lg">
              <ArrowUpCircle className="h-8 w-8 text-secondary" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {order.type === 'DEPOT' ? 'DÉPÔT' : 'RETRAIT'}
            </h3>
            <p className="text-gray-600">{order.bookmaker.name}</p>
          </div>
        </div>

        {order.bookmaker.logo && (
          <div className="flex justify-center my-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={order.bookmaker.logo}
              alt={order.bookmaker.name}
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Détails du client */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-3 text-lg">Informations Client</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-600">Nom complet</p>
            <p className="font-semibold text-gray-900">{order.user.firstName} {order.user.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">{order.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Téléphone</p>
            <p className="font-semibold text-gray-900">{order.user.phoneNumber}</p>
          </div>
          {order.bookmakerIdentifier && (
            <div>
              <p className="text-sm text-gray-600">ID Bookmaker</p>
              <p className="font-semibold text-gray-900">{order.bookmakerIdentifier}</p>
            </div>
          )}
        </div>
      </div>

      {/* Détails financiers */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 mb-3 text-lg">Détails Financiers</h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Montant de la transaction</span>
            <span className="font-semibold text-gray-900">{order.amount.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Frais de service</span>
            <span className="font-semibold text-gray-900">{order.fees.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between py-3 bg-primary/5 px-4 rounded-lg">
            <span className="font-bold text-gray-900 text-lg">Total</span>
            <span className="font-bold text-primary text-xl">{(order.amount + order.fees).toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 mt-6">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">Ce reçu est généré automatiquement et ne nécessite pas de signature.</p>
          <p className="mb-2">Pour toute question, veuillez contacter notre service client.</p>
          <p className="font-semibold text-gray-900">{appName} - Votre plateforme de confiance</p>
          <p className="text-xs text-gray-500 mt-4">
            Généré le {dayjs().format('DD/MM/YYYY à HH:mm:ss')}
          </p>
        </div>
      </div>
    </div>
  );
}
