'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials, fetchProfile } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (token) {
      // Stocker les tokens
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Récupérer le profil utilisateur et mettre à jour le state
      dispatch(fetchProfile())
        .unwrap()
        .then((user) => {
          dispatch(setCredentials({ user, token, refreshToken: refreshToken || undefined }));

          // Rediriger selon le rôle
          if (user.isSuperAdmin || user.role === 'SUPER_ADMIN') {
            router.push('/super-admin');
          } else if (user.role === 'ADMIN' || user.role === 'AGENT') {
            router.push('/admin');
          } else {
            router.push('/depot');
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du profil:', error);
          router.push('/login?error=oauth_failed');
        });
    } else {
      // Pas de token, rediriger vers login
      router.push('/login?error=no_token');
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a1f] to-[#1a1a3f]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Connexion en cours...</p>
      </div>
    </div>
  );
}
