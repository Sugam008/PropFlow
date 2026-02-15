/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { spacing, typography, colors, borderRadius, shadow, layout } from '@propflow/theme';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../../src/api/properties';
import { valuationApi, ValuationCreate } from '../../src/api/valuations';
import { getErrorMessage } from '../../src/api/errors';
import { useToast } from '../../src/providers/ToastProvider';
import { Badge } from '../../src/components/Badge';
import { Card } from '../../src/components/Card';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Camera,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MapView = dynamic(() => import('../../src/components/MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '400px',
        width: '100%',
        backgroundColor: colors.gray[100],
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Loading Map...
    </div>
  ),
});

const Table = dynamic(() => import('../../src/components/Table').then((mod) => mod.Table), {
  loading: () => (
    <div style={{ padding: spacing[10], textAlign: 'center' }}>
      <Loader2 className="animate-spin" />
    </div>
  ),
  ssr: false,
});

const Modal = dynamic(() => import('../../src/components/Modal').then((mod) => mod.Modal), {
  ssr: false,
});

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // State for Valuation Modal
  const [isValuationModalOpen, setIsValuationModalOpen] = React.useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [followUpNotes, setFollowUpNotes] = React.useState('');
  const [valuationData, setValuationData] = React.useState({
    estimated_value: 0,
    confidence_score: 85,
    methodology: 'Market Comparison',
    notes: '',
  });

  const { data: property, isLoading: isPropertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getProperty(id as string),
    enabled: !!id,
  });

  const { data: photos, isLoading: isPhotosLoading } = useQuery({
    queryKey: ['property-photos', id],
    queryFn: () => propertyApi.getPhotos(id as string),
    enabled: !!id,
  });

  const { data: comps, isLoading: isCompsLoading } = useQuery({
    queryKey: ['comps'],
    queryFn: () => propertyApi.getComps(),
  });

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties(),
  });

  const submitValuationMutation = useMutation({
    mutationFn: (data: ValuationCreate) => valuationApi.createValuation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsValuationModalOpen(false);
      setIsSuccessModalOpen(true);
      showToast('Valuation submitted successfully', 'success');
    },
    onError: (error: any) => {
      showToast(getErrorMessage(error), 'error');
    },
  });

  const followUpMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      propertyApi.requestFollowUp(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsFollowUpModalOpen(false);
      setFollowUpNotes('');
      setIsSuccessModalOpen(true);
      showToast('Follow-up request sent', 'success');
    },
    onError: (error: any) => {
      showToast(getErrorMessage(error), 'error');
    },
  });

  const handleNextInQueue = () => {
    if (!properties || !id) return;

    const currentIndex = properties.findIndex((p) => p.id === id);
    if (currentIndex !== -1 && currentIndex < properties.length - 1) {
      const nextProperty = properties[currentIndex + 1];
      router.push(`/${nextProperty.id}`);
    } else {
      router.push('/');
    }
  };

  const handleValuationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    submitValuationMutation.mutate({
      property_id: property.id,
      estimated_value: valuationData.estimated_value,
      confidence_score: valuationData.confidence_score,
      valuation_date: new Date().toISOString(),
      methodology: valuationData.methodology,
      notes: valuationData.notes,
      // In a real app, we'd pick these from a selection UI
      comp1_id: comps?.[0]?.id,
      comp2_id: comps?.[1]?.id,
      comp3_id: comps?.[2]?.id,
    });
  };

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const compColumns = React.useMemo(
    () => [
      { header: 'Address', key: 'address' },
      { header: 'Type', key: 'property_type' },
      { header: 'Area (sqft)', key: 'area_sqft' },
      {
        header: 'Price (₹)',
        key: 'price',
        render: (item: any) => `₹${item.price.toLocaleString()}`,
      },
      { header: 'Distance', key: 'distance_km', render: (item: any) => `${item.distance_km} km` },
    ],
    [],
  );

  if (isPropertyLoading || isPhotosLoading || isCompsLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: spacing[4],
        }}
      >
        <div style={{ position: 'relative', width: 60, height: 60 }}>
          {/* Outer rotating rays */}
          <div
            className="animate-ray-rotate"
            style={{
              position: 'absolute',
              inset: 0,
              border: '2px dashed #E31E24',
              borderRadius: '50%',
              opacity: 0.3,
            }}
          />
          {/* Pulsing Sun Center */}
          <div
            className="animate-pulse-sun"
            style={{
              position: 'absolute',
              inset: spacing[2],
              backgroundColor: '#E31E24',
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
            }}
          >
            Money Simplified
          </div>
          <div style={{ fontSize: typography.fontSizes.sm, color: colors.gray[500] }}>
            Loading property details...
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ padding: spacing[8], textAlign: 'center' }}>
        <div style={{ color: colors.error[500], marginBottom: spacing[4] }}>
          Property not found.
        </div>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: colors.primary[600],
            color: colors.white,
            padding: `${spacing[2]}px ${spacing[4]}px`,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Back to Queue
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? spacing[5] : spacing[6],
        maxWidth: layout.containerMaxWidth,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: spacing[6],
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: spacing[4],
        }}
      >
        <div style={{ flex: 1 }}>
          <button
            onClick={() => router.push('/')}
            aria-label="Go back to queue"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
              color: colors.gray[500],
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: spacing[3],
              fontSize: typography.fontSizes.sm,
              padding: 0,
            }}
          >
            <ArrowLeft size={16} /> Back to Queue
          </button>
          <h1
            style={{
              fontSize: isMobile ? typography.fontSizes.xl : typography.fontSizes['2xl'],
              fontWeight: typography.fontWeights.bold,
              color: colors.gray[900],
              marginBottom: spacing[2],
              lineHeight: 1.2,
            }}
          >
            {property.address}
          </h1>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? spacing[2] : spacing[4],
              color: colors.gray[500],
              marginTop: spacing[2],
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                fontSize: typography.fontSizes.sm,
              }}
            >
              <MapPin size={14} /> {property.city}, {property.state}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                fontSize: typography.fontSizes.sm,
              }}
            >
              <Clock size={14} /> {new Date(property.created_at).toLocaleDateString()}
            </div>
            <Badge
              variant={
                property.status === 'SUBMITTED'
                  ? 'info'
                  : property.status === 'VALUED'
                    ? 'success'
                    : 'gray'
              }
            >
              {property.status}
            </Badge>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: spacing[3],
            width: isMobile ? '100%' : 'auto',
            marginTop: isMobile ? spacing[4] : 0,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFollowUpModalOpen(true)}
            aria-label="Request follow-up for more information"
            style={{
              flex: isMobile ? 1 : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray[300]}`,
              padding: `${spacing[3]}px ${spacing[4]}px`,
              borderRadius: borderRadius.lg,
              fontWeight: typography.fontWeights.medium,
              cursor: 'pointer',
              fontSize: isMobile ? typography.fontSizes.sm : typography.fontSizes.base,
              color: colors.gray[700],
            }}
          >
            <MessageSquare size={18} aria-hidden="true" />{' '}
            {isMobile ? 'Follow-up' : 'Request Follow-up'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsValuationModalOpen(true)}
            aria-label="Approve valuation and submit report"
            style={{
              flex: isMobile ? 1 : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              backgroundColor: colors.primary[600],
              color: colors.white,
              border: 'none',
              padding: `${spacing[3]}px ${spacing[4]}px`,
              borderRadius: borderRadius.lg,
              fontWeight: typography.fontWeights.medium,
              cursor: 'pointer',
              fontSize: isMobile ? typography.fontSizes.sm : typography.fontSizes.base,
            }}
          >
            <CheckCircle2 size={18} aria-hidden="true" />{' '}
            {isMobile ? 'Valuate' : 'Approve Valuation'}
          </motion.button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: spacing[6],
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
          {/* Photos */}
          <Card title="Property Photos">
            <div style={{ padding: spacing[1] }}>
              {photos && photos.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: spacing[4],
                  }}
                >
                  {photos.map((photo: any, index: number) => (
                    <motion.div
                      key={photo.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{
                        scale: 1.05,
                        zIndex: 1,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: `1px solid ${colors.border}`,
                        cursor: 'pointer',
                      }}
                    >
                      <Image
                        src={photo.s3_url}
                        alt={photo.photo_type}
                        fill
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: spacing[2],
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: colors.white,
                          fontSize: typography.fontSizes.xs,
                        }}
                      >
                        {photo.photo_type}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div style={{ padding: spacing[10], textAlign: 'center', color: colors.gray[600] }}>
                  <Camera size={48} style={{ marginBottom: spacing[4], opacity: 0.2 }} />
                  <p>No photos uploaded for this property yet.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Comparables */}
          <Card title="Comparable Market Analysis">
            <div style={{ padding: spacing[1] }}>
              {property.lat && property.lng && (
                <div style={{ marginBottom: spacing[6] }}>
                  <MapView
                    lat={property.lat}
                    lng={property.lng}
                    address={property.address}
                    comps={comps?.map((c) => ({
                      id: c.id,
                      address: c.address,
                      lat: c.lat,
                      lng: c.lng,
                      price: c.price,
                    }))}
                  />
                </div>
              )}
              <div
                style={{
                  marginBottom: spacing[4],
                  fontSize: typography.fontSizes.sm,
                  color: colors.gray[500],
                }}
              >
                Found {comps?.length || 0} similar properties in the same area.
              </div>
              <Table columns={compColumns} data={comps || []} />
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
          {/* Property Details */}
          <Card title="Property Details">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[5],
                padding: spacing[1],
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: typography.fontSizes.xs,
                    color: colors.gray[500],
                    textTransform: 'uppercase',
                    marginBottom: spacing[1],
                    fontWeight: typography.fontWeights.medium,
                    letterSpacing: '0.05em',
                  }}
                >
                  Property Type
                </div>
                <div style={{ fontWeight: typography.fontWeights.medium, color: colors.gray[900] }}>
                  {property.property_type}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: typography.fontSizes.xs,
                    color: colors.gray[500],
                    textTransform: 'uppercase',
                    marginBottom: spacing[1],
                    fontWeight: typography.fontWeights.medium,
                    letterSpacing: '0.05em',
                  }}
                >
                  Full Address
                </div>
                <div
                  style={{
                    fontWeight: typography.fontWeights.medium,
                    color: colors.gray[900],
                    lineHeight: 1.4,
                  }}
                >
                  {property.address}
                </div>
                <div
                  style={{
                    color: colors.gray[600],
                    fontSize: typography.fontSizes.sm,
                    marginTop: spacing[1],
                  }}
                >
                  {property.city}, {property.state} {property.pincode}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: typography.fontSizes.xs,
                    color: colors.gray[500],
                    textTransform: 'uppercase',
                    marginBottom: spacing[1],
                    fontWeight: typography.fontWeights.medium,
                    letterSpacing: '0.05em',
                  }}
                >
                  Customer&apos;s Estimated Value
                </div>
                <div
                  style={{
                    fontWeight: typography.fontWeights.semibold,
                    fontSize: typography.fontSizes.lg,
                    color: colors.primary[600],
                  }}
                >
                  ₹{property.estimated_value?.toLocaleString() || 'Not provided'}
                </div>
              </div>
              <hr
                style={{
                  border: 'none',
                  borderTop: `1px solid ${colors.gray[200]}`,
                  margin: `${spacing[2]} 0`,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: typography.fontSizes.xs,
                    color: colors.gray[500],
                    textTransform: 'uppercase',
                    marginBottom: spacing[2],
                    fontWeight: typography.fontWeights.medium,
                    letterSpacing: '0.05em',
                  }}
                >
                  Verification Checks
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2],
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      color: colors.success[600],
                      fontSize: typography.fontSizes.sm,
                    }}
                  >
                    <CheckCircle2 size={14} /> GPS Location Matched
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      color: colors.success[600],
                      fontSize: typography.fontSizes.sm,
                    }}
                  >
                    <CheckCircle2 size={14} /> Photo EXIF Verified
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      color: colors.success[600],
                      fontSize: typography.fontSizes.sm,
                    }}
                  >
                    <CheckCircle2 size={14} /> Live Capture Confirmed
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* External Links */}
          <Card title="Resources">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[3],
                padding: spacing[1],
              }}
            >
              <motion.button
                whileHover={{ backgroundColor: colors.gray[100], x: 5 }}
                aria-label="View on Google Maps"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: spacing[3],
                  backgroundColor: colors.gray[50],
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.fontSizes.sm,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, x 0.2s',
                  color: colors.gray[700],
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                View on Google Maps <ExternalLink size={14} aria-hidden="true" />
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: colors.gray[100], x: 5 }}
                aria-label="Access Property Tax Records"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: spacing[3],
                  backgroundColor: colors.gray[50],
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.fontSizes.sm,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, x 0.2s',
                  color: colors.gray[700],
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Property Tax Records <ExternalLink size={14} aria-hidden="true" />
              </motion.button>
            </div>
          </Card>
        </div>
      </div>

      {/* Valuation Modal */}
      <Modal
        isOpen={isValuationModalOpen}
        onClose={() => setIsValuationModalOpen(false)}
        title="Submit Valuation"
        footer={
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsValuationModalOpen(false)}
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.border}`,
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleValuationSubmit}
              disabled={submitValuationMutation.isPending}
              style={{
                backgroundColor: colors.primary[600],
                color: colors.white,
                border: 'none',
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.lg,
                cursor: submitValuationMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: submitValuationMutation.isPending ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
              }}
            >
              {submitValuationMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              Submit Valuation
            </button>
          </div>
        }
      >
        <form
          onSubmit={handleValuationSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
                marginBottom: spacing[2],
              }}
            >
              Estimated Property Value (₹)
            </label>
            <input
              type="number"
              required
              value={valuationData.estimated_value || ''}
              onChange={(e) =>
                setValuationData({
                  ...valuationData,
                  estimated_value: parseInt(e.target.value) || 0,
                })
              }
              style={{
                width: '100%',
                padding: spacing[3],
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.gray[300]}`,
                fontSize: typography.fontSizes.base,
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              placeholder="e.g. 7500000"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.medium,
                  color: colors.gray[700],
                  marginBottom: spacing[2],
                }}
              >
                Confidence Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={valuationData.confidence_score}
                onChange={(e) =>
                  setValuationData({
                    ...valuationData,
                    confidence_score: parseInt(e.target.value) || 0,
                  })
                }
                style={{
                  width: '100%',
                  padding: spacing[3],
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: typography.fontSizes.base,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.medium,
                  color: colors.gray[700],
                  marginBottom: spacing[2],
                }}
              >
                Methodology
              </label>
              <select
                value={valuationData.methodology}
                onChange={(e) =>
                  setValuationData({ ...valuationData, methodology: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: spacing[3],
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${colors.gray[300]}`,
                  fontSize: typography.fontSizes.base,
                  backgroundColor: colors.white,
                  outline: 'none',
                }}
              >
                <option value="Market Comparison">Market Comparison</option>
                <option value="Cost Approach">Cost Approach</option>
                <option value="Income Approach">Income Approach</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
                marginBottom: spacing[2],
              }}
            >
              Valuation Notes
            </label>
            <textarea
              rows={4}
              value={valuationData.notes}
              onChange={(e) => setValuationData({ ...valuationData, notes: e.target.value })}
              style={{
                width: '100%',
                padding: spacing[3],
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.gray[300]}`,
                fontSize: typography.fontSizes.base,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="Provide details about your assessment..."
            />
          </div>

          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.primary[50],
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSizes.sm,
              color: colors.primary[700],
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <strong>Note:</strong> Submitting this valuation will notify the customer and update the
            property status to &quot;VALUED&quot;.
          </div>
        </form>
      </Modal>

      {/* Follow-up Modal */}
      <Modal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        title="Request Follow-up"
        footer={
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsFollowUpModalOpen(false)}
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.border}`,
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.lg,
                cursor: 'pointer',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => followUpMutation.mutate({ id: id as string, notes: followUpNotes })}
              disabled={followUpMutation.isPending || !followUpNotes.trim()}
              style={{
                backgroundColor: colors.primary[600],
                color: colors.white,
                border: 'none',
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.lg,
                cursor:
                  followUpMutation.isPending || !followUpNotes.trim() ? 'not-allowed' : 'pointer',
                opacity: followUpMutation.isPending || !followUpNotes.trim() ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
              }}
            >
              {followUpMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              Send Request
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
          <p style={{ fontSize: typography.fontSizes.sm, color: colors.gray[600], margin: 0 }}>
            Please specify what additional information or photos are required from the customer.
          </p>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.gray[700],
                marginBottom: spacing[2],
              }}
            >
              Instructions for Customer
            </label>
            <textarea
              rows={5}
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              style={{
                width: '100%',
                padding: spacing[3],
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.gray[300]}`,
                fontSize: typography.fontSizes.base,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="e.g. Please provide a clear photo of the property's exterior from across the street. The current photo is too blurry."
            />
          </div>

          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.warning[50],
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSizes.sm,
              color: colors.warning[700],
              border: `1px solid ${colors.warning[100]}`,
              display: 'flex',
              gap: spacing[3],
            }}
          >
            <MessageSquare size={20} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div>
              <strong>Note:</strong> This will set the property status to &quot;FOLLOW_UP&quot; and
              notify the customer via SMS/WhatsApp.
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Action Completed"
        footer={
          <div style={{ display: 'flex', gap: spacing[3], width: '100%' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                flex: 1,
                backgroundColor: colors.white,
                border: `1px solid ${colors.border}`,
                padding: `${spacing[3]}px ${spacing[4]}px`,
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: typography.fontWeights.medium,
              }}
            >
              Back to Queue
            </button>
            <button
              onClick={handleNextInQueue}
              style={{
                flex: 1,
                backgroundColor: colors.primary[600],
                color: colors.white,
                border: 'none',
                padding: `${spacing[3]}px ${spacing[4]}px`,
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: typography.fontWeights.medium,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
              }}
            >
              Next Property <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: `${spacing[4]}px 0` }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: colors.success[100],
              color: colors.success[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto ' + spacing[4] + 'px',
            }}
          >
            <CheckCircle2 size={32} aria-hidden="true" />
          </div>
          <h2
            style={{
              fontSize: typography.fontSizes.xl,
              fontWeight: typography.fontWeights.bold,
              color: colors.gray[900],
              marginBottom: spacing[2],
            }}
          >
            Submission Successful
          </h2>
          <p
            style={{
              color: colors.gray[600],
              fontSize: typography.fontSizes.base,
              lineHeight: 1.5,
            }}
          >
            The property record has been updated and the customer has been notified. What would you
            like to do next?
          </p>
        </div>
      </Modal>
    </div>
  );
}
