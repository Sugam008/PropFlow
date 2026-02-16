'use client';

import { colors, shadow, spacing, zIndex } from '@propflow/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, LogOut, Settings, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuthStore } from '../store/useAuthStore';
import { PageTransition } from './PageTransition';

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [initialAuthCheck, setInitialAuthCheck] = useState<boolean | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Synchronous check on mount to prevent flash
  useEffect(() => {
    const storedAuth = localStorage.getItem('propflow-customer-auth');
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Profile Dropdown Component
  const ProfileDropdown = () => (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.white,
          border: `2px solid ${colors.white}`,
          boxShadow: shadow.md,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 16 }}>
          {(user?.name || user?.phone || 'U').charAt(0).toUpperCase()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            <div
              onClick={() => setIsProfileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: zIndex.modalBackdrop,
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: 'absolute',
                top: 55,
                right: 0,
                width: 240,
                backgroundColor: 'white',
                borderRadius: 20,
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                border: `1px solid ${colors.gray[100]}`,
                padding: spacing[3],
                zIndex: zIndex.modal,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: spacing[3],
                  borderBottom: `1px solid ${colors.gray[50]}`,
                  marginBottom: spacing[2],
                }}
              >
                <div style={{ fontWeight: 800, color: colors.gray[900], fontSize: 14 }}>
                  {user?.name || 'User Account'}
                </div>
                <div style={{ fontSize: 12, color: colors.gray[500], marginTop: 2 }}>
                  {user?.phone || 'Premium Member'}
                </div>
              </div>

              {[
                { icon: User, label: 'Profile Settings', onClick: () => {} },
                { icon: Settings, label: 'Portal Preferences', onClick: () => {} },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: colors.gray[700],
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.gray[50])}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <item.icon size={18} color={colors.primary[500]} />
                  {item.label}
                </button>
              ))}

              <div
                style={{
                  marginTop: spacing[2],
                  paddingTop: spacing[2],
                  borderTop: `1px solid ${colors.gray[50]}`,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: colors.error[600],
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.error[50])}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  if (!isHydrated || initialAuthCheck === null) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.gray[50],
        }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: colors.primary[600] }} />
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
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Container with character */}
      <div
        style={{
          flex: 1,
          margin: isMobile ? 0 : `${spacing[6]}px ${spacing[8]}px`,
          backgroundColor: pathname.startsWith('/new') ? 'transparent' : colors.gray[50],
          borderRadius: isMobile ? 0 : 40,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isMobile ? 'none' : '0 40px 100px -20px rgba(0,0,0,0.5)',
          border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Universal Header - Hidden on New Flow routes */}
        {!pathname.startsWith('/new') && (
          <header
            style={{
              height: 80,
              padding: `0 ${isMobile ? spacing[6] : spacing[10]}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.gray[100]}`,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              position: 'sticky',
              top: 0,
              zIndex: zIndex.sticky,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: colors.primary[600],
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 16px ${colors.primary[600]}44`,
                }}
              >
                <div
                  style={{ width: 14, height: 14, backgroundColor: 'white', borderRadius: '50%' }}
                />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: colors.gray[900],
                  letterSpacing: -0.5,
                }}
              >
                PropFlow
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {!isMobile && (
                <nav style={{ display: 'flex', gap: 32 }}>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: 14,
                      fontWeight: 700,
                      color: colors.primary[600],
                      cursor: 'pointer',
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.gray[500],
                      cursor: 'pointer',
                    }}
                  >
                    Support
                  </button>
                </nav>
              )}
              <ProfileDropdown />
            </div>
          </header>
        )}

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <PageTransition key={pathname}>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
};
