'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createOrder } from '@/store/slices/ordersSlice';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Building2, DollarSign, Phone, Key, MapPin, ArrowRight } from 'lucide-react';

export default function RetraitPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(1);
  const [bookmakers, setBookmakers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    bookmakerId: '',
    employeePaymentMethodId: '',
    amount: '',
    clientContact: user?.phone || '',
    bookmakerIdentifier: '',
    referenceId: '', // Code retrait
  });

  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  useEffect(() => {
    loadBookmakers();
  }, []);

  useEffect(() => {
    if (formData.bookmakerId) {
      loadAgents();
    }
  }, [formData.bookmakerId]);

  const loadBookmakers = async () => {
    try {
      const res = await api.get('/bookmakers', { params: { country: user?.country } });
      setBookmakers(res.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    }
  };

  const loadAgents = async () => {
    try {
      const res = await api.get('/payment-methods/agents/online', {
        params: {
          paymentMethodId: 'any',
          bookmakerId: formData.bookmakerId,
          country: user?.country,
        },
      });
      setAgents(res.data);
    } catch (error) {
      toast.error('Erreur de chargement des agents');
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || parseFloat(formData.amount) < 1000) {
      toast.error('Montant minimum: 1000 FCFA');
      return;
    }

    if (!formData.referenceId) {
      toast.error('Code retrait requis');
      return;
    }

    try {
      await dispatch(
        createOrder({
          type: 'RETRAIT',
          ...formData,
          amount: parseFloat(formData.amount),
        })
      ).unwrap();

      toast.success('Retrait créé avec succès !');
      setStep(1);
      setFormData({
        ...formData,
        amount: '',
        referenceId: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Erreur de création');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouveau Retrait</h2>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-16 mx-2 ${step > s ? 'bg-secondary' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Bookmaker */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Building2 className="inline h-5 w-5 mr-2" />
                Bookmaker
              </label>
              <div className="grid grid-cols-2 gap-3">
                {bookmakers.map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => setFormData({ ...formData, bookmakerId: bm.id })}
                    className={`p-4 border-2 rounded-lg transition ${
                      formData.bookmakerId === bm.id
                        ? 'border-secondary bg-secondary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="font-semibold text-sm">{bm.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.bookmakerId}
              className="w-full bg-secondary text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continuer
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step 2: Agent & Montant */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <MapPin className="inline h-5 w-5 mr-2" />
                Point de retrait
              </label>
              {agents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun agent disponible
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
                        className={`w-full p-4 border-2 rounded-lg text-left transition ${
                          formData.employeePaymentMethodId === agent.id
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">
                          {agent.employee.firstName} {agent.employee.lastName}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {address.city} - {address.street}
                        </div>
                        <div className="text-sm text-gray-600">{address.establishment}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <DollarSign className="inline h-5 w-5 mr-2" />
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="10000"
                min="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.employeePaymentMethodId || !formData.amount}
                className="flex-1 bg-secondary text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Informations */}
        {step === 3 && selectedAgent && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Point de retrait</h3>
              {(() => {
                const address = JSON.parse(selectedAgent.address || '{}');
                return (
                  <div className="text-sm text-green-800">
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

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Phone className="inline h-5 w-5 mr-2" />
                Votre contact
              </label>
              <input
                type="tel"
                value={formData.clientContact}
                onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Key className="inline h-5 w-5 mr-2" />
                Code retrait bookmaker
              </label>
              <input
                type="text"
                value={formData.referenceId}
                onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                placeholder="Ex: ABC123XYZ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
              <p className="text-xs text-gray-500 mt-2">
                Le code que vous avez généré sur le site du bookmaker
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.referenceId}
                className="flex-1 bg-secondary text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                Confirmer le retrait
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
