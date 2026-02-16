'use client';

import { colors, shadow, typography } from '@propflow/theme';
import { Badge, Card } from '@propflow/ui';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  ImageIcon,
  Layout,
  MapPin,
  Ruler,
  Share2,
  Trash2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { propertyApi } from '../../../src/api/property';
import { useMediaQuery } from '../../../src/hooks/useMediaQuery';

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('../../../src/components/MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 400,
        backgroundColor: colors.gray[100],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
      }}
    >
      <div style={{ color: colors.gray[400], fontWeight: 600 }}>Loading Map...</div>
    </div>
  ),
});

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['property', params.id],
    queryFn: () => propertyApi.getProperty(params.id as string),
    enabled: !!params.id,
  });

  const coverImage = useMemo(() => {
    if (property?.photos && property.photos.length > 0) {
      // Prioritize EXTERIOR photos, then fallback to first
      const exterior = property.photos.find((p) => p.photo_type === 'EXTERIOR');
      return exterior ? exterior.s3_url : property.photos[0].s3_url;
    }
    return null;
  }, [property]);

  const handleDelete = async () => {
    if (!property) return;
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await propertyApi.deleteProperty(property.id);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete property:', error);
        alert('Failed to delete property. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  if (isLoading || isDeleting) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: colors.gray[50],
          color: colors.gray[500],
          fontWeight: 600,
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${colors.primary[200]}`,
            borderTopColor: colors.primary[600],
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        {isDeleting ? 'Deleting property...' : 'Loading property details...'}
      </div>
    );
  }

  if (error || !property) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 24,
          backgroundColor: colors.gray[50],
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            backgroundColor: colors.error[50],
            borderRadius: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.error[500],
          }}
        >
          <Building2 size={40} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.gray[900], marginBottom: 8 }}>
            Property not found
          </h2>
          <p style={{ color: colors.gray[500], maxWidth: 300, margin: '0 auto' }}>
            The property you are looking for does not exist or you do not have permission to view
            it.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: colors.gray[900],
            color: 'white',
            borderRadius: 12,
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Return Home
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.gray[50], paddingBottom: 80 }}>
      {/* --- HERO IMAGE BACKGROUND --- */}
      <div
        style={{
          height: isMobile ? 300 : 450,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: colors.gray[900],
        }}
      >
        {coverImage ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={coverImage}
            alt={property.address}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${colors.primary[800]} 0%, ${colors.primary[950]} 100%)`,
            }}
          >
            <Building2 size={64} color="rgba(255,255,255,0.2)" />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          }}
        />

        {/* Navbar-like Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 0,
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'white',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: colors.gray[800],
            }}
          >
            <Share2 size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: colors.error[500],
              marginLeft: 8,
            }}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '-80px auto 0',
          padding: isMobile ? '0 16px' : '0 32px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* --- HEADER TITLE CARD --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            variant="default"
            style={{
              padding: isMobile ? 24 : 40,
              borderRadius: isMobile ? 24 : 32,
              marginBottom: 32,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: 24,
              boxShadow: shadow.xl,
              border: `1px solid ${colors.gray[100]}`,
              background: 'white',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <Badge
                  variant={
                    property.status === 'VALUED'
                      ? 'success'
                      : property.status === 'FOLLOW_UP'
                        ? 'warning'
                        : property.status === 'REJECTED'
                          ? 'error'
                          : 'info'
                  }
                  style={{ fontSize: 11, fontWeight: 800, padding: '4px 8px' }}
                >
                  {property.status.replace('_', ' ')}
                </Badge>
                <Badge
                  style={{
                    backgroundColor: colors.gray[100],
                    color: colors.gray[600],
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '4px 8px',
                  }}
                >
                  {property.property_type}
                </Badge>
              </div>
              <h1
                style={{
                  fontSize: isMobile ? 24 : 36,
                  fontWeight: 900,
                  color: colors.gray[900],
                  margin: '0 0 8px 0',
                  lineHeight: 1.1,
                  letterSpacing: -1,
                }}
              >
                {property.address}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: colors.gray[500],
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                <MapPin size={18} color={colors.primary[500]} />
                {property.city}, {property.state} • {property.pincode}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 16,
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'flex-start' : 'flex-end',
              }}
            >
              {[
                { icon: Ruler, label: 'Area', value: `${property.area_sqft} sqft` },
                { icon: Bed, label: 'Beds', value: property.bedrooms || '-' },
                { icon: Bath, label: 'Baths', value: property.bathrooms || '-' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 16,
                    backgroundColor: colors.gray[50],
                    border: `1px solid ${colors.gray[100]}`,
                    minWidth: 80,
                  }}
                >
                  <stat.icon size={20} color={colors.gray[400]} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 16, fontWeight: 800, color: colors.gray[900] }}>
                    {stat.value}
                  </div>
                  <div
                    style={{ fontSize: 10, fontWeight: 700, color: colors.gray[400], marginTop: 2 }}
                  >
                    {stat.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* --- MAIN CONTENT GRID --- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: 32,
          }}
        >
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Gallery Preview */}
            {property.photos && property.photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: colors.gray[900],
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <ImageIcon size={20} color={colors.primary[500]} /> Gallery
                  </h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.gray[400] }}>
                    {property.photos.length} PHOTOS
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: 12,
                  }}
                >
                  {property.photos.slice(0, 4).map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        height: 120,
                        borderRadius: 16,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: `1px solid ${colors.gray[100]}`,
                        position: 'relative',
                      }}
                    >
                      <img
                        src={photo.s3_url}
                        alt={photo.photo_type}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {i === 3 && property.photos!.length > 4 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: 18,
                          }}
                        >
                          +{property.photos!.length - 4}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Map Section */}
            {property.lat && property.lng && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: colors.gray[900],
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <MapPin size={20} color={colors.primary[500]} /> Location
                </h3>
                <div
                  style={{
                    height: 400,
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: `1px solid ${colors.gray[200]}`,
                    boxShadow: shadow.md,
                  }}
                >
                  <MapView lat={property.lat} lng={property.lng} address={property.address} />
                </div>
              </motion.div>
            )}

            {/* Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.gray[900],
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Layout size={20} color={colors.primary[500]} /> Properties Details
              </h3>
              <Card
                style={{ padding: 24, borderRadius: 24, border: `1px solid ${colors.gray[100]}` }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 24,
                  }}
                >
                  {[
                    { label: 'Property Type', value: property.property_type },
                    { label: 'Case ID', value: property.id.slice(0, 8).toUpperCase(), mono: true },
                    {
                      label: 'Submission Date',
                      value: new Date(property.created_at).toLocaleDateString(),
                    },
                    {
                      label: 'Last Update',
                      value: property.updated_at
                        ? new Date(property.updated_at).toLocaleDateString()
                        : '-',
                    },
                    {
                      label: 'Age of Property',
                      value: property.age ? `${property.age} Years` : 'Unknown',
                    },
                    { label: 'Floors', value: property.total_floors || '-' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: colors.gray[400],
                          marginBottom: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: colors.gray[900],
                          fontFamily: item.mono ? typography.fonts.mono : undefined,
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                {property.description && (
                  <div
                    style={{
                      marginTop: 24,
                      paddingTop: 24,
                      borderTop: `1px solid ${colors.gray[100]}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: colors.gray[400],
                        marginBottom: 8,
                        textTransform: 'uppercase',
                      }}
                    >
                      Description
                    </div>
                    <p style={{ color: colors.gray[600], lineHeight: 1.6, margin: 0 }}>
                      {property.description}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - ACTIONS & STATUS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Action Card based on Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {property.status === 'VALUED' && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${colors.success[600]} 0%, ${colors.success[800]} 100%)`,
                    borderRadius: 24,
                    padding: 24,
                    color: 'white',
                    boxShadow: shadow.lg,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div
                      style={{ padding: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 12 }}
                    >
                      <CheckCircle2 size={24} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>Valuation Complete</div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>Ready for your review</div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/property/${property.id}/result`)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'white',
                      color: colors.success[700],
                      border: 'none',
                      borderRadius: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontSize: 15,
                    }}
                  >
                    View Valuation Report <ExternalLink size={16} />
                  </button>
                </div>
              )}

              {property.status === 'FOLLOW_UP' && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${colors.warning[500]} 0%, ${colors.warning[700]} 100%)`,
                    borderRadius: 24,
                    padding: 24,
                    color: 'white',
                    boxShadow: shadow.lg,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div
                      style={{ padding: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 12 }}
                    >
                      <Clock size={24} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>Action Required</div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>Additional details needed</div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/property/${property.id}/follow-up`)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'white',
                      color: colors.warning[700],
                      border: 'none',
                      borderRadius: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontSize: 15,
                    }}
                  >
                    Provide Information <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Timeline / History Placeholder */}
            <Card
              style={{ padding: 24, borderRadius: 24, border: `1px solid ${colors.gray[100]}` }}
            >
              <h4
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 16,
                  fontWeight: 800,
                  color: colors.gray[900],
                }}
              >
                Application History
              </h4>

              <div style={{ position: 'relative', paddingLeft: 24 }}>
                {/* Vertical Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 7,
                    top: 4,
                    bottom: 0,
                    width: 2,
                    background: colors.gray[100],
                  }}
                />

                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -24,
                      top: 4,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: colors.primary[500],
                      border: '3px solid white',
                      boxShadow: shadow.sm,
                    }}
                  />
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900] }}>
                    Application Submitted
                  </div>
                  <div style={{ fontSize: 12, color: colors.gray[500] }}>
                    {new Date(property.created_at).toLocaleString()}
                  </div>
                </div>

                {property.submitted_at && (
                  <div style={{ position: 'relative', marginBottom: 24 }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: -24,
                        top: 4,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: colors.info[500],
                        border: '3px solid white',
                        boxShadow: shadow.sm,
                      }}
                    />
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900] }}>
                      Under Review
                    </div>
                    <div style={{ fontSize: 12, color: colors.gray[500] }}>
                      {new Date(property.submitted_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
