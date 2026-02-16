'use client';

import {
  borderRadius,
  colors,
  glass,
  layout,
  shadow,
  spacing,
  typography,
  zIndex,
} from '@propflow/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, CheckCircle, ClipboardList, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuthStore } from '../store/useAuthStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: ClipboardList, label: 'Home', href: '/' },
    { icon: CheckCircle, label: 'New Valuation', href: '/new' },
    // { icon: BarChart3, label: 'Help', href: '/help' },
  ];

  const sidebarStyle: React.CSSProperties = {
    ...glass.dark,
    width: layout.sidebarWidth,
    height: '100vh',
    padding: `${spacing[6]}px ${spacing[4]}px`,
    display: 'flex',
    flexDirection: 'column',
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    zIndex: zIndex.modal,
    boxShadow: isMobile && isOpen ? '0 0 50px rgba(0,0,0,0.5)' : 'none',
    overflow: 'hidden',
    borderRight: 'none', // Remove the straight border
    backgroundColor: 'rgba(17, 24, 39, 0.85)', // Slightly more transparent than glass.dark
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={
              {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: zIndex.modalBackdrop,
              } as React.CSSProperties
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -layout.sidebarWidth } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -layout.sidebarWidth } : undefined}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={sidebarStyle}
          >
            <div
              aria-label="PropFlow Home"
              style={{
                marginBottom: spacing[8],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing[2],
                padding: `0 ${spacing[4]}px`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.accent[500]} 100%)`,
                    borderRadius: borderRadius.xl,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: shadow.brand,
                  }}
                >
                  {/* Aditya Birla stylized sun rays */}
                  <div style={{ position: 'relative', width: '70%', height: '70%' }}>
                    {[0, 45, 90, 135].map((deg) => (
                      <div
                        key={deg}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '100%',
                          height: '2px',
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                        }}
                      />
                    ))}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '50%',
                        height: '50%',
                        backgroundColor: colors.white,
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: typography.fontSizes.lg,
                      fontWeight: typography.fontWeights.bold,
                      color: colors.white,
                      lineHeight: typography.lineHeights.tight,
                      letterSpacing: typography.letterSpacing.tight,
                    }}
                  >
                    PropFlow
                  </div>
                  <div
                    style={{
                      fontSize: typography.fontSizes['2xs'],
                      fontWeight: typography.fontWeights.medium,
                      color: colors.gray[400],
                      letterSpacing: typography.letterSpacing.wider,
                      marginTop: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    Customer Portal
                  </div>
                </div>
              </div>
              {isMobile && (
                <motion.button
                  whileHover={{ backgroundColor: colors.gray[800] }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  aria-label="Close sidebar"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.gray[400],
                    cursor: 'pointer',
                    padding: spacing[2],
                    borderRadius: borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                  }}
                >
                  <X size={20} />
                </motion.button>
              )}
            </div>

            <nav aria-label="Main Navigation" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems.map((item, index) => {
                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={index} style={{ marginBottom: spacing[1] }}>
                      <Link
                        href={item.href}
                        onClick={isMobile ? onClose : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        style={{
                          color: isActive ? colors.white : colors.gray[400],
                          textDecoration: 'none',
                          fontSize: typography.fontSizes.sm,
                          fontWeight: isActive
                            ? typography.fontWeights.semibold
                            : typography.fontWeights.medium,
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing[3],
                          padding: `${spacing[3]}px ${spacing[4]}px`,
                          backgroundColor: isActive ? colors.gray[800] : 'transparent',
                          borderRadius: borderRadius.lg,
                          transition: 'all 0.2s ease',
                          borderLeft: isActive
                            ? `4px solid ${colors.accent[500]}`
                            : '3px solid transparent',
                        }}
                      >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div
              style={{
                marginTop: 'auto',
                borderTop: `1px solid ${colors.gray[800]}`,
                paddingTop: spacing[5],
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  marginBottom: spacing[4],
                  padding: `${spacing[2]}px ${spacing[4]}px`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.white,
                    fontSize: typography.fontSizes.sm,
                    fontWeight: typography.fontWeights.semibold,
                  }}
                >
                  {(user?.name || user?.phone || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: typography.fontSizes['2xs'],
                      color: colors.gray[500],
                      lineHeight: typography.lineHeights.tight,
                      textTransform: 'uppercase',
                      letterSpacing: typography.letterSpacing.wider,
                    }}
                  >
                    Logged in as
                  </div>
                  <div
                    style={{
                      fontSize: typography.fontSizes.sm,
                      fontWeight: typography.fontWeights.medium,
                      color: colors.white,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name || user?.phone || 'Customer'}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ backgroundColor: colors.error[600] }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                aria-label="Sign out"
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.gray[700]}`,
                  color: colors.gray[300],
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  borderRadius: borderRadius.lg,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing[2],
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.medium,
                  transition: 'all 0.2s',
                }}
              >
                <LogOut size={16} />
                Sign Out
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
