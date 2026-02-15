'use client';

import React from 'react';
import { colors, spacing, typography } from '@propflow/theme';
import { ClipboardList, CheckCircle, BarChart3, LogOut, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const menuItems = [
    { icon: <ClipboardList size={20} />, label: 'Queue', href: '/' },
    { icon: <CheckCircle size={20} />, label: 'Completed', href: '#' },
    { icon: <BarChart3 size={20} />, label: 'Reports', href: '/analytics' },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: 260,
    height: '100vh',
    backgroundColor: colors.gray[900],
    color: colors.white,
    padding: spacing[6],
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${colors.gray[800]}`,
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    zIndex: 1100,
    boxShadow: isMobile && isOpen ? '0 0 20px rgba(0,0,0,0.5)' : 'none'
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1050
            }}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {(isOpen || !isMobile) && (
          <motion.aside 
            initial={isMobile ? { x: -260 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -260 } : undefined}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={sidebarStyle}
          >
            <div 
              aria-label="PropFlow Home"
              style={{ 
              marginBottom: spacing[10],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing[2]
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                {/* ABC Logo Motif */}
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: '#E31E24', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{
                    width: '60%',
                    height: '60%',
                    border: '3px solid white',
                    borderRadius: '50%',
                    borderTopColor: 'transparent',
                    transform: 'rotate(45deg)'
                  }} />
                </div>
                <div>
                  <div style={{ 
                    fontSize: typography.fontSizes.xl, 
                    fontWeight: typography.fontWeights.bold,
                    color: colors.white,
                    lineHeight: 1
                  }}>
                    PropFlow
                  </div>
                  <div style={{ 
                    fontSize: 10, 
                    fontWeight: typography.fontWeights.medium,
                    color: colors.gray[400],
                    letterSpacing: '0.05em',
                    marginTop: 2
                  }}>
                    VALUER DASHBOARD
                  </div>
                </div>
              </div>
              {isMobile && (
                <button 
                  onClick={onClose}
                  aria-label="Close sidebar"
                  style={{ background: 'none', border: 'none', color: colors.white, cursor: 'pointer', padding: 4 }}
                >
                  <X size={24} />
                </button>
              )}
            </div>
            
            <nav aria-label="Main Navigation" style={{ flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={index} style={{ marginBottom: spacing[2] }}>
                      <Link 
                        href={item.href} 
                        onClick={isMobile ? onClose : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        style={{ 
                        color: isActive ? colors.white : colors.gray[400], 
                        textDecoration: 'none', 
                        fontSize: typography.fontSizes.base,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[3],
                        padding: `${spacing[2]}px ${spacing[3]}px`,
                        backgroundColor: isActive ? colors.gray[800] : 'transparent',
                        borderRadius: 6,
                        transition: 'all 0.2s ease'
                      }}>
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div style={{ marginTop: 'auto', borderTop: `1px solid ${colors.gray[800]}`, paddingTop: spacing[6] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[4] }}>
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  backgroundColor: colors.gray[700],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={20} color={colors.gray[300]} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSizes.sm, color: colors.gray[400], lineHeight: 1 }}>
                    Logged in as
                  </div>
                  <div style={{ fontSize: typography.fontSizes.base, fontWeight: typography.fontWeights.medium }}>
                    Valuer Admin
                  </div>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ backgroundColor: colors.gray[800], color: colors.white }}
                aria-label="Sign out"
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.gray[700]}`,
                  color: colors.gray[300],
                  padding: `${spacing[2]}px ${spacing[4]}px`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing[2],
                  fontSize: typography.fontSizes.sm,
                  transition: 'all 0.2s'
                }}
              >
                <LogOut size={16} /> Sign Out
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>  );
};

