'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { useAppConfig } from '@/hooks/useAppConfig';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { appName, appTagline, appLogo } = useAppConfig();

  // Email/Password login
  const [emailData, setEmailData] = useState({
    identifier: '',
    password: '',
  });

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(emailData)).unwrap();
      toast.success('Connexion réussie !');

      // Rediriger selon le rôle avec vérifications strictes
      const user = result.user;
      console.log('User login data:', { role: user.role, isSuperAdmin: user.isSuperAdmin });

      // Vérifier Super Admin en premier (le plus spécifique)
      if (user.isSuperAdmin === true) {
        console.log('Redirecting to /super-admin (isSuperAdmin=true)');
        router.push('/super-admin');
        return;
      }

      // Vérifier le rôle
      if (user.role === 'SUPER_ADMIN') {
        console.log('Redirecting to /super-admin (role=SUPER_ADMIN)');
        router.push('/super-admin');
        return;
      }

      if (user.role === 'ADMIN') {
        console.log('Redirecting to /admin (role=ADMIN)');
        router.push('/admin');
        return;
      }

      if (user.role === 'AGENT') {
        console.log('Redirecting to /admin (role=AGENT)');
        router.push('/admin');
        return;
      }

      // Par défaut, rediriger vers depot (pour CLIENT et autres)
      console.log('Redirecting to /depot (default)');
      router.push('/depot');
    } catch (error: any) {
      toast.error(error.message || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {appLogo ? (
              <div className="flex flex-col items-center">
                <img src={appLogo} alt={appName} className="h-20 sm:h-24 w-auto object-contain mb-3" />
                <p className="text-gray-600 text-sm sm:text-base">{appTagline}</p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-app-primary">{appName}</h1>
                <p className="text-gray-600 mt-2">{appTagline}</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Connexion
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ou Téléphone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={emailData.identifier}
                    onChange={(e) => setEmailData({ ...emailData, identifier: e.target.value })}
                    placeholder="email@exemple.com ou 90123456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pour téléphone: pas besoin de +228 ou 228
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={emailData.password}
                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-app-primary text-white py-3 rounded-lg font-medium hover:bg-app-primary hover:opacity-90 transition"
              >
                Se connecter
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600 mt-3">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-app-primary font-medium hover:underline"
                >
                  S'inscrire
                </button>
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            En continuant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
