'use client';

import AppLayout from '@/components/Layout/AppLayout';
import { Phone, Mail, MessageCircle, Facebook, Twitter, Instagram, HelpCircle } from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';

export default function InformationsPage() {
  const { appName } = useAppConfig();
  const openWhatsApp = () => {
    window.open('https://wa.me/22890123456', '_blank');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-2 sm:px-0 pb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Informations & Support</h2>

        {/* Contact */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-lg mb-4">Nous contacter</h3>
          <div className="space-y-3">
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-gray-600">+228 90 12 34 56</p>
              </div>
            </button>

            <a
              href="tel:+22890123456"
              className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Phone className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-gray-600">+228 90 12 34 56</p>
              </div>
            </a>

            <a
              href="mailto:support@alicebot.com"
              className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Mail className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">support@alicebot.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com/alicebot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
              <Facebook className="h-5 w-5" />
              <span className="font-medium">Facebook</span>
            </a>
            <a
              href="https://twitter.com/alicebot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-secondary text-white rounded-lg hover:opacity-90 transition"
            >
              <Twitter className="h-5 w-5" />
              <span className="font-medium">Twitter</span>
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Questions fréquentes
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Comment effectuer un dépôt ?
              </h4>
              <p className="text-sm text-gray-600">
                Allez dans l'onglet Dépôt, choisissez votre bookmaker, moyen de paiement et agent, puis suivez les instructions.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Quels sont les délais de traitement ?
              </h4>
              <p className="text-sm text-gray-600">
                Les dépôts et retraits sont généralement traités en moins de 30 minutes.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Comment fonctionne le parrainage ?
              </h4>
              <p className="text-sm text-gray-600">
                Partagez votre code parrainage. Vous recevez 5% de commission sur chaque dépôt de vos filleuls. Retrait possible à partir de 2000 FCFA.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Mes données sont-elles sécurisées ?
              </h4>
              <p className="text-sm text-gray-600">
                Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos informations personnelles et transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Conditions d'utilisation</h3>
          <p className="text-sm text-gray-600 mb-4">
            En utilisant {appName}, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
          <p className="text-xs text-gray-500">
            Version 1.0.0 - © 2025 {appName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
