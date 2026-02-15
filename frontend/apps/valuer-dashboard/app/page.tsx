'use client';

import React, { useState, useEffect } from 'react';
import { spacing, typography, colors } from '@propflow/theme';
import { useMediaQuery } from '../src/hooks/useMediaQuery';
import { Badge } from '../src/components/Badge';
import { Card } from '../src/components/Card';
import { Clock, MapPin, ChevronRight, Search, Loader2, Keyboard, HelpCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyApi, Property } from '../src/api/properties';
import { getErrorMessage } from '../src/api/errors';
import { useToast } from '../src/providers/ToastProvider';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';

const Table = dynamic(() => import('../src/components/Table').then(mod => mod.Table), {
  loading: () => <div style={{ padding: spacing[10], textAlign: 'center' }}><Loader2 className="animate-spin" /></div>,
  ssr: false
});

const Modal = dynamic(() => import('../src/components/Modal').then(mod => mod.Modal), {
  ssr: false
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties()
  });

  useEffect(() => {
    if (error) {
      showToast(getErrorMessage(error), 'error');
    }
  }, [error, showToast]);

  const filteredData = React.useMemo(() => properties?.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [], [properties, searchTerm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in search
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key.toLowerCase() === 'j') {
        // Move down
        setSelectedId(prev => {
          if (!prev && filteredData.length > 0) return filteredData[0].id;
          const currentIndex = filteredData.findIndex(item => item.id === prev);
          if (currentIndex < filteredData.length - 1) return filteredData[currentIndex + 1].id;
          return prev;
        });
      } else if (e.key.toLowerCase() === 'k') {
        // Move up
        setSelectedId(prev => {
          if (!prev && filteredData.length > 0) return filteredData[0].id;
          const currentIndex = filteredData.findIndex(item => item.id === prev);
          if (currentIndex > 0) return filteredData[currentIndex - 1].id;
          return prev;
        });
      } else if (e.key === 'Enter' && selectedId) {
        // Open selected
        router.push(`/${selectedId}`);
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        // Show help
        setShowHelp(true);
      } else if (e.key >= '1' && e.key <= '9') {
        // Jump to 1-9
        const index = parseInt(e.key) - 1;
        if (index < filteredData.length) {
          setSelectedId(filteredData[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredData, selectedId, router]);

  const columns = React.useMemo(() => [
    {
      header: 'ID',
      key: 'id',
      render: (item: Property) => (
        <span style={{ fontWeight: typography.fontWeights.semibold, color: colors.primary[600] }}>
          {item.id.slice(0, 8)}...
        </span>
      )
    },
    {
      header: 'Property Address',
      key: 'address',
      render: (item: Property) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
          <div style={{ fontWeight: typography.fontWeights.medium, color: colors.gray[900] }}>
            {item.address}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], fontSize: typography.fontSizes.xs, color: colors.gray[500] }}>
            <MapPin size={12} /> {item.city}, {item.state}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: Property) => {
        const variant = 
          item.status === 'SUBMITTED' ? 'info' : 
          item.status === 'VALUED' ? 'success' : 
          item.status === 'REJECTED' ? 'error' : 
          item.status === 'FOLLOW_UP' ? 'warning' : 'gray';
        return <Badge variant={variant}>{item.status}</Badge>;
      }
    },
    {
      header: 'Submitted Date',
      key: 'created_at',
      render: (item: Property) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], color: colors.gray[600] }}>
          <Clock size={14} /> {new Date(item.created_at).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: () => (
        <div 
          aria-hidden="true"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            color: colors.gray[400],
          }}
        >
          <ChevronRight size={20} />
        </div>
      )
    }
  ], []);

  return (
    <div style={{ padding: isMobile ? spacing[4] : spacing[8], maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[8] }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: isMobile ? typography.fontSizes.xl : typography.fontSizes['3xl'], fontWeight: typography.fontWeights.bold, color: colors.gray[900], marginBottom: spacing[1] }}>
            Welcome back, Valuer
          </h1>
          <p style={{ color: colors.gray[500], fontSize: typography.fontSizes.sm }}>
            You have {properties?.length || 0} properties pending valuation
          </p>
        </motion.div>
        <div style={{ display: 'flex', gap: spacing[3] }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHelp(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing[2],
              padding: `${spacing[2]}px ${spacing[3]}px`,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.white,
              color: colors.gray[600],
              cursor: 'pointer',
              fontSize: typography.fontSizes.sm
            }}
          >
            <Keyboard size={18} />
            {!isMobile && "Shortcuts"}
          </motion.button>
        </div>
      </div>

      {isLoading ? (
        <div 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: spacing[4] }}
          role="status"
          aria-label="Loading properties"
        >
          <div style={{ position: 'relative', width: 60, height: 60 }}>
            {/* Outer rotating rays */}
            <div className="animate-ray-rotate" style={{ 
              position: 'absolute', 
              inset: 0, 
              border: '2px dashed #E31E24', 
              borderRadius: '50%',
              opacity: 0.3
            }} />
            {/* Pulsing Sun Center */}
            <div className="animate-pulse-sun" style={{ 
              position: 'absolute', 
              inset: spacing[2], 
              backgroundColor: '#E31E24', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(227, 30, 36, 0.4)'
            }}>
              <div style={{ width: '50%', height: '50%', border: '2px solid white', borderRadius: '50%', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.semibold, color: colors.gray[900] }}>
              Money Simplified
            </div>
            <div style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500] }}>
              Loading valuation queue...
            </div>
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: spacing[8], textAlign: 'center' }}>
          <div style={{ color: colors.error, marginBottom: spacing[4] }}>Failed to load properties. Please try again.</div>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: spacing[4], 
            marginBottom: spacing[6],
            alignItems: isMobile ? 'stretch' : 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing[2],
              backgroundColor: colors.white,
              padding: `${spacing[2]}px ${spacing[3]}px`,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              flex: 1
            }}>
              <Search size={18} color={colors.gray[400]} />
              <input 
                type="text" 
                placeholder="Search queue..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: typography.fontSizes.sm,
                  width: '100%'
                }}
              />
            </div>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
              }
            }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
              gap: spacing[6], 
              marginBottom: spacing[8] 
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <Card>
                <div id="stat-total" style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500], marginBottom: spacing[1] }}>Total Assigned</div>
                <div aria-labelledby="stat-total" style={{ fontSize: typography.fontSizes['2xl'], fontWeight: typography.fontWeights.bold, color: colors.gray[900] }}>
                  {properties?.length || 0}
                </div>
              </Card>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <Card>
                <div id="stat-pending" style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500], marginBottom: spacing[1] }}>Pending Review</div>
                <div aria-labelledby="stat-pending" style={{ fontSize: typography.fontSizes['2xl'], fontWeight: typography.fontWeights.bold, color: colors.primary[600] }}>
                  {properties?.filter(p => p.status === 'SUBMITTED').length || 0}
                </div>
              </Card>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <Card>
                <div id="stat-valued" style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500], marginBottom: spacing[1] }}>Valued (Total)</div>
                <div aria-labelledby="stat-valued" style={{ fontSize: typography.fontSizes['2xl'], fontWeight: typography.fontWeights.bold, color: colors.success }}>
                  {properties?.filter(p => p.status === 'VALUED').length || 0}
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <Card title="Current Valuation Queue" style={{ padding: 0 }}>
            <Table 
              columns={columns} 
              data={filteredData} 
              onRowClick={(item) => router.push(`/${item.id}`)} 
              selectedId={selectedId || undefined}
            />
          </Card>
        </>
      )}

      {/* Help Modal */}
      <Modal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
        title="Keyboard Shortcuts"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <kbd style={{ 
              backgroundColor: colors.gray[100], 
              padding: `${spacing[1]}px ${spacing[3]}px`, 
              borderRadius: 4,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              minWidth: 40,
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 0 ${colors.gray[300]}`
            }}>J</kbd>
            <div style={{ color: colors.gray[600] }}>Move selection down</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <kbd style={{ 
              backgroundColor: colors.gray[100], 
              padding: `${spacing[1]}px ${spacing[3]}px`, 
              borderRadius: 4,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              minWidth: 40,
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 0 ${colors.gray[300]}`
            }}>K</kbd>
            <div style={{ color: colors.gray[600] }}>Move selection up</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <kbd style={{ 
              backgroundColor: colors.gray[100], 
              padding: `${spacing[1]}px ${spacing[3]}px`, 
              borderRadius: 4,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              minWidth: 40,
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 0 ${colors.gray[300]}`
            }}>Enter</kbd>
            <div style={{ color: colors.gray[600] }}>Open selected property</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <kbd style={{ 
              backgroundColor: colors.gray[100], 
              padding: `${spacing[1]}px ${spacing[3]}px`, 
              borderRadius: 4,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              minWidth: 40,
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 0 ${colors.gray[300]}`
            }}>1-9</kbd>
            <div style={{ color: colors.gray[600] }}>Jump to item by number</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <kbd style={{ 
              backgroundColor: colors.gray[100], 
              padding: `${spacing[1]}px ${spacing[3]}px`, 
              borderRadius: 4,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              minWidth: 40,
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 0 ${colors.gray[300]}`
            }}>?</kbd>
            <div style={{ color: colors.gray[600] }}>Show this help menu</div>
          </div>
        </div>
      </Modal>

      {/* Floating help button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelp(true)}
        aria-label="Keyboard Shortcuts"
        title="Keyboard Shortcuts (?)"
        style={{
          position: 'fixed',
          bottom: spacing[8],
          right: spacing[8],
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          cursor: 'pointer',
          color: colors.gray[500]
        }}
      >
        <HelpCircle size={24} aria-hidden="true" />
      </motion.button>
    </div>
  );
}

