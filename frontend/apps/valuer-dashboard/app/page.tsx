'use client';

import { colors, shadow, spacing, typography } from '@propflow/theme';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Building2,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  HelpCircle,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '../src/api/errors';
import { Property, propertyApi } from '../src/api/properties';
import { Badge } from '../src/components/Badge';
import { Card } from '../src/components/Card';
import { useMediaQuery } from '../src/hooks/useMediaQuery';
import { useToast } from '../src/providers/ToastProvider';
import { useAuthStore } from '../src/store/useAuthStore';

const Table = dynamic(() => import('../src/components/Table').then((mod) => mod.Table<Property>), {
  loading: () => (
    <div style={{ padding: spacing[10], textAlign: 'center' }}>
      <Loader2 className="animate-spin" style={{ color: colors.primary[500] }} />
    </div>
  ),
  ssr: false,
});

const Modal = dynamic(() => import('../src/components/Modal').then((mod) => mod.Modal), {
  ssr: false,
});

const DEMO_QUEUE_PROPERTIES: Property[] = [
  {
    id: 'prop-2210-ab01',
    address: 'DLF The Camellias, Tower A',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    property_type: 'APARTMENT',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: 'u1',
  },
  {
    id: 'prop-5512-xc98',
    address: 'Lantana Lane, Sector 44',
    city: 'Chandigarh',
    state: 'Punjab',
    pincode: '160044',
    property_type: 'VILLA',
    status: 'FOLLOW_UP',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: 'u1',
  },
  {
    id: 'prop-3301-mm44',
    address: 'Mantri Alpyne, Phase 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560061',
    property_type: 'APARTMENT',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user_id: 'u1',
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Property;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuthStore();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const {
    data: remoteProperties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties(),
  });

  const properties = React.useMemo(() => {
    return remoteProperties && remoteProperties.length > 0
      ? remoteProperties
      : DEMO_QUEUE_PROPERTIES;
  }, [remoteProperties]);

  useEffect(() => {
    if (error) {
      showToast(getErrorMessage(error), 'error');
    }
  }, [error, showToast]);

  const filteredData = React.useMemo(() => {
    let result = [...(properties || [])];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(lowerSearch) ||
          item.address.toLowerCase().includes(lowerSearch) ||
          item.city.toLowerCase().includes(lowerSearch),
      );
    }

    // Filter
    if (filterStatuses.length > 0) {
      result = result.filter((item) => filterStatuses.includes(item.status));
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.field] ?? '';
        const bVal = b[sortConfig.field] ?? '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [properties, searchTerm, filterStatuses, sortConfig]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key.toLowerCase() === 'j') {
        setSelectedId((prev) => {
          if (!prev && filteredData.length > 0) return filteredData[0].id;
          const currentIndex = filteredData.findIndex((item) => item.id === prev);
          if (currentIndex < filteredData.length - 1) return filteredData[currentIndex + 1].id;
          return prev;
        });
      } else if (e.key.toLowerCase() === 'k') {
        setSelectedId((prev) => {
          if (!prev && filteredData.length > 0) return filteredData[0].id;
          const currentIndex = filteredData.findIndex((item) => item.id === prev);
          if (currentIndex > 0) return filteredData[currentIndex - 1].id;
          return prev;
        });
      } else if (e.key === 'Enter' && selectedId) {
        router.push(`/${selectedId}`);
      } else if (e.key === '?') {
        setShowHelp(true);
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < filteredData.length) {
          setSelectedId(filteredData[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredData, selectedId, router]);

  const columns = React.useMemo(
    () => [
      {
        header: 'Case ID',
        key: 'id',
        render: (item: Property) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: colors.gray[50],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.gray[400],
                border: `1px solid ${colors.gray[100]}`,
              }}
            >
              <FileText size={16} />
            </div>
            <code
              style={{
                fontFamily: typography.fonts.mono,
                fontSize: 11,
                fontWeight: 700,
                color: colors.gray[500],
                letterSpacing: 1,
              }}
            >
              {item.id.split('-').pop()?.toUpperCase() || item.id.slice(0, 8).toUpperCase()}
            </code>
          </div>
        ),
      },
      {
        header: 'Property & Location',
        key: 'address',
        render: (item: Property) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 800, color: colors.gray[900], fontSize: 14 }}>
              {item.address}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: colors.gray[400],
                fontWeight: 600,
              }}
            >
              <MapPin size={10} color={colors.primary[400]} /> {item.city}, {item.state}
            </div>
          </div>
        ),
      },
      {
        header: 'Status',
        key: 'status',
        render: (item: Property) => {
          const variant =
            item.status === 'SUBMITTED'
              ? 'info'
              : item.status === 'VALUED'
                ? 'success'
                : item.status === 'REJECTED'
                  ? 'error'
                  : item.status === 'FOLLOW_UP'
                    ? 'warning'
                    : 'gray';
          return (
            <Badge variant={variant} style={{ fontWeight: 700, fontSize: 10 }}>
              {item.status}
            </Badge>
          );
        },
      },
      {
        header: 'Submission',
        key: 'created_at',
        render: (item: Property) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              color: colors.gray[600],
              fontSize: typography.fontSizes.xs,
            }}
          >
            <Clock size={12} color={colors.primary[400]} />{' '}
            {new Date(item.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        ),
      },
      {
        header: '',
        key: 'actions',
        render: (item: Property) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: colors.primary[50],
                borderColor: colors.primary[200],
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.gray[100]}`,
                padding: '8px 16px',
                borderRadius: 12,
                cursor: 'pointer',
                color: colors.primary[600],
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.2s',
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${item.id}`);
              }}
            >
              Open Case <ChevronRight size={14} />
            </motion.button>
          </div>
        ),
      },
    ],
    [],
  );

  const stats = [
    {
      label: 'Active Queue',
      value: properties?.length || 0,
      sub: 'Total assigned cases',
      icon: Building2,
      status: 'ALL',
      color: colors.primary[600],
      bgColor: colors.primary[50],
    },
    {
      label: 'Pending Audit',
      value: properties?.filter((p) => p.status === 'SUBMITTED').length || 0,
      sub: 'Awaiting valuation',
      icon: Clock,
      status: 'SUBMITTED',
      color: colors.warning[600],
      bgColor: colors.warning[50],
    },
    {
      label: 'Verification',
      value: properties?.filter((p) => p.status === 'FOLLOW_UP').length || 0,
      sub: 'Clarification required',
      icon: HelpCircle,
      status: 'FOLLOW_UP',
      color: colors.error[600],
      bgColor: colors.error[50],
    },
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatuses([]);
    setSortConfig(null);
  };

  return (
    <div
      style={{
        minHeight: '100%',
        backgroundColor: colors.gray[50],
        position: 'relative',
        paddingBottom: spacing[20],
      }}
    >
      {/* Premium Background Effects */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-5%',
            right: '-10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, rgba(0, 100, 255, 0.04) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '-15%',
            width: '70vw',
            height: '70vw',
            background: 'radial-gradient(circle, rgba(100, 0, 255, 0.03) 0%, transparent 70%)',
            filter: 'blur(140px)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1400,
          margin: '0 auto',
          padding: isMobile ? spacing[6] : `${spacing[10]}px ${spacing[12]}px`,
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: spacing[12] }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: spacing[12] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: colors.primary[600],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 8px 20px ${colors.primary[600]}33`,
                }}
              >
                <Clock size={22} />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: colors.primary[700],
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                Mission Control
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: isMobile ? 36 : 56,
                    fontWeight: 900,
                    color: colors.gray[900],
                    margin: 0,
                    lineHeight: 1,
                    letterSpacing: -2,
                  }}
                >
                  Property <span style={{ color: colors.primary[600] }}>Queue</span>
                </h1>
                <p
                  style={{
                    color: colors.gray[500],
                    fontSize: 18,
                    fontWeight: 500,
                    maxWidth: 600,
                    margin: 0,
                    marginTop: 16,
                    lineHeight: 1.6,
                  }}
                >
                  Orchestrate your active valuation workflow, prioritize time-sensitive audits, and
                  manage field evidence.
                </p>
              </div>
              {!isMobile && (
                <motion.button
                  whileHover={{ y: -2, boxShadow: shadow.md }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: colors.white,
                    color: colors.gray[800],
                    border: `1px solid ${colors.gray[200]}`,
                    padding: '14px 24px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: shadow.sm,
                  }}
                  onClick={() => {
                    showToast('Syncing with Central Repository...', 'info');
                    setTimeout(() => showToast('Data synchronization complete', 'success'), 1500);
                  }}
                >
                  <HelpCircle size={18} color={colors.primary[500]} /> Refresh Workspace
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 24,
            }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  if (stat.status === 'ALL') {
                    setFilterStatuses([]);
                  } else {
                    setFilterStatuses([stat.status]);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  variant="glass"
                  style={{
                    padding: 24,
                    borderRadius: 32,
                    border: `1px solid ${filterStatuses.includes(stat.status) ? stat.color : colors.gray[100]}`,
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease',
                    transform: filterStatuses.includes(stat.status) ? 'translateY(-4px)' : 'none',
                    boxShadow: filterStatuses.includes(stat.status)
                      ? `0 10px 30px ${stat.color}15`
                      : shadow.sm,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        background: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      <stat.icon size={24} />
                    </div>
                    {filterStatuses.includes(stat.status) && (
                      <Badge
                        variant="info"
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          background: stat.color,
                          color: 'white',
                        }}
                      >
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: colors.gray[900],
                      marginBottom: 4,
                      letterSpacing: -1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.gray[500] }}>
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search & Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            variant="glass"
            style={{
              borderRadius: 40,
              border: `1px solid ${colors.gray[100]}`,
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
          >
            <div
              style={{
                padding: '32px 40px',
                borderBottom: `1px solid ${colors.gray[100]}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.gray[900] }}>
                    Active Assignments
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: colors.warning[400],
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: colors.gray[400],
                        textTransform: 'uppercase',
                      }}
                    >
                      System Active •{' '}
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <Badge variant="gray" style={{ fontWeight: 800 }}>
                  {filteredData.length} Cases
                </Badge>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  width: isMobile ? '100%' : 'auto',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: colors.gray[50],
                    borderRadius: 20,
                    border: `1px solid ${colors.gray[200]}`,
                    padding: '0 16px',
                    width: isMobile ? '100%' : 300,
                    boxShadow: shadow.sm,
                  }}
                >
                  <Search size={18} color={colors.gray[400]} />
                  <input
                    type="text"
                    placeholder="Search IDs, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      padding: '14px',
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.gray[700],
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ backgroundColor: colors.gray[100] }}
                  onClick={() => {
                    setFilterStatuses((prev) =>
                      prev.includes('SUBMITTED')
                        ? prev.filter((s) => s !== 'SUBMITTED')
                        : [...prev, 'SUBMITTED'],
                    );
                  }}
                  style={{
                    padding: '0 16px',
                    height: 48,
                    borderRadius: 20,
                    border: `1px solid ${filterStatuses.includes('SUBMITTED') ? colors.primary[200] : colors.gray[200]}`,
                    background: filterStatuses.includes('SUBMITTED') ? colors.primary[50] : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    color: filterStatuses.includes('SUBMITTED')
                      ? colors.primary[600]
                      : colors.gray[600],
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <Filter size={16} />
                  {filterStatuses.includes('SUBMITTED') ? 'Pending Only' : 'All Statuses'}
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: colors.gray[100] }}
                  onClick={() => {
                    setSortConfig((prev) => {
                      if (!prev) return { field: 'id', direction: 'asc' };
                      if (prev.field === 'id') return { field: 'address', direction: 'asc' };
                      return null;
                    });
                  }}
                  style={{
                    padding: '0 16px',
                    height: 48,
                    borderRadius: 20,
                    border: `1px solid ${sortConfig ? colors.primary[200] : colors.gray[200]}`,
                    background: sortConfig ? colors.primary[50] : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    color: sortConfig ? colors.primary[600] : colors.gray[600],
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <ArrowUpDown size={16} />
                  {sortConfig?.field === 'id'
                    ? 'ID Sort'
                    : sortConfig?.field === 'address'
                      ? 'Location Sort'
                      : 'Sort'}
                </motion.button>

                {(searchTerm || filterStatuses.length > 0 || sortConfig) && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={clearFilters}
                    style={{
                      height: 48,
                      padding: '0 16px',
                      borderRadius: 20,
                      border: 'none',
                      background: colors.gray[100],
                      color: colors.gray[500],
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </div>

            <div style={{ padding: '0 20px' }}>
              <Table
                columns={columns}
                data={filteredData}
                onRowClick={(item) => router.push(`/${item.id}`)}
                selectedId={selectedId || undefined}
              />
            </div>

            {filteredData.length === 0 && (
              <div style={{ padding: 100, textAlign: 'center' }}>
                <Search size={48} color={colors.gray[200]} style={{ marginBottom: 20 }} />
                <h4 style={{ color: colors.gray[500], margin: 0 }}>No active assignments found</h4>
                <p style={{ color: colors.gray[400], fontSize: 13, marginTop: 8 }}>
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Quick Navigation">
        <div style={{ paddingBottom: 10 }}>
          <div
            style={{
              padding: 24,
              backgroundColor: `${colors.primary[50]}80`,
              borderRadius: 24,
              marginBottom: 24,
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <HelpCircle size={20} color={colors.primary[600]} />
              <span style={{ fontWeight: 800, color: colors.primary[700], fontSize: 13 }}>
                KEYBOARD SHORTCUTS
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { k: 'J / K', d: 'Navigate through assignment list' },
                { k: 'Enter', d: 'Open selected property case' },
                { k: '1-9', d: 'Quick jump to specific row' },
                { k: '?', d: 'Open this help menu' },
              ].map((item) => (
                <div
                  key={item.k}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <code
                    style={{
                      background: colors.white,
                      padding: '4px 8px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      border: `1px solid ${colors.primary[200]}`,
                    }}
                  >
                    {item.k}
                  </code>
                  <span style={{ fontSize: 13, color: colors.primary[600], fontWeight: 600 }}>
                    {item.d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
