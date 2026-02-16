import { borderRadius, colors, glass, layout, spacing, typography, zIndex } from '@propflow/theme';
import { motion } from 'framer-motion';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuthStore } from '../store/useAuthStore';

interface TopBarProps {
  onMenuClick?: () => void;
  pendingCount?: number;
}

export const TopBar = ({ onMenuClick, pendingCount = 0 }: TopBarProps) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getTitle = () => {
    if (pathname === '/new') return 'New Valuation';
    if (pathname === '/help') return 'Help';
    if (pathname && pathname !== '/') {
      return 'Property Details';
    }
    return 'My Valuations';
  };

  return (
    <header
      style={
        {
          ...glass.light,
          height: layout.headerHeight,
          padding: `0 ${isMobile ? spacing[4] : spacing[6]}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: zIndex.sticky,
        } as React.CSSProperties
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], flex: 1 }}>
        {isMobile && (
          <motion.button
            whileHover={{ backgroundColor: colors.gray[100] }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            aria-label="Open menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.gray[600],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing[2],
              borderRadius: borderRadius.lg,
              transition: 'background-color 0.2s',
              width: 40,
              height: 40,
            }}
          >
            <Menu size={22} />
          </motion.button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <h1
            style={{
              fontSize: isMobile ? typography.fontSizes.base : typography.fontSizes.lg,
              fontWeight: typography.fontWeights.semibold,
              color: colors.gray[900],
              letterSpacing: typography.letterSpacing.tight,
              margin: 0,
            }}
          >
            {getTitle()}
          </h1>

          {!isMobile && pendingCount > 0 && (
            <span
              style={{
                fontSize: typography.fontSizes.xs,
                backgroundColor: colors.primary[50],
                color: colors.primary[600],
                padding: `${spacing[1]}px ${spacing[2]}px`,
                borderRadius: borderRadius.base,
                fontWeight: typography.fontWeights.medium,
                border: `1px solid ${colors.primary[100]}`,
              }}
            >
              {pendingCount} Pending
            </span>
          )}
        </div>

        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              backgroundColor: colors.gray[50],
              padding: `${spacing[2]}px ${spacing[4]}px`,
              borderRadius: borderRadius.lg,
              width: 320,
              border: `1px solid ${colors.border}`,
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <Search size={18} color={colors.gray[400]} />
            <input
              type="text"
              placeholder="Search by ID or address..."
              aria-label="Search property queue"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: typography.fontSizes.sm,
                width: '100%',
                color: colors.gray[800],
                height: 24,
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
            style={{
              background: 'none',
              border: 'none',
              color: colors.gray[600],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing[2],
              borderRadius: borderRadius.lg,
              width: 40,
              height: 40,
            }}
          >
            <Search size={20} />
          </motion.button>
        )}

        <motion.button
          whileHover={{ backgroundColor: colors.gray[100] }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
          style={{
            position: 'relative',
            cursor: 'pointer',
            color: colors.gray[600],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[2],
            borderRadius: borderRadius.lg,
            background: 'none',
            border: 'none',
            width: 40,
            height: 40,
          }}
        >
          <Bell size={20} aria-hidden="true" />
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              backgroundColor: colors.error[500],
              borderRadius: '50%',
              border: `2px solid ${colors.white}`,
            }}
          />
        </motion.button>

        {!isMobile && user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              paddingLeft: spacing[3],
              borderLeft: `1px solid ${colors.border}`,
              marginLeft: spacing[2],
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
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
              {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
            </div>
            <span
              style={{
                fontSize: typography.fontSizes.sm,
                color: colors.gray[700],
                fontWeight: typography.fontWeights.medium,
              }}
            >
              {user.name || user.phone}
            </span>
          </div>
        )}

        <motion.button
          whileHover={{ backgroundColor: colors.error[50], color: colors.error[600] }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          aria-label="Logout"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.gray[500],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            borderRadius: borderRadius.lg,
            fontSize: typography.fontSizes.sm,
            fontWeight: typography.fontWeights.medium,
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          <LogOut size={18} />
          {!isMobile && 'Logout'}
        </motion.button>
      </div>
    </header>
  );
};
