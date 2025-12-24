'use client';

import { ReactNode } from 'react';
import { SuperAdminHeader } from '../Navigation/SuperAdminHeader';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <SuperAdminHeader />
      <main className="py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}
