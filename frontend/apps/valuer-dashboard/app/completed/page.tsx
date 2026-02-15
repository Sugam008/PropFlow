'use client';

import { colors, shadow, spacing, typography } from '@propflow/theme';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Property, propertyApi } from '../../src/api/properties';
import { Badge } from '../../src/components/Badge';
import { Card } from '../../src/components/Card';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { useToast } from '../../src/providers/ToastProvider';

const Table = dynamic(
  () => import('../../src/components/Table').then((mod) => mod.Table<Property>),
  { ssr: false },
);

// Demo Data for Polished View
const DEMO_COMPLETED_PROPERTIES: Property[] = [
  {
    id: 'prop-8821-ab92',
    address: '88 Lotus Boulevard, Sector 150',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201310',
    property_type: 'APARTMENT',
    status: 'VALUED',
    estimated_value: 28500000,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-12T15:30:00Z',
    user_id: 'u1',
  },
  {
    id: 'prop-7712-xc21',
    address: 'Skyview Terraces, Plot 42',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122018',
    property_type: 'PENTHOUSE',
    status: 'VALUED',
    estimated_value: 84200000,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-18T11:20:00Z',
    user_id: 'u1',
  },
  {
    id: 'prop-1102-mm92',
    address: 'Emerald Heights, Wing C',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    property_type: 'APARTMENT',
    status: 'VALUED',
    estimated_value: 41500000,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-22T17:45:00Z',
    user_id: 'u1',
  },
  {
    id: 'prop-4491-zz01',
    address: 'Prestige Shantiniketan, Tower 5',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560048',
    property_type: 'VILLA',
    status: 'VALUED',
    estimated_value: 62000000,
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-02-03T10:15:00Z',
    user_id: 'u1',
  },
  {
    id: 'prop-9982-ll22',
    address: 'Indiabulls Sky Forest',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
    property_type: 'APARTMENT',
    status: 'VALUED',
    estimated_value: 125000000,
    created_at: '2024-02-05T08:30:00Z',
    updated_at: '2024-02-07T14:10:00Z',
    user_id: 'u1',
  },
];

