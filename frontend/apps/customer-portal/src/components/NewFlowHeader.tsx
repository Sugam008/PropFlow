'use client';

import { colors } from '@propflow/theme';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function NewFlowHeader() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      router.push('/');
    }
  };

  const handleSave = () => {
    // In a real app, this would trigger a partial save to DB
    alert('Progress saved to local cache. You can resume later.');
    router.push('/');
  };

  return (
    <header
      style={{
        width: '100%',
        maxWidth: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 0 32px 0' : '0 0 48px 0',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: colors.white,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary[700],
          }}
        >
          <ShieldCheck size={20} />
        </div>
        {!isMobile && (
          <span
            style={{
              color: 'white',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            PropFlow <span style={{ opacity: 0.5 }}>Secure Session</span>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Save Progress
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: colors.error[400] }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            padding: '8px 16px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Discard
        </motion.button>
      </div>
    </header>
  );
}
