'use client';

import { ArrowDownCircle, ArrowUpCircle, CheckCircle, Clock, XCircle, User, Phone, CreditCard } from 'lucide-react';
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
    clientContact?: string;
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
    employeePaymentMethod?: {
      phoneNumber?: string;
      employee?: {
        firstName: string;
        lastName: string;
        phone?: string;
      };
      paymentMethod?: {
        name: string;
        logo?: string | null;
      };
    };
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

  // Informations sur le caissier et le moyen de paiement
  const agent = order.employeePaymentMethod?.employee;
  const paymentMethod = order.employeePaymentMethod?.paymentMethod;
  const agentPhoneNumber = order.employeePaymentMethod?.phoneNumber || agent?.phone;

  return (
    <div id={`receipt-${order.id}`} className="bg-white p-6 max-w-xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header - Compact */}
      <div className="border-b-2 border-gray-300 pb-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          {appLogo ? (
            <img src={appLogo} alt={appName} className="h-10 w-auto object-contain" />
          ) : (
            <h1 className="text-xl font-bold text-primary">{appName}</h1>
          )}
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-900">REÇU DE TRANSACTION</h2>
            <p className="text-xs text-gray-600">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Date et heure</p>
            <p className="font-semibold text-gray-900 text-sm">{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${stateInfo.bgColor}`}>
            <StateIcon className={`h-4 w-4 ${stateInfo.color}`} />
            <span className={`font-bold text-sm ${stateInfo.color}`}>{stateInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Type de transaction - Compact */}
      <div className="mb-4">
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
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {order.type === 'DEPOT' ? 'DÉPÔT' : 'RETRAIT'}
            </h3>
            <p className="text-gray-600 text-sm">{order.bookmaker.name}</p>
          </div>
          {order.bookmaker.logo && (
            <img
              src={order.bookmaker.logo}
              alt={order.bookmaker.name}
              className="h-10 w-auto object-contain"
            />
          )}
        </div>
      </div>

      {/* Détails du client - Compact */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Informations Client
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-gray-600">Nom complet</p>
            <p className="font-semibold text-gray-900">{order.user.firstName} {order.user.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Téléphone</p>
            <p className="font-semibold text-gray-900">{order.clientContact || order.user.phoneNumber}</p>
          </div>
          {order.bookmakerIdentifier && (
            <div className="col-span-2">
              <p className="text-xs text-gray-600">ID Bookmaker</p>
              <p className="font-semibold text-gray-900">{order.bookmakerIdentifier}</p>
            </div>
          )}
        </div>
      </div>

      {/* Moyen de paiement et Caissier - Nouvelle section */}
      {(paymentMethod || agent) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Détails du Traitement
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {paymentMethod && (
              <div>
                <p className="text-xs text-gray-600">Moyen de paiement</p>
                <p className="font-semibold text-gray-900">{paymentMethod.name}</p>
              </div>
            )}
            {agentPhoneNumber && (
              <div>
                <p className="text-xs text-gray-600">Numéro utilisé</p>
                <p className="font-semibold text-gray-900">{agentPhoneNumber}</p>
              </div>
            )}
            {agent && (
              <div className="col-span-2">
                <p className="text-xs text-gray-600">Traité par</p>
                <p className="font-semibold text-gray-900">{agent.firstName} {agent.lastName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Détails financiers - Compact */}
      <div className="mb-4">
        <h4 className="font-bold text-gray-900 mb-2 text-sm">Détails Financiers</h4>
        <div className="space-y-2">
          <div className="flex justify-between py-1.5 border-b border-gray-200 text-sm">
            <span className="text-gray-700">Montant de la transaction</span>
            <span className="font-semibold text-gray-900">{order.amount.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-200 text-sm">
            <span className="text-gray-700">Frais de service</span>
            <span className="font-semibold text-gray-900">{order.fees.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between py-2 bg-primary/5 px-3 rounded-lg">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-primary text-lg">{(order.amount + order.fees).toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Footer - Compact */}
      <div className="border-t-2 border-gray-300 pt-4 mt-4">
        <div className="text-center text-xs text-gray-600">
          <p className="mb-1">Ce reçu est généré automatiquement et ne nécessite pas de signature.</p>
          <p className="mb-1">Pour toute question, contactez notre service client.</p>
          <p className="font-semibold text-gray-900 text-sm">{appName}</p>
          <p className="text-xs text-gray-400 mt-2">
            Généré le {dayjs().format('DD/MM/YYYY à HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
}
