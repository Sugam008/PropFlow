'use client';

import { colors, spacing, typography } from '@propflow/theme';
import { Badge, Card } from '@propflow/ui';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, FileText, Home as HomeIcon, MapPin, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { propertyApi } from '../src/api/property';

export default function HomePage() {
  const router = useRouter();
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getProperties(),
  });

  const handlePropertyClick = (id: string) => {
    router.push(`/property/${id}`);
  };

  const handleNewValuation = () => {
    router.push('/new');
  };

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: spacing[6],
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[8],
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: colors.gray[900],
              margin: 0,
            }}
          >
            My Properties
          </h1>
          <p
            style={{
              color: colors.gray[500],
              fontSize: 16,
              marginTop: 8,
            }}
          >
            Track your valuation requests and reports
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewValuation}
          aria-label="Create a new valuation request"
          style={{
            backgroundColor: colors.primary[600],
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
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          }}
        >
          <Plus size={18} />
          New Valuation
        </motion.button>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: spacing[8], color: colors.gray[500] }}>
          Loading properties...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: spacing[8], color: colors.error[600] }}>
          Failed to load properties. Please try again later.
        </div>
      )}

      {!isLoading && !error && properties?.length === 0 && (
        <div style={{ textAlign: 'center', padding: spacing[8], color: colors.gray[500] }}>
          No properties found. Start by creating a new valuation request.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {properties?.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handlePropertyClick(property.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePropertyClick(property.id);
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            <Card
              style={{
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                border: `1px solid ${colors.gray[200]}`,
              }}
              className="hover:border-primary-300 hover:shadow-md"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: colors.gray[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.gray[400],
                  }}
                >
                  <HomeIcon size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: colors.gray[900],
                      marginBottom: 4,
                    }}
                  >
                    {property.address}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      color: colors.gray[500],
                      fontSize: 13,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={14} />
                      {property.city}, {property.state}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} />
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={14} />
                      {property.property_type}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.gray[400],
                    backgroundColor: colors.gray[50],
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