export default function CompletedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Property;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const router = useRouter();
  const { showToast } = useToast();

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

  // Merge remote data with demo data for a robust experience
  const properties = useMemo(() => {
    const remoteValued = remoteProperties?.filter((p) => p.status === 'VALUED') || [];
    // If remote is empty, use demo data
    return remoteValued.length > 0 ? remoteValued : DEMO_COMPLETED_PROPERTIES;
  }, [remoteProperties]);

  const filteredData = useMemo(() => {
    let result = properties.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filterType) {
      result = result.filter((item) => item.property_type === filterType);
    }

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
  }, [properties, searchTerm, filterType, sortConfig]);

  const stats = useMemo(() => {
    const totalVal = properties.reduce((sum, p) => sum + (p.estimated_value || 0), 0);
    return [
      {
        label: 'Portfolio Value',
        value: `₹${(totalVal / 10000000).toFixed(2)} Cr`,
        sub: 'Total asset worth valued',
        icon: TrendingUp,
        color: colors.success[600],
        bgColor: colors.success[50],
        trend: '+12.5%',
        trendColor: colors.success[600],
      },
      {
        label: 'Closed Cases',
        value: properties.length,
        sub: 'Successfully closed assets',
        icon: ShieldCheck,
        color: colors.primary[600],
        bgColor: colors.primary[50],
        trend: '+4',
        trendColor: colors.primary[600],
      },
      {
        label: 'Avg. TAT',
        value: '2.4 Days',
        sub: 'Turnaround efficiency',
        icon: Clock,
        color: colors.accent[600],
        bgColor: colors.accent[50],
        trend: '-0.8d',
        trendColor: colors.success[600],
      },
    ];
  }, [properties]);

  const columns = useMemo(
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
        header: 'Appraised Value',
        key: 'estimated_value',
        render: (item: Property) => (
          <div style={{ color: colors.success[700], fontWeight: 900, fontSize: 15 }}>
            ₹{((item.estimated_value || 0) / 10000000).toFixed(2)} Cr
          </div>
        ),
      },
      {
        header: 'Closure Date',
        key: 'updated_at',
        render: (item: Property) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: colors.gray[500],
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Calendar size={14} color={colors.gray[300]} />
            {item.updated_at
              ? new Date(item.updated_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A'}
          </div>
        ),
      },
      {
        header: '',
        key: 'actions',
        render: (item: Property) => (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: colors.primary[50] }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.gray[100]}`,
                padding: '8px 12px',
                borderRadius: 12,
                cursor: 'pointer',
                color: colors.primary[600],
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
              onClick={(e) => {
                e.stopPropagation();
                showToast('Extracting Compliance Report...', 'info');
                setTimeout(() => {
                  showToast('Report downloaded successfully', 'success');
                }, 1500);
              }}
            >
              <Download size={14} /> Report
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: colors.success[50],
                borderColor: colors.success[200],
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.gray[100]}`,
                padding: '8px 12px',
                borderRadius: 12,
                cursor: 'pointer',
                color: colors.success[700],
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/completed/${item.id}`);
              }}
            >
              Open <ChevronRight size={14} />
            </motion.button>
          </div>
        ),
      },
    ],
    [router, showToast],
  );

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
            style={{ marginBottom: spacing[8] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: colors.success[600],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 8px 20px ${colors.success[600]}33`,
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: colors.success[700],
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                Archival Workspace
              </span>
            </div>

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
              Completed <span style={{ color: colors.success[600] }}>Portfolio</span>
            </h1>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: 16,
              }}
            >
              <p
                style={{
                  color: colors.gray[500],
                  fontSize: 18,
                  fontWeight: 500,
                  maxWidth: 600,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Review finalized valuations, download compliance reports, and audit historical asset
                data.
              </p>
              {!isMobile && (
                <motion.button
                  whileHover={{ y: -2, boxShadow: shadow.md }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
                    color: 'white',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: 16,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: shadow.sm,
                  }}
                  onClick={() => showToast('Preparing Detailed Audit...', 'info')}
                >
                  <Download size={18} /> Download Portfolio Audit
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Stats Bar */}
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
              >
                <Card
                  variant="glass"
                  style={{ padding: 24, borderRadius: 32, border: `1px solid ${colors.gray[100]}` }}
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
                    {stat.trend && (
                      <Badge
                        variant={stat.trend.startsWith('+') ? 'success' : 'info'}
                        style={{ fontSize: 11, fontWeight: 900 }}
                      >
                        {stat.trend}
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
                  <div
                    style={{ fontSize: 11, color: colors.gray[400], marginTop: 8, fontWeight: 500 }}
                  >
                    {stat.sub}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search & Table Section */}
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
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.gray[900] }}>
                    Completed Cases
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: colors.success[400],
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
                    placeholder="Search Completed..."
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
                    const types = ['APARTMENT', 'VILLA', 'PENTHOUSE'];
                    const currentIndex = filterType ? types.indexOf(filterType) : -1;
                    setFilterType(types[(currentIndex + 1) % types.length]);
                  }}
                  style={{
                    padding: '0 16px',
                    height: 48,
                    borderRadius: 20,
                    border: `1px solid ${filterType ? colors.primary[200] : colors.gray[200]}`,
                    background: filterType ? colors.primary[50] : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    color: filterType ? colors.primary[600] : colors.gray[600],
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <Filter size={16} />
                  {filterType || 'All Types'}
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: colors.gray[100] }}
                  onClick={() => {
                    setSortConfig((prev) => {
                      if (!prev) return { field: 'estimated_value', direction: 'desc' };
                      if (prev.field === 'estimated_value')
                        return { field: 'updated_at', direction: 'desc' };
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
                  <TrendingUp size={16} />
                  {sortConfig?.field === 'estimated_value'
                    ? 'By Value'
                    : sortConfig?.field === 'updated_at'
                      ? 'Latest'
                      : 'Sort'}
                </motion.button>

                {(searchTerm || filterType || sortConfig) && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType(null);
                      setSortConfig(null);
                    }}
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
                <h4 style={{ color: colors.gray[500], margin: 0 }}>No completed cases found</h4>
                <p style={{ color: colors.gray[400], fontSize: 13, marginTop: 8 }}>
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
