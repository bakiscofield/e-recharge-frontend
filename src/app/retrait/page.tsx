'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/Layout/AppLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createOrder } from '@/store/slices/ordersSlice';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Building2, Wallet, DollarSign, Phone, Key, MapPin, ArrowRight } from 'lucide-react';
import { WaitingModal } from '@/components/Modal/WaitingModal';

export default function RetraitPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(1);
  const [bookmakers, setBookmakers] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<any[]>([]);
  const [useNewId, setUseNewId] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);

  const [formData, setFormData] = useState({
    bookmakerId: '',
    paymentMethodId: '',
    employeePaymentMethodId: '',
    amount: '',
    clientContact: user?.phone || '',
    bookmakerIdentifier: '',
    referenceId: '', // Code retrait
  });

  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  useEffect(() => {
    loadBookmakers();
    loadSavedIds();
  }, []);

  useEffect(() => {
    if (formData.bookmakerId) {
      loadPaymentMethods();
      // Vérifier s'il y a des IDs enregistrés pour ce bookmaker
      const hasIds = savedIds.some(id => id.bookmakerId === formData.bookmakerId);
      setUseNewId(!hasIds);
    }
  }, [formData.bookmakerId, savedIds]);

  useEffect(() => {
    if (formData.bookmakerId && formData.paymentMethodId) {
      loadAgents();
    }
  }, [formData.bookmakerId, formData.paymentMethodId]);

  const loadBookmakers = async () => {
    try {
      const res = await api.get('/bookmakers', { params: { country: user?.country } });
      setBookmakers(res.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    }
  };

  const loadSavedIds = async () => {
    try {
      const res = await api.get('/users/me/bookmaker-ids');
      setSavedIds(res.data);
    } catch (error: any) {
      console.error('Error loading saved IDs:', error);
      // Silent fail - IDs are optional
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const res = await api.get('/payment-methods', {
        params: { country: user?.country, type: 'MOBILE_MONEY' },
      });
      setPaymentMethods(res.data);
      if (res.data.length === 0) {
        toast.error('Aucun moyen de paiement disponible');
      }
    } catch (error: any) {
      console.error('Error loading payment methods:', error);
      toast.error(error.response?.data?.message || 'Erreur de chargement des moyens de paiement');
    }
  };

  const loadAgents = async () => {
    try {
      const res = await api.get('/payment-methods/agents/online', {
        params: {
          paymentMethodId: formData.paymentMethodId,
          bookmakerId: formData.bookmakerId,
          country: user?.country,
        },
      });
      setAgents(res.data);
      if (res.data.length === 0) {
        toast.error('Aucun agent disponible pour cette sélection');
      }
    } catch (error: any) {
      console.error('Error loading agents:', error);
      toast.error(error.response?.data?.message || 'Erreur de chargement des agents');
    }
  };

  const handleSubmit = async () => {
    // Validations
    if (!formData.bookmakerId) {
      toast.error('Veuillez sélectionner un bookmaker');
      return;
    }

    if (!formData.employeePaymentMethodId) {
      toast.error('Veuillez sélectionner un agent');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) < 1000) {
      toast.error('Montant minimum: 1000 FCFA');
      return;
    }

    if (!formData.clientContact || !formData.clientContact.trim()) {
      toast.error('Votre contact est requis');
      return;
    }

    if (!formData.referenceId || !formData.referenceId.trim()) {
      toast.error('Code retrait requis');
      return;
    }

    try {
      const orderData: any = {
        type: 'RETRAIT',
        amount: parseFloat(formData.amount),
        bookmakerId: formData.bookmakerId,
        employeePaymentMethodId: formData.employeePaymentMethodId,
        clientContact: formData.clientContact,
      };

      // Ajouter les champs optionnels seulement s'ils ont une valeur
      if (formData.bookmakerIdentifier && formData.bookmakerIdentifier.trim()) {
        orderData.bookmakerIdentifier = formData.bookmakerIdentifier.trim();
      }
      if (formData.referenceId && formData.referenceId.trim()) {
        orderData.referenceId = formData.referenceId.trim();
      }

      console.log('Données envoyées:', orderData);
      await dispatch(createOrder(orderData)).unwrap();

      // Show waiting modal instead of toast
      setShowWaitingModal(true);
      setStep(1);
      setFormData({
        ...formData,
        amount: '',
        referenceId: '',
      });
    } catch (error: any) {
      console.error('Erreur lors de la création du retrait:', error);
      toast.error(error || 'Erreur de création du retrait');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-0 pb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Nouveau Retrait</h2>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold ${
                  step >= s ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-8 sm:w-16 mx-1 sm:mx-2 ${step > s ? 'bg-secondary' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Bookmaker & Moyen de paiement */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Bookmaker
              </label>
              {bookmakers.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-sm sm:text-base">Aucun bookmaker disponible</p>
                  <p className="text-xs sm:text-sm mt-1">Veuillez contacter l'administration</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {bookmakers.map((bm) => (
                    <button
                      key={bm.id}
                      onClick={() => setFormData({ ...formData, bookmakerId: bm.id })}
                      className={`p-3 sm:p-4 border-2 rounded-lg transition ${
                        formData.bookmakerId === bm.id
                          ? 'border-secondary bg-secondary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        {bm.logo ? (
                          <img
                            src={bm.logo}
                            alt={bm.name}
                            className="h-8 sm:h-10 w-auto object-contain"
                          />
                        ) : (
                          <Building2 className="h-8 sm:h-10 w-8 sm:w-10 text-gray-400" />
                        )}
                        <div className="font-semibold text-xs sm:text-sm">{bm.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wallet className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Moyen de paiement
              </label>
              {!formData.bookmakerId ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm">Veuillez d'abord sélectionner un bookmaker</p>
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Wallet className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-sm sm:text-base">Aucun moyen de paiement disponible</p>
                  <p className="text-xs sm:text-sm mt-1">Veuillez contacter l'administration</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setFormData({ ...formData, paymentMethodId: pm.id })}
                      className={`w-full p-3 sm:p-4 border-2 rounded-lg transition ${
                        formData.paymentMethodId === pm.id
                          ? 'border-secondary bg-secondary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm sm:text-base">{pm.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.bookmakerId || !formData.paymentMethodId}
              className="w-full bg-secondary text-white py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Continuer
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}

        {/* Step 2: Agent & Montant */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Point de retrait
              </label>
              {agents.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-xs sm:text-sm">Aucun agent disponible</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {agents.map((agent) => {
                    const address = JSON.parse(agent.address || '{}');
                    return (
                      <button
                        key={agent.id}
                        onClick={() => {
                          setFormData({ ...formData, employeePaymentMethodId: agent.id });
                          setSelectedAgent(agent);
                        }}
                        className={`w-full p-3 sm:p-4 border-2 rounded-lg text-left transition ${
                          formData.employeePaymentMethodId === agent.id
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-sm sm:text-base">
                          {agent.employee.firstName} {agent.employee.lastName}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">
                          {address.city} - {address.street}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">{address.establishment}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="10000"
                min="1000"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary text-sm sm:text-base"
              />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.employeePaymentMethodId || !formData.amount}
                className="flex-1 bg-secondary text-white py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Informations */}
        {step === 3 && selectedAgent && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Point de retrait</h3>
              {(() => {
                const address = JSON.parse(selectedAgent.address || '{}');
                return (
                  <div className="text-xs sm:text-sm text-green-800">
                    <p className="font-semibold">{address.establishment}</p>
                    <p>
                      {address.street}, {address.city}
                    </p>
                    <p className="mt-2">
                      Agent: {selectedAgent.employee.firstName} {selectedAgent.employee.lastName}
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Votre contact
              </label>
              <input
                type="tel"
                value={formData.clientContact}
                onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary text-sm sm:text-base"
              />
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                ID {bookmakers.find(bm => bm.id === formData.bookmakerId)?.name || 'Bookmaker'}
              </label>

              {(() => {
                const bookmakerId = formData.bookmakerId;
                const availableIds = savedIds.filter(id => id.bookmakerId === bookmakerId);

                if (availableIds.length > 0) {
                  return (
                    <div className="space-y-2 sm:space-y-3">
                      {/* Toggle entre ID enregistré et nouveau */}
                      <div className="flex gap-3 sm:gap-4 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!useNewId}
                            onChange={() => {
                              setUseNewId(false);
                              setFormData({ ...formData, bookmakerIdentifier: '' });
                            }}
                            className="w-4 h-4 text-secondary focus:ring-secondary"
                          />
                          <span className="text-xs sm:text-sm">ID enregistré</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={useNewId}
                            onChange={() => {
                              setUseNewId(true);
                              setFormData({ ...formData, bookmakerIdentifier: '' });
                            }}
                            className="w-4 h-4 text-secondary focus:ring-secondary"
                          />
                          <span className="text-xs sm:text-sm">Saisir un nouvel ID</span>
                        </label>
                      </div>

                      {/* Sélecteur ou Input */}
                      {!useNewId ? (
                        <select
                          value={formData.bookmakerIdentifier}
                          onChange={(e) => setFormData({ ...formData, bookmakerIdentifier: e.target.value })}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary text-sm sm:text-base"
                        >
                          <option value="">Sélectionner un ID...</option>
                          {availableIds.map((savedId) => (
                            <option key={savedId.id} value={savedId.identifier}>
                              {savedId.identifier} {savedId.label ? `(${savedId.label})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.bookmakerIdentifier}
                          onChange={(e) => setFormData({ ...formData, bookmakerIdentifier: e.target.value })}
                          placeholder={`Ex: ID ${bookmakers.find(bm => bm.id === formData.bookmakerId)?.name || 'bookmaker'}`}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary text-sm sm:text-base"
                        />
                      )}
                    </div>
                  );
                } else {
                  // Pas d'IDs enregistrés, afficher directement l'input
                  return (
                    <input
                      type="text"
                      value={formData.bookmakerIdentifier}
                      onChange={(e) => setFormData({ ...formData, bookmakerIdentifier: e.target.value })}
                      placeholder={`Ex: ID ${bookmakers.find(bm => bm.id === formData.bookmakerId)?.name || 'bookmaker'}`}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary text-sm sm:text-base"
                    />
                  );
                }
              })()}

              <p className="text-xs text-gray-500 mt-2">
                Votre identifiant sur {bookmakers.find(bm => bm.id === formData.bookmakerId)?.name || 'le bookmaker'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Code retrait bookmaker
              </label>
              <input
                type="text"
                value={formData.referenceId}
                onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                placeholder="Ex: ABC123XYZ"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                Le code que vous avez généré sur le site du bookmaker
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.referenceId}
                className="flex-1 bg-secondary text-white py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base"
              >
                Confirmer le retrait
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Waiting Modal */}
      <WaitingModal
        isOpen={showWaitingModal}
        onClose={() => {
          setShowWaitingModal(false);
          router.push('/historique');
        }}
        type="RETRAIT"
      />
    </AppLayout>
  );
}
