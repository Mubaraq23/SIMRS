'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import { ToastProvider } from '@/components/ui/ToastProvider';
import CommandPalette from '@/components/ui/CommandPalette';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleToggleCommand = () => {
      setIsCommandPaletteOpen((prev) => !prev);
    };
    window.addEventListener('toggle-command-palette', handleToggleCommand);
    return () => window.removeEventListener('toggle-command-palette', handleToggleCommand);
  }, []);

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 transition-colors duration-200">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/60">
            {children}
          </main>
        </div>

        {/* Global Components */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <FloatingActionButton />
      </div>
    </ToastProvider>
  );
}
