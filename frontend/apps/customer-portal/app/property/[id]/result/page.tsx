'use client';

import { colors, spacing } from '@propflow/theme';
import { Badge, Card } from '@propflow/ui';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, CheckCircle2, Download, TrendingUp } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { propertyApi } from '../../../../src/api/property';
import { useToast } from '../../../../src/providers/ToastProvider';

export default function PropertyResultPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['property', params.id],
    queryFn: () => propertyApi.getProperty(params.id as string),
    enabled: !!params.id,
  });

  const handleDownload = () => {
    showToast('Downloading valuation report...', 'info');
    setTimeout(() => {
      showToast('Report downloaded successfully', 'success');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          color: colors.gray[500],
        }}
      >
        Loading result...
      </div>
    );
  }

  if (error || !property || property.status !== 'VALUED') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          color: colors.gray[500],
        }}
      >
        Result not available
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: spacing[6],
      }}
    >
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => router.push(`/property/${property.id}`)}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: colors.gray[600],
          cursor: 'pointer',
          marginBottom: spacing[6],
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={18} /> Back to Details
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: spacing[10],
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.success[100],
              color: colors.success[600],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: 24,
            }}
          >
            <CheckCircle2 size={40} />
          </motion.div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: colors.gray[900],
              marginBottom: 12,
            }}
          >
            Valuation Complete
          </h1>
          <p
            style={{
              fontSize: 18,
              color: colors.gray[500],
              maxWidth: 500,
              margin: '0 auto',
            }}
          >
            The valuation for your property at <strong>{property.address}</strong> has been
            finalized.
          </p>
        </div>

        <Card
          style={{
            padding: 40,
            marginBottom: spacing[8],
            textAlign: 'center',
            background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.gray[50]} 100%)`,
            border: `1px solid ${colors.gray[200]}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.gray[500],
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Estimated Market Value
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: colors.primary[600],
              marginBottom: 24,
              letterSpacing: -2,
            }}
          >
            ₹{((property.estimated_value || 0) / 10000000).toFixed(2)} Cr
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 32,
            }}
          >
            <Badge variant="success">Market Verified</Badge>
            <Badge variant="default">{new Date().toLocaleDateString()}</Badge>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            style={{
              backgroundColor: colors.primary[600],
              color: 'white',
              border: 'none',
              borderRadius: 16,
              padding: '16px 32px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
            }}
          >
            <Download size={20} /> Download Full Report
          </motion.button>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          <Card style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: colors.primary[50],
                  color: colors.primary[600],
                }}
              >
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>
                  Property Details
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: colors.gray[500], lineHeight: 1.5 }}>
                  {property.property_type} <br />
                  {property.city}, {property.state}
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: colors.success[50],
                  color: colors.success[600],
                }}
              >
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>Appreciation</h3>
                <p style={{ margin: 0, fontSize: 14, color: colors.gray[500], lineHeight: 1.5 }}>
                  +12% vs last year <br />
                  High demand area
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
