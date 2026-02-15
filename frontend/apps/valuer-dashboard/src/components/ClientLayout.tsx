'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { PageTransition } from './PageTransition';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
