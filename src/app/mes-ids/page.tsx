'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, CreditCard, Building2 } from 'lucide-react';

export default function MesIDsPage() {
  const [ids, setIds] = useState<any[]>([]);
  const [bookmakers, setBookmakers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bookmakerId: '',
    identifier: '',
    label: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [idsRes, bookmakersRes] = await Promise.all([
        api.get('/users/me/bookmaker-ids'),
        api.get('/bookmakers'),
      ]);

      setIds(idsRes.data);
      setBookmakers(bookmakersRes.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/users/me/bookmaker-ids/${editingId}`, formData);
        toast.success('ID modifié !');
      } else {
        await api.post('/users/me/bookmaker-ids', formData);
        toast.success('ID ajouté !');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ bookmakerId: '', identifier: '', label: '' });
      loadData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleEdit = (id: any) => {
    setEditingId(id.id);
    setFormData({
      bookmakerId: id.bookmakerId,
      identifier: id.identifier,
      label: id.label || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet identifiant ?')) return;

    try {
      await api.delete(`/users/me/bookmaker-ids/${id}`);
      toast.success('ID supprimé');
      loadData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-0 pb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mes Identifiants</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ bookmakerId: '', identifier: '', label: '' });
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Ajouter
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} un identifiant
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bookmaker
                </label>
                <select
                  value={formData.bookmakerId}
                  onChange={(e) => setFormData({ ...formData, bookmakerId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                  disabled={!!editingId}
                >
                  <option value="">Sélectionner...</option>
                  {bookmakers.map((bm) => (
                    <option key={bm.id} value={bm.id}>
                      {bm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identifiant
                </label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom personnalisé (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Compte principal"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-medium"
                >
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        )}

        {ids.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun identifiant enregistré</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajoutez vos IDs bookmaker pour accélérer vos transactions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ids.map((id) => (
              <div key={id.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {id.bookmaker.logo ? (
                      <img
                        src={id.bookmaker.logo}
                        alt={id.bookmaker.name}
                        className="h-10 w-10 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{id.bookmaker.name}</h3>
                      <p className="text-lg font-mono text-primary mt-1">{id.identifier}</p>
                      {id.label && (
                        <p className="text-sm text-gray-600 mt-1">{id.label}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(id.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
