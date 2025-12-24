'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Home() {
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Rediriger selon le rôle de l'utilisateur
    if (user) {
      console.log('[Home] Redirecting user:', { role: user.role, isSuperAdmin: user.isSuperAdmin });

      // Vérifier Super Admin en premier
      if (user.isSuperAdmin === true) {
        console.log('[Home] Redirecting to /super-admin (isSuperAdmin=true)');
        router.push('/super-admin');
        return;
      }

      if (user.role === 'SUPER_ADMIN') {
        console.log('[Home] Redirecting to /super-admin (role=SUPER_ADMIN)');
        router.push('/super-admin');
        return;
      }

      if (user.role === 'ADMIN') {
        console.log('[Home] Redirecting to /admin (role=ADMIN)');
        router.push('/admin');
        return;
      }

      if (user.role === 'AGENT') {
        console.log('[Home] Redirecting to /admin (role=AGENT)');
        router.push('/admin');
        return;
      }

      // Par défaut (CLIENT, etc.)
      console.log('[Home] Redirecting to /depot (default)');
      router.push('/depot');
    } else {
      // Si pas d'infos utilisateur mais token présent, attendre un peu
      const timer = setTimeout(() => {
        router.push('/depot');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
