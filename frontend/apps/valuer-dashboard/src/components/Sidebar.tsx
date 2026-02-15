'use client';

import React from 'react';
import { colors, spacing, typography, borderRadius, shadow, layout, zIndex } from '@propflow/theme';
import { ClipboardList, CheckCircle, BarChart3, LogOut, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';

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
    { icon: ClipboardList, label: 'Queue', href: '/' },
    { icon: CheckCircle, label: 'Completed', href: '/completed' },
    { icon: BarChart3, label: 'Reports', href: '/analytics' },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: layout.sidebarWidth,
    height: '100vh',
    backgroundColor: colors.gray[900],
    color: colors.white,
    padding: `${spacing[6]}px ${spacing[4]}px`,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${colors.gray[800]}`,
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    zIndex: zIndex.modal,
    boxShadow: isMobile && isOpen ? shadow['2xl'] : 'none',
    overflow: 'hidden',
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
                padding: `0 ${spacing[2]}px`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    borderRadius: borderRadius.xl,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: shadow.brand,
                  }}
                >
                  <div
                    style={{
                      width: '55%',
                      height: '55%',
                      border: '2.5px solid white',
                      borderRadius: '50%',
                      borderTopColor: 'transparent',
                      transform: 'rotate(45deg)',
                    }}
                  />
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
                    Valuer Dashboard
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
                  const isActive = pathname === item.href;
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
                            ? `3px solid ${colors.primary[500]}`
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
                paddingLeft: spacing[2],
                paddingRight: spacing[2],
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  marginBottom: spacing[4],
                  padding: `${spacing[2]}px ${spacing[3]}px`,
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
                    {user?.name || user?.phone || 'Valuer'}
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
