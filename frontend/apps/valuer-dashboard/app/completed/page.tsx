'use client';

import React, { useState } from 'react';
import { spacing, typography, colors, borderRadius, layout } from '@propflow/theme';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { Badge } from '../../src/components/Badge';
import { Card } from '../../src/components/Card';
import {
  Clock,
  MapPin,
  ChevronRight,
  Search,
  Loader2,
  CheckCircle2,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyApi, Property } from '../../src/api/properties';
import { getErrorMessage } from '../../src/api/errors';
import { useToast } from '../../src/providers/ToastProvider';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Table = dynamic(() => import('../../src/components/Table').then((mod) => mod.Table), {
  loading: () => (
    <div style={{ padding: spacing[10], textAlign: 'center' }}>
      <Loader2 className="animate-spin" style={{ color: colors.primary[500] }} />
    </div>
  ),
  ssr: false,
});

export default function CompletedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties(),
  });

  const completedProperties = properties?.filter((p) => p.status === 'VALUED') || [];

  const filteredData = completedProperties.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = React.useMemo(
    () => [
      {
        header: 'ID',
        key: 'id',
        render: (item: Property) => (
          <span
            style={{
              fontWeight: typography.fontWeights.semibold,
              color: colors.primary[600],
              fontFamily: typography.fonts.mono,
              fontSize: typography.fontSizes.sm,
            }}
          >
            {item.id.slice(0, 8)}
          </span>
        ),
      },
      {
        header: 'Property Address',
        key: 'address',
        render: (item: Property) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
            <div style={{ fontWeight: typography.fontWeights.medium, color: colors.gray[900] }}>
              {item.address}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                fontSize: typography.fontSizes.xs,
                color: colors.gray[500],
              }}
            >
              <MapPin size={12} /> {item.city}, {item.state}
            </div>
          </div>
        ),
      },
      {
        header: 'Status',
        key: 'status',
        render: () => <Badge variant="success">VALUED</Badge>,
      },
      {
        header: 'Valuation Date',
        key: 'updated_at',
        render: (item: Property) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              color: colors.gray[600],
              fontSize: typography.fontSizes.sm,
            }}
          >
            <CheckCircle2 size={14} />{' '}
            {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}
          </div>
        ),
      },
      {
        header: '',
        key: 'actions',
        render: () => (
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              color: colors.gray[400],
            }}
          >
            <ChevronRight size={20} />
          </div>
        ),
      },
    ],
    [],
  );

  const stats = [
    {
      label: 'Total Completed',
      value: completedProperties.length,
      icon: CheckCircle2,
      color: colors.success[600],
      bgColor: colors.success[50],
    },
    {
      label: 'This Month',
      value: completedProperties.filter(
        (p) => p.updated_at && new Date(p.updated_at).getMonth() === new Date().getMonth(),
      ).length,
      icon: Calendar,
      color: colors.primary[600],
      bgColor: colors.primary[50],
    },
    {
      label: 'Avg. Value',
      value: completedProperties.length
        ? `₹${(
            completedProperties.reduce((sum, p) => sum + (p.estimated_value || 0), 0) /
            completedProperties.length
          ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '₹0',
      icon: TrendingUp,
      color: colors.gray[900],
      bgColor: colors.gray[100],
    },
  ];

  return (
    <div
      style={{
        padding: isMobile ? spacing[5] : spacing[8],
        maxWidth: layout.containerMaxWidth,
        margin: '0 auto',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? spacing[4] : 0,
          marginBottom: spacing[8],
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1
            style={{
              fontSize: isMobile ? typography.fontSizes.xl : typography.fontSizes['2xl'],
              fontWeight: typography.fontWeights.bold,
              color: colors.gray[900],
              marginBottom: spacing[1],
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            Completed Valuations
          </h1>
          <p
            style={{
              color: colors.gray[500],
              fontSize: typography.fontSizes.base,
              lineHeight: typography.lineHeights.relaxed,
            }}
          >
            {completedProperties.length} properties have been valued
          </p>
        </motion.div>
      </div>

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            gap: spacing[6],
          }}
          role="status"
          aria-label="Loading completed properties"
        >
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <div
              className="animate-ray-rotate"
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px dashed ${colors.primary[500]}`,
                borderRadius: '50%',
                opacity: 0.4,
              }}
            />
            <div
              className="animate-pulse-sun"
              style={{
                position: 'absolute',
                inset: spacing[2],
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(227, 30, 36, 0.4)',
              }}
            >
              <div
                style={{
                  width: '50%',
                  height: '50%',
                  border: '2px solid white',
                  borderRadius: '50%',
                  borderTopColor: 'transparent',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: typography.fontSizes.lg,
                fontWeight: typography.fontWeights.semibold,
                color: colors.gray[900],
                marginBottom: spacing[1],
              }}
            >
              Loading Completed
            </div>
            <div style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500] }}>
              Fetching valued properties...
            </div>
          </div>
        </div>
      ) : error ? (
        <div
          style={{
            padding: spacing[10],
            textAlign: 'center',
            backgroundColor: colors.error[50],
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.error[200]}`,
          }}
        >
          <div
            style={{
              color: colors.error[600],
              marginBottom: spacing[2],
              fontWeight: typography.fontWeights.medium,
            }}
          >
            Failed to load completed properties
          </div>
          <div style={{ color: colors.error[500], fontSize: typography.fontSizes.sm }}>
            Please refresh the page or try again later
          </div>
        </div>
      ) : completedProperties.length === 0 ? (
        <div
          style={{
            padding: spacing[12],
            textAlign: 'center',
            backgroundColor: colors.gray[50],
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.gray[200]}`,
          }}
        >
          <CheckCircle2 size={64} style={{ color: colors.gray[300], marginBottom: spacing[4] }} />
          <div
            style={{
              fontSize: typography.fontSizes.xl,
              fontWeight: typography.fontWeights.semibold,
              color: colors.gray[700],
              marginBottom: spacing[2],
            }}
          >
            No Completed Valuations Yet
          </div>
          <div style={{ color: colors.gray[500], fontSize: typography.fontSizes.base }}>
            Properties you complete will appear here
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
              gap: spacing[5],
              marginBottom: spacing[8],
            }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Card style={{ padding: spacing[5] }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: typography.fontSizes.sm,
                            color: colors.gray[500],
                            marginBottom: spacing[2],
                            fontWeight: typography.fontWeights.medium,
                          }}
                        >
                          {stat.label}
                        </div>
                        <div
                          style={{
                            fontSize: typography.fontSizes['3xl'],
                            fontWeight: typography.fontWeights.bold,
                            color: stat.color,
                            lineHeight: 1,
                          }}
                        >
                          {stat.value}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          backgroundColor: stat.bgColor,
                          borderRadius: borderRadius.lg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} color={stat.color} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              backgroundColor: colors.white,
              padding: `${spacing[3]}px ${spacing[4]}px`,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.border}`,
              marginBottom: spacing[8],
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <Search size={20} color={colors.gray[400]} />
            <input
              type="text"
              placeholder="Search by ID or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: typography.fontSizes.base,
                width: '100%',
                color: colors.gray[900],
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  background: colors.gray[100],
                  border: 'none',
                  borderRadius: borderRadius.base,
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  cursor: 'pointer',
                  fontSize: typography.fontSizes.xs,
                  color: colors.gray[500],
                }}
              >
                Clear
              </button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  padding: `${spacing[4]}px ${spacing[5]}px`,
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h2
                  style={{
                    fontSize: typography.fontSizes.base,
                    fontWeight: typography.fontWeights.semibold,
                    color: colors.gray[900],
                    margin: 0,
                  }}
                >
                  Valued Properties
                </h2>
                <span
                  style={{
                    fontSize: typography.fontSizes.sm,
                    color: colors.gray[500],
                  }}
                >
                  {filteredData.length} properties
                </span>
              </div>
              <Table
                columns={columns}
                data={filteredData}
                onRowClick={(item) => router.push(`/${item.id}`)}
                selectedId={selectedId || undefined}
              />
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
