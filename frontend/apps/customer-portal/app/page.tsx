'use client';

import { colors, shadow } from '@propflow/theme';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  LayoutGrid,
  MapPin,
  Plus,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { Property, PropertyPhoto, propertyApi } from '../src/api/property';
import { Badge } from '../src/components/Badge';
import { Card } from '../src/components/Card';
import { useMediaQuery } from '../src/hooks/useMediaQuery';

const DEMO_PROPERTIES = [
  {
    id: 'prop-2210-ab01',
    address: 'DLF The Camellias, Tower A',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    property_type: 'APARTMENT',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    photos: [
      {
        s3_url:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      },
    ] as PropertyPhoto[],
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
    photos: [
      {
        s3_url:
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      },
    ] as PropertyPhoto[],
  },
  {
    id: 'prop-3301-mm44',
    address: 'Mantri Alpyne, Phase 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560061',
    property_type: 'APARTMENT',
    status: 'VALUED',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    photos: [
      {
        s3_url:
          'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80',
      },
    ] as PropertyPhoto[],
  },
  {
    id: 'prop-9981-zz21',
    address: 'Prestige Shantiniketan, Tower C',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560048',
    property_type: 'APARTMENT',
    status: 'DRAFT',
    created_at: new Date(Date.now() - 240000).toISOString(),
    photos: [
      {
        s3_url:
          'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80',
      },
    ] as PropertyPhoto[],
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const { data: remoteProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties(),
  });

  const properties = useMemo(() => {
    return remoteProperties && remoteProperties.length > 0
      ? remoteProperties
      : (DEMO_PROPERTIES as unknown as Property[]);
  }, [remoteProperties]);

  const filteredData = useMemo(() => {
    let result = [...(properties || [])];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.address.toLowerCase().includes(lowerSearch) ||
          item.city.toLowerCase().includes(lowerSearch) ||
          item.id.toLowerCase().includes(lowerSearch),
      );
    }
    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus);
    }
    result.sort((a, b) => {
      const aVal = a.created_at ?? '';
      const bVal = b.created_at ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [properties, searchTerm, filterStatus, sortOrder]);

  const statusOptions = ['VALUED', 'SUBMITTED', 'FOLLOW_UP', 'DRAFT'];

  return (
    <div style={{ minHeight: '100%', backgroundColor: colors.gray[50], overflowX: 'hidden' }}>
      {/* --- HERO SECTION --- */}
      <section
        style={{ padding: isMobile ? '20px' : '40px 48px', maxWidth: 1400, margin: '0 auto' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
            padding: isMobile ? '32px 20px' : '60px 80px',
            borderRadius: isMobile ? 28 : 48,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
          }}
        >
          {/* Abstract background blobs */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: isMobile ? 200 : 400,
              height: isMobile ? 200 : 400,
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: isTablet ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: isMobile ? 32 : 48,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 800,
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <LayoutGrid size={14} /> PORTFOLIO
              </div>

              <h1
                style={{
                  fontSize: isMobile ? 32 : 56,
                  fontWeight: 900,
                  color: 'white',
                  margin: 0,
                  letterSpacing: -1.5,
                  lineHeight: 1,
                }}
              >
                My <span style={{ opacity: 0.6 }}>Properties</span>
              </h1>

              <p
                style={{
                  fontSize: isMobile ? 15 : 18,
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginTop: 16,
                  maxWidth: 440,
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Manage your real-time valuations and property portfolio from this central command
                center.
              </p>
            </div>

            {/* Stats: Optimized to fit on a single row on mobile without scrolling */}
            <div
              style={{
                display: isMobile ? 'grid' : 'flex',
                gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'none',
                gap: isMobile ? 8 : 12,
              }}
            >
              {[
                { label: 'Total', value: properties.length, icon: Building2, color: 'white' },
                {
                  label: 'Valued',
                  value: properties.filter((p) => p.status === 'VALUED').length,
                  icon: CheckCircle2,
                  color: colors.success[400],
                },
                {
                  label: 'Pending',
                  value: properties.filter((p) => p.status !== 'VALUED').length,
                  icon: Clock,
                  color: colors.warning[400],
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={isMobile ? {} : { y: -5 }}
                  style={{
                    padding: isMobile ? '12px 4px' : '20px 24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: isMobile ? 16 : 20,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    minWidth: isMobile ? 0 : 150,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: stat.color,
                      marginBottom: isMobile ? 4 : 8,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon size={isMobile ? 16 : 20} />
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 22 : 28,
                      fontWeight: 900,
                      color: 'white',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 9 : 10,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.4)',
                      marginTop: 4,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- STICKY CONTROLS --- */}
      <section
        style={{
          padding: isMobile ? '0 20px 20px' : '0 48px 40px',
          maxWidth: 1400,
          margin: '0 auto',
          position: 'sticky',
          top: isMobile ? 60 : 80,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: isMobile ? 8 : 16,
            borderRadius: isMobile ? 24 : 32,
            boxShadow: shadow.md,
            border: `1px solid ${colors.gray[100]}`,
            alignItems: 'center',
            gap: 8,
            flexWrap: 'nowrap',
          }}
        >
          {/* Search: dominant but flexible */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              color={colors.gray[400]}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder={isMobile ? 'Search...' : 'Search properties...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: 44,
                padding: '0 12px 0 40px',
                borderRadius: isMobile ? 16 : 18,
                border: `1px solid ${colors.gray[100]}`,
                background: colors.gray[50],
                fontSize: 14,
                fontWeight: 600,
                color: colors.gray[800],
                outline: 'none',
              }}
            />
          </div>

          {/* Quick Filters Group */}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ position: 'relative' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  border: `1px solid ${filterStatus ? colors.primary[100] : colors.gray[100]}`,
                  background: filterStatus ? colors.primary[50] : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: filterStatus ? colors.primary[600] : colors.gray[500],
                }}
              >
                <Filter size={18} />
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      top: 52,
                      right: 0,
                      minWidth: 180,
                      backgroundColor: 'white',
                      borderRadius: 20,
                      boxShadow: shadow.xl,
                      border: `1px solid ${colors.gray[100]}`,
                      padding: 8,
                      zIndex: 101,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: colors.gray[400],
                        margin: '4px 0 8px 12px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Filter Status
                    </div>
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(filterStatus === status ? null : status);
                          setIsFilterOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 12,
                          border: 'none',
                          background: filterStatus === status ? colors.gray[50] : 'none',
                          color: filterStatus === status ? colors.primary[600] : colors.gray[700],
                          fontSize: 13,
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        {status}
                        {filterStatus === status && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                border: `1px solid ${colors.gray[100]}`,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.gray[500],
              }}
            >
              <ArrowUpDown size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/new')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                border: 'none',
                background: colors.primary[600],
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: shadow.brand,
              }}
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- FEED GRID --- */}
      <section
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: isMobile ? '0 20px 40px' : '0 48px 80px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: isMobile ? 16 : 32,
          }}
        >
          <AnimatePresence>
            {filteredData.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/property/${item.id}`)}
              >
                <Card
                  variant="glass"
                  style={{
                    padding: isMobile ? 16 : 24,
                    borderRadius: isMobile ? 24 : 32,
                    border: `1px solid ${colors.gray[100]}`,
                    background: 'white',
                    transition: 'all 0.3s',
                    boxShadow: shadow.sm,
                    position: 'relative',
                  }}
                  onMouseEnter={
                    isMobile
                      ? undefined
                      : (e: React.MouseEvent<HTMLDivElement>) => {
                          e.currentTarget.style.borderColor = colors.primary[200];
                          e.currentTarget.style.transform = 'translateY(-6px)';
                        }
                  }
                  onMouseLeave={
                    isMobile
                      ? undefined
                      : (e: React.MouseEvent<HTMLDivElement>) => {
                          e.currentTarget.style.borderColor = colors.gray[100];
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                  }
                >
                  {/* Image Section */}
                  <div
                    style={{
                      position: 'relative',
                      height: isMobile ? 160 : 220,
                      width: isMobile ? 'calc(100% + 32px)' : 'calc(100% + 48px)',
                      margin: isMobile ? '-16px -16px 16px' : '-24px -24px 20px',
                      overflow: 'hidden',
                      borderTopLeftRadius: isMobile ? 24 : 32,
                      borderTopRightRadius: isMobile ? 24 : 32,
                    }}
                  >
                    {item.photos?.[0]?.s3_url ? (
                      <img
                        src={item.photos[0].s3_url}
                        alt={item.address}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: colors.gray[100],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.gray[400],
                        }}
                      >
                        <Building2 size={32} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <Badge
                        variant={item.status === 'VALUED' ? 'success' : 'info'}
                        style={{
                          fontSize: 9,
                          fontWeight: 900,
                          backdropFilter: 'blur(8px)',
                          backgroundColor: 'rgba(255,255,255,0.85)',
                        }}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: isMobile ? 16 : 18,
                          fontWeight: 800,
                          color: colors.gray[900],
                          lineHeight: 1.3,
                        }}
                      >
                        {item.address}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 8,
                          fontSize: 12,
                          color: colors.gray[500],
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} color={colors.primary[500]} /> {item.city}
                        </span>
                        <span
                          style={{
                            height: 3,
                            width: 3,
                            borderRadius: '50%',
                            backgroundColor: colors.gray[300],
                          }}
                        />
                        <span>
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        backgroundColor: colors.primary[50],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.primary[600],
                        marginLeft: 12,
                      }}
                    >
                      <ChevronRight size={18} />
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: `1px solid ${colors.gray[50]}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: colors.gray[400],
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}
                    >
                      #{item.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span style={{ fontSize: 11, color: colors.primary[600], fontWeight: 800 }}>
                      VIEW DETAILS
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80, color: colors.gray[400] }}>
            <Search size={48} style={{ opacity: 0.1, margin: '0 auto 20px' }} />
            <h3 style={{ fontWeight: 800, color: colors.gray[900] }}>No matches found</h3>
          </div>
        )}
      </section>
    </div>
  );
}
