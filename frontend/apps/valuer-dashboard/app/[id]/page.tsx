'use client';

import { colors, shadow, spacing, typography } from '@propflow/theme';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Loader2,
  Map as MapIcon,
  MapPin,
  Send,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Property, propertyApi } from '../../src/api/properties';
import { Badge } from '../../src/components/Badge';
import { Modal } from '../../src/components/Modal';
import { Table } from '../../src/components/Table';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { useToast } from '../../src/providers/ToastProvider';

const MapView = dynamic(() => import('../../src/components/MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: colors.gray[100],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader2 className="animate-spin" color={colors.primary[500]} />
    </div>
  ),
});

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  console.log('Interaction States:', {
    approve: isApproveModalOpen,
    reject: isRejectModalOpen,
    followUp: isFollowUpModalOpen,
  });

  // Demo Data for Fallback
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

  const { data: apiProperty, isLoading: isPropertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getProperty(id as string),
    enabled: !!id,
  });

  const property = apiProperty || DEMO_COMPLETED_PROPERTIES.find((p) => p.id === id);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const mockDocs = [
    { name: 'Khata Certificate.pdf', size: '2.4mb', date: 'v1.2' },
    { name: 'Tax_Receipt_2024.pdf', size: '1.1mb', date: 'v1.0' },
    { name: 'Site_Plan_Approved.pdf', size: '5.8mb', date: 'v2.1' },
  ];

  const mockAuditItems = [
    { label: 'Geo-Tag Verification', status: 'PASSED' },
    { label: 'Time-Stamp Integrity', status: 'VERIFIED' },
    { label: 'Fraud Detection Scan', status: 'MATCHED' },
  ];

  // Mock CMA Data for Demo
  const mockComps = useMemo(
    () => [
      {
        id: 'c1',
        address: '45 Lotus Boulevard',
        property_type: 'APARTMENT',
        area_sqft: 1850,
        price: 24500000,
        distance_km: 0.4,
        date: '2024-01-15',
      },
      {
        id: 'c2',
        address: '12 Skyview Terraces',
        property_type: 'APARTMENT',
        area_sqft: 2100,
        price: 28200000,
        distance_km: 0.8,
        date: '2023-12-10',
      },
      {
        id: 'c3',
        address: '88 Emerald Heights',
        property_type: 'APARTMENT',
        area_sqft: 1920,
        price: 25800000,
        distance_km: 1.2,
        date: '2024-02-01',
      },
    ],
    [],
  );

  const compColumns = [
    {
      header: 'Comparable Property',
      key: 'address',
      render: (item: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: colors.gray[900] }}>{item.address}</span>
          <span style={{ fontSize: 11, color: colors.gray[500] }}>
            Sold: {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    { header: 'Area', key: 'area_sqft', render: (item: any) => `${item.area_sqft} sqft` },
    {
      header: 'Value',
      key: 'price',
      render: (item: any) => `₹${(item.price / 10000000).toFixed(2)} Cr`,
    },
    {
      header: 'Proximity',
      key: 'distance_km',
      render: (item: any) => <Badge variant="gray">{item.distance_km} km</Badge>,
    },
  ];

  if (isPropertyLoading && !property) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          padding: spacing[8],
          gap: spacing[8],
        }}
      >
        {/* Header Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              height: 48,
              width: 140,
              background: colors.gray[200],
              borderRadius: 24,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              height: 48,
              width: 200,
              background: colors.gray[200],
              borderRadius: 24,
              opacity: 0.6,
            }}
          />
        </div>

        {/* Hero Skeleton */}
        <div
          style={{
            height: 280,
            width: '100%',
            background: colors.gray[100],
            borderRadius: 32,
            border: `1px solid ${colors.gray[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Loader2 size={32} className="animate-spin" color={colors.primary[300]} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: colors.gray[400],
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Loading Property Data...
            </span>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 24 }}
        >
          <div style={{ height: 400, background: colors.gray[50], borderRadius: 32 }} />
          <div style={{ height: 400, background: colors.gray[50], borderRadius: 32 }} />
        </div>
      </div>
    );
  }

  if (!property)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: colors.gray[400],
        }}
      >
        Property not found or access denied.
      </div>
    );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: spacing[8],
        backgroundColor: colors.gray[50],
      }}
    >
      {/* Dynamic Aura Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '50vw',
            height: '50vw',
            background: `radial-gradient(circle, ${colors.primary[100]}77 0%, transparent 70%)`,
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div
        style={{ position: 'relative', zIndex: 1, maxWidth: 1400, width: '100%', margin: '0 auto' }}
      >
        {/* Navigation & Context Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing[10],
          }}
        >
          <motion.button
            whileHover={{ x: -5, backgroundColor: 'white' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.location.pathname.includes('/completed')) {
                router.push('/completed');
              } else {
                router.push(property.status === 'VALUED' ? '/completed' : '/');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.gray[200]}`,
              padding: '12px 24px',
              borderRadius: 24,
              fontSize: 14,
              fontWeight: 700,
              color: colors.gray[800],
              cursor: 'pointer',
              boxShadow: shadow.sm,
            }}
          >
            <ArrowLeft size={18} />{' '}
            {window.location.pathname.includes('/completed') || property.status === 'VALUED'
              ? 'Back to Portfolio'
              : 'Back to Queue'}
          </motion.button>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Badge
              variant="gray"
              style={{
                padding: '8px 16px',
                fontSize: 11,
                fontFamily: typography.fonts.mono,
                borderRadius: 12,
              }}
            >
              ID: {property.id?.slice(0, 8).toUpperCase() || 'N/A'}
            </Badge>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                padding: '8px 16px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                color: colors.gray[500],
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {property.status === 'VALUED' ? (
                <>
                  <CheckCircle2 size={16} color={colors.success[500]} /> Finalized
                  {property.updated_at
                    ? ` ${new Date(property.updated_at).toLocaleDateString()}`
                    : ''}
                </>
              ) : (
                <>
                  <Clock size={16} color={colors.primary[500]} /> Assigned 2h ago
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background:
              property.status === 'VALUED'
                ? `linear-gradient(135deg, ${colors.success[700]} 0%, ${colors.success[900]} 100%)`
                : `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
            padding: isMobile ? spacing[8] : spacing[10],
            borderRadius: 40,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 40,
            marginBottom: spacing[10],
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          <div style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                color: colors.accent[100],
                padding: '8px 16px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 20,
                textTransform: 'uppercase',
                letterSpacing: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Building2 size={14} /> {property.property_type} VALUATION
            </div>
            <h1
              style={{
                fontSize: isMobile ? 32 : 48,
                fontWeight: 800,
                color: colors.white,
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: -1,
              }}
            >
              {property.address}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              <MapPin size={22} color={colors.accent[400]} /> {property.city}, {property.state}{' '}
              {property.pincode}
            </div>

            <div style={{ marginTop: 40, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Built Area', value: '2,450 sqft', icon: Layers },
                { label: 'Config.', value: '3 BHK + Tech', icon: Building2 },
                {
                  label: 'Value Est.',
                  value: `₹${((property.estimated_value || 0) / 10000000).toFixed(2)} Cr`,
                  icon: TrendingUp,
                  highlight: true,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 24,
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: 160,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <stat.icon size={12} /> {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: stat.highlight ? colors.accent[400] : colors.white,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              minWidth: isMobile ? '100%' : 340,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              justifyContent: 'center',
              position: 'relative',
              zIndex: 100,
            }}
          >
            {property.status === 'VALUED' ? (
              <motion.button
                whileHover={{ y: -4, boxShadow: `0 20px 40px ${colors.success[600]}40` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  showToast('Preparing Compliance Report...', 'info');
                  setTimeout(() => {
                    showToast('Report Downloaded Successfully', 'success');
                  }, 1500);
                }}
                style={{
                  background: 'white',
                  color: colors.success[700],
                  border: 'none',
                  padding: '24px',
                  borderRadius: 24,
                  fontWeight: 900,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  boxShadow: `0 15px 30px rgba(0,0,0,0.1)`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  zIndex: 101,
                }}
              >
                <Download size={24} /> Download Report
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ y: -4, boxShadow: `0 20px 40px ${colors.success[600]}40` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsApproveModalOpen(true)}
                  style={{
                    background: `linear-gradient(135deg, ${colors.success[500]} 0%, ${colors.success[700]} 100%)`,
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '24px',
                    borderRadius: 24,
                    fontWeight: 900,
                    fontSize: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    boxShadow: `0 15px 30px ${colors.success[600]}30`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 101,
                  }}
                >
                  <CheckCircle2 size={24} /> Finalize Value
                </motion.button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <motion.button
                    whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFollowUpModalOpen(true)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: colors.white,
                      padding: '18px',
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s',
                      zIndex: 101,
                    }}
                  >
                    <Clock size={18} /> Review
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2, backgroundColor: 'rgba(220, 38, 38, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsRejectModalOpen(true)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.7)',
                      padding: '18px',
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s',
                      zIndex: 101,
                    }}
                  >
                    <XCircle size={18} /> Reject
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Workspace Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : 'repeat(12, 1fr)',
            gap: 32,
          }}
        >
          {/* Left Side */}
          <div
            style={{
              gridColumn: isTablet ? 'span 1' : 'span 8',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            {/* Map & Meta */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
                gap: 32,
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: spacing[8],
                  borderRadius: 40,
                  boxShadow: shadow.md,
                  border: `1px solid ${colors.gray[100]}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: colors.primary[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary[600],
                    }}
                  >
                    <MapIcon size={20} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: colors.gray[900] }}>
                    Property Context
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Asset Class', value: property.property_type || 'Residential' },
                    { label: 'Condition', value: 'Prime / Ready' },
                    { label: 'Neighborhood', value: 'High Confidence' },
                  ].map((info, i) => (
                    <div key={i}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: colors.gray[400],
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}
                      >
                        {info.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.gray[700] }}>
                        {info.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  height: 320,
                  borderRadius: 40,
                  overflow: 'hidden',
                  boxShadow: shadow.md,
                  border: `1px solid ${colors.gray[100]}`,
                }}
              >
                <MapView
                  lat={property.lat || 28.6139}
                  lng={property.lng || 77.209}
                  address={property.address}
                />
              </div>
            </div>

            {/* Evidence Mosaic */}
            <div
              style={{
                backgroundColor: 'white',
                padding: spacing[10],
                borderRadius: 40,
                boxShadow: shadow.md,
                border: `1px solid ${colors.gray[100]}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <Camera size={24} color={colors.primary[500]} />
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: colors.gray[900] }}>
                  Physical Evidence
                </h3>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(2, 220px)',
                  gap: 16,
                }}
              >
                {[
                  {
                    label: 'Facade / Front',
                    area: 'span 2 / span 2',
                    img: '/property/exterior.png',
                  },
                  {
                    label: 'Lobby / Entrance',
                    area: 'span 1 / span 1',
                    img: '/property/living.png',
                  },
                  {
                    label: 'Modular Kitchen',
                    area: 'span 1 / span 1',
                    img: '/property/kitchen.png',
                  },
                  { label: 'Primary Suite', area: 'span 1 / span 1', img: '/property/bedroom.png' },
                  {
                    label: 'Internal Layout',
                    area: 'span 1 / span 1',
                    img: '/property/living.png',
                  },
                  {
                    label: 'Plot Perimeter',
                    area: 'span 2 / span 1',
                    img: '/property/exterior.png',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, zIndex: 10 }}
                    style={{
                      gridArea: item.area,
                      backgroundColor: colors.gray[50],
                      backgroundImage: `url(${item.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 24,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'zoom-in',
                      boxShadow: shadow.sm,
                      border: `1px solid ${colors.gray[100]}`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 800,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Analysis Table */}
            <div
              style={{
                backgroundColor: 'white',
                padding: spacing[10],
                borderRadius: 40,
                boxShadow: shadow.md,
                border: `1px solid ${colors.gray[100]}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 32,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TrendingUp size={24} color={colors.success[500]} />
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.gray[900] }}>
                    Market Comparison
                  </h3>
                </div>
                <Badge variant="success">98% Accuracy</Badge>
              </div>
              <Table columns={compColumns} data={mockComps} />
            </div>
          </div>

          {/* Right Side */}
          <div
            style={{
              gridColumn: isTablet ? 'span 1' : 'span 4',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            {/* Audit Score Card */}
            <div
              style={{
                backgroundColor: 'white',
                padding: spacing[8],
                borderRadius: 40,
                boxShadow: shadow.md,
                border: `1px solid ${colors.gray[100]}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <ShieldCheck size={24} color={colors.primary[600]} />
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.gray[900] }}>
                  Integrity Audit
                </h3>
              </div>

              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 900,
                    color: colors.success[600],
                    letterSpacing: -2,
                  }}
                >
                  98<span style={{ fontSize: 24, color: colors.gray[300] }}>/100</span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: colors.success[700],
                    textTransform: 'uppercase',
                    marginTop: 8,
                  }}
                >
                  Trust Level: Maximum
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                {mockAuditItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: 16,
                      background: colors.gray[50],
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle2 size={16} color={colors.primary[500]} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: colors.gray[700] }}>
                        {item.label}
                      </span>
                    </div>
                    <Badge variant="success">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div
              style={{
                backgroundColor: 'white',
                padding: spacing[8],
                borderRadius: 40,
                boxShadow: shadow.md,
                border: `1px solid ${colors.gray[100]}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <FileText size={24} color={colors.primary[500]} />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: colors.gray[900] }}>
                  Repository
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mockDocs.map((doc, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      x: 4,
                      backgroundColor: colors.primary[50],
                      borderColor: colors.primary[100],
                    }}
                    onClick={() => {
                      showToast(`Opening ${doc.name} secure viewer...`, 'info');
                      // Simulate opening a secure PDF viewer
                      setTimeout(() => {
                        window.open(
                          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                          '_blank',
                        );
                      }, 800);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                      borderRadius: 16,
                      cursor: 'pointer',
                      border: `1px solid transparent`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: colors.primary[50],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.primary[600],
                        }}
                      >
                        <FileText size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: colors.gray[800] }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: 11, color: colors.gray[400] }}>
                          {doc.size} • {doc.date}
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={14} color={colors.primary[400]} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Modals */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Finalize Valuation"
      >
        <div style={{ paddingBottom: 10 }}>
          <div
            style={{
              padding: 24,
              background: colors.success[50],
              borderRadius: 24,
              marginBottom: 32,
              border: `1px solid ${colors.success[100]}`,
            }}
          >
            <p
              style={{
                color: colors.success[800],
                margin: 0,
                fontSize: 15,
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              Verify final valuation. This action moves the case to final approval.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: colors.gray[400],
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Appraised Value (INR)
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 24,
                  fontWeight: 900,
                  color: colors.gray[300],
                }}
              >
                ₹
              </span>
              <input
                type="number"
                defaultValue={property.estimated_value}
                style={{
                  width: '100%',
                  padding: '24px 24px 24px 56px',
                  borderRadius: 24,
                  border: `2px solid ${colors.gray[100]}`,
                  fontSize: 32,
                  fontWeight: 900,
                  color: colors.primary[700],
                  background: colors.gray[50],
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ y: -4, boxShadow: shadow.lg }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              showToast('Valuation Dispatched', 'success');
              setIsApproveModalOpen(false);
            }}
            style={{
              width: '100%',
              marginTop: 40,
              padding: '24px',
              background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: 24,
              fontWeight: 800,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <ShieldCheck size={24} /> Submit Final Value
          </motion.button>
        </div>
      </Modal>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Case Rejection"
      >
        <div style={{ paddingBottom: 10 }}>
          <div
            style={{
              padding: 24,
              background: colors.error[50],
              borderRadius: 24,
              marginBottom: 32,
              border: `1px solid ${colors.error[100]}`,
            }}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <AlertCircle size={24} color={colors.error[600]} />
              <p
                style={{
                  color: colors.error[800],
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                Rejection requires mandatory policy justification.
              </p>
            </div>
          </div>

          <textarea
            placeholder="Reason for rejection..."
            style={{
              width: '100%',
              height: 160,
              padding: 24,
              borderRadius: 24,
              border: `2px solid ${colors.gray[100]}`,
              fontSize: 15,
              background: colors.gray[50],
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              showToast('Case Rejected', 'error');
              setIsRejectModalOpen(false);
            }}
            style={{
              width: '100%',
              marginTop: 40,
              padding: '24px',
              background: colors.error[600],
              color: 'white',
              border: 'none',
              borderRadius: 24,
              fontWeight: 800,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <XCircle size={24} /> Confirm Rejection
          </motion.button>
        </div>
      </Modal>

      <Modal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        title="Request Follow-up"
      >
        <div style={{ paddingBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: '1', label: 'Missing Site Photos', icon: <Camera size={18} /> },
              { id: '2', label: 'Boundary Verification', icon: <MapPin size={18} /> },
              { id: '3', label: 'Legal Document Scan', icon: <FileText size={18} /> },
            ].map((task) => (
              <label
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 20,
                  background: colors.gray[50],
                  borderRadius: 20,
                  cursor: 'pointer',
                  border: `1px solid ${colors.gray[100]}`,
                }}
              >
                <input type="checkbox" style={{ width: 20, height: 20 }} />
                {task.icon}
                <span style={{ fontWeight: 600, color: colors.gray[800] }}>{task.label}</span>
              </label>
            ))}
          </div>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              showToast('Follow-up Request Sent', 'info');
              setIsFollowUpModalOpen(false);
            }}
            style={{
              width: '100%',
              marginTop: 40,
              padding: '24px',
              background: colors.primary[600],
              color: 'white',
              border: 'none',
              borderRadius: 24,
              fontWeight: 800,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Send size={24} /> Dispatch Request
          </motion.button>
        </div>
      </Modal>
    </div>
  );
}
