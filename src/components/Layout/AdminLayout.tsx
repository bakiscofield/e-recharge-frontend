'use client';

import { ReactNode } from 'react';
import { AdminHeader } from '../Navigation/AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminHeader />
      <main className="py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}
