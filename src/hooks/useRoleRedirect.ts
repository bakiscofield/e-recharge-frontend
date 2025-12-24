'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useRoleRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      // Pas connecté - permettre l'accès aux pages publiques
      return;
    }

    // Redirection selon le rôle
    if (user.isSuperAdmin || user.role === 'SUPER_ADMIN') {
      // Super Admin - rediriger vers /super-admin si sur la page d'accueil
      if (pathname === '/' || pathname === '/admin') {
        router.push('/super-admin');
      }
    } else if (user.role === 'ADMIN') {
      // Admin - rediriger vers /admin si sur la page d'accueil
      // Et bloquer l'accès à /super-admin
      if (pathname === '/') {
        router.push('/admin');
      } else if (pathname.startsWith('/super-admin')) {
        router.push('/admin');
      }
    } else {
      // Client - bloquer l'accès aux pages admin
      if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
        router.push('/');
      }
    }
  }, [user, pathname, router]);

  return { user };
}
