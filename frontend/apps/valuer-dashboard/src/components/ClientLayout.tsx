'use client';

import { colors, spacing } from '@propflow/theme';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { PageTransition } from './PageTransition';
import { Sidebar } from './Sidebar';

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [initialAuthCheck, setInitialAuthCheck] = useState<boolean | null>(null);

  // Synchronous check on mount to prevent flash
  useEffect(() => {
    // Check localStorage synchronously to determine initial auth state
    const storedAuth = localStorage.getItem('propflow-valuer-auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setInitialAuthCheck(parsed.state?.isAuthenticated ?? false);
      } catch {
        setInitialAuthCheck(false);
      }
    } else {
      setInitialAuthCheck(false);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  // Show nothing on initial mount to prevent flash
  if (!isHydrated || initialAuthCheck === null) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        }}
      >
        {/* Sidebar Skeleton */}
        <div
          style={{
            width: 280,
            height: '100vh',
            padding: `${spacing[6]}px ${spacing[4]}px`,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(17, 24, 39, 0.4)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{ display: 'flex', gap: 12, marginBottom: spacing[8], paddingLeft: spacing[2] }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={{
                  width: 100,
                  height: 16,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.1)',
                }}
              />
              <div
                style={{
                  width: 60,
                  height: 12,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)' }}
              />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div
          style={{
            flex: 1,
            padding: `${spacing[6]}px ${spacing[8]}px ${spacing[6]}px ${spacing[4]}px`,
            display: 'flex',
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: colors.gray[50],
              borderRadius: 32,
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: colors.primary[600], opacity: 0.5 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      }}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        style={{
          flex: 1,
          padding: `${spacing[6]}px ${spacing[8]}px ${spacing[6]}px ${spacing[4]}px`, // Increased gaps
          height: '100vh',
          display: 'flex',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.gray[50],
            borderRadius: 32,
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 25px 70px -15px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <main
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingTop: spacing[6],
              paddingBottom: spacing[6],
            }}
          >
            <PageTransition key={pathname}>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
};
