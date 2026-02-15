import React from 'react';
import { colors, spacing, typography } from '@propflow/theme';
import { Bell, Search, Menu } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { motion } from 'framer-motion';

interface TopBarProps {
  onMenuClick?: () => void;
  pendingCount?: number;
}

export const TopBar = ({ onMenuClick, pendingCount = 12 }: TopBarProps) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <header style={{
      height: 64,
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      padding: `0 ${isMobile ? spacing[4] : spacing[6]}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], flex: 1 }}>
        {isMobile && (
          <motion.button 
            whileHover={{ backgroundColor: colors.gray[100] }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            aria-label="Open menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.gray[600],
              display: 'flex',
              alignItems: 'center',
              padding: spacing[2],
              borderRadius: 8,
              transition: 'background-color 0.2s'
            }}
          >
            <Menu size={24} />
          </motion.button>
        )}
        
        <div style={{ fontSize: isMobile ? typography.fontSizes.base : typography.fontSizes.lg, fontWeight: typography.fontWeights.semibold }}>
          Valuation Queue
        </div>

        {!isMobile && pendingCount > 0 && (
          <div style={{ 
            fontSize: typography.fontSizes.xs, 
            backgroundColor: colors.primary[50], 
            color: colors.primary[700], 
            padding: `${spacing[1]}px ${spacing[2]}px`, 
            borderRadius: 4,
            fontWeight: typography.fontWeights.medium
          }}>
            {pendingCount} Pending
          </div>
        )}
        
        {!isMobile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing[2],
            backgroundColor: colors.gray[100],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            borderRadius: 8,
            width: 300,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <Search size={18} color={colors.gray[600]} />
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
                color: colors.gray[800]
              }}
            />
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: spacing[4], alignItems: 'center' }}>
        {isMobile && (
          <button aria-label="Search" style={{ background: 'none', border: 'none', color: colors.gray[600] }}>
            <Search size={20} />
          </button>
        )}
        
        <div 
          role="status"
          aria-label="3 new notifications"
          style={{ 
          position: 'relative', 
          cursor: 'pointer',
          color: colors.gray[600],
          display: 'flex',
          alignItems: 'center'
        }}>
          <Bell size={20} aria-hidden="true" />
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 8,
            height: 8,
            backgroundColor: colors.error,
            borderRadius: '50%',
            border: `2px solid ${colors.white}`
          }}></span>
        </div>
      </div>
    </header>
  );
};

