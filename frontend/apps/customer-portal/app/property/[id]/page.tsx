'use client';

import { colors, spacing, typography } from '@propflow/theme';
import { Badge, Card } from '@propflow/ui';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { propertyApi } from '../../../src/api/property';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();

  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['property', params.id],
    queryFn: () => propertyApi.getProperty(params.id as string),
    enabled: !!params.id,
  });

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
        Loading property details...
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
          height: '50vh',
          color: colors.gray[500],
        }}
      >
        Property not found
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
        onClick={() => router.push('/')}
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
        <ArrowLeft size={18} /> Back to Properties
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing[6],
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: colors.gray[900],
                marginBottom: 8,
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
              }}
            >
              <MapPin size={18} /> {property.city}, {property.state} {property.pincode}
            </div>
          </div>
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
          >
            {property.status.replace('_', ' ')}
          </Badge>
        </div>

        {property.status === 'VALUED' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: spacing[8] }}
          >
            <Card
              style={{
                background: `linear-gradient(135deg, ${colors.success[50]} 0%, ${colors.success[100]} 100%)`,
                border: `1px solid ${colors.success[200]}`,
                padding: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.success[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.success[700],
                  }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: colors.success[900],
                    }}
                  >
                    Valuation Complete
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: colors.success[700],
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  >
                    Your property valuation report is ready.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/property/${property.id}/result`)}
                style={{
                  backgroundColor: colors.success[600],
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                }}
              >
                View Result <ChevronRight size={18} />
              </motion.button>
            </Card>
          </motion.div>
        )}

        {property.status === 'FOLLOW_UP' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: spacing[8] }}
          >
            <Card
              style={{
                background: `linear-gradient(135deg, ${colors.warning[50]} 0%, ${colors.warning[100]} 100%)`,
                border: `1px solid ${colors.warning[200]}`,
                padding: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.warning[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.warning[700],
                  }}
                >
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: colors.warning[900],
                    }}
                  >
                    Action Required
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: colors.warning[800],
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  >
                    We need additional information to proceed.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/property/${property.id}/follow-up`)}
                style={{
                  backgroundColor: colors.warning[600],
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)',
                }}
              >
                Provide Info <ChevronRight size={18} />
              </motion.button>
            </Card>
          </motion.div>
        )}

        <Card style={{ padding: 32, marginBottom: spacing[8] }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.gray[900],
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <FileText size={20} color={colors.primary[500]} /> Property Details
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 24,
            }}
          >
            <div>
              <div style={{ color: colors.gray[500], fontSize: 13, marginBottom: 4 }}>
                Property Type
              </div>
              <div style={{ color: colors.gray[900], fontWeight: 600 }}>
                {property.property_type}
              </div>
            </div>
            <div>
              <div style={{ color: colors.gray[500], fontSize: 13, marginBottom: 4 }}>Case ID</div>
              <div
                style={{
                  color: colors.gray[900],
                  fontWeight: 600,
                  fontFamily: typography.fonts.mono,
                }}
              >
                {property.id.toUpperCase()}
              </div>
            </div>
            <div>
              <div style={{ color: colors.gray[500], fontSize: 13, marginBottom: 4 }}>
                Submission Date
              </div>
              <div style={{ color: colors.gray[900], fontWeight: 600 }}>
                {new Date(property.created_at).toLocaleDateString()}
              </div>
            </div>
            {property.updated_at && (
              <div>
                <div style={{ color: colors.gray[500], fontSize: 13, marginBottom: 4 }}>
                  Last Update
                </div>
                <div style={{ color: colors.gray[900], fontWeight: 600 }}>
                  {new Date(property.updated_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
