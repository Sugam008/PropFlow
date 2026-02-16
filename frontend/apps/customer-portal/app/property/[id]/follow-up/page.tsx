'use client';

import { colors, spacing } from '@propflow/theme';
import { Card } from '@propflow/ui';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Send, UploadCloud } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { propertyApi } from '../../../../src/api/property';
import { useToast } from '../../../../src/providers/ToastProvider';

export default function PropertyFollowUpPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['property', params.id],
    queryFn: () => propertyApi.getProperty(params.id as string),
    enabled: !!params.id,
  });

  const handleSubmit = async () => {
    if (!notes.trim()) {
      showToast('Please enter your response', 'error');
      return;
    }

    setIsSubmitting(true);
    // TODO: Implement API call for follow-up response
    // await propertyApi.submitFollowUp(property.id, notes);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Response submitted successfully', 'success');
      router.push(`/property/${property?.id}`);
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
        Loading...
      </div>
    );
  }

  if (error || !property || property.status !== 'FOLLOW_UP') {
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
        Action not required
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: spacing[8],
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.warning[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.warning[600],
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: colors.gray[900],
                margin: 0,
                marginBottom: 4,
              }}
            >
              Additional Information Needed
            </h1>
            <p style={{ margin: 0, color: colors.gray[500], fontSize: 16 }}>
              The valuer has requested clarification for <strong>{property.address}</strong>
            </p>
          </div>
        </div>

        <Card style={{ padding: 32, marginBottom: spacing[8] }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.gray[900],
              marginBottom: 16,
            }}
          >
            Request Details
          </h3>
          <div
            style={{
              backgroundColor: colors.gray[50],
              padding: 24,
              borderRadius: 16,
              border: `1px solid ${colors.gray[200]}`,
              color: colors.gray[700],
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            "Please provide an updated utility bill or property tax receipt from the current year to
            verify ownership details. The document uploaded previously was from 2023."
          </div>

          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.gray[900],
              marginBottom: 16,
            }}
          >
            Your Response
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your response here..."
            style={{
              width: '100%',
              minHeight: 150,
              padding: 16,
              borderRadius: 12,
              border: `1px solid ${colors.gray[300]}`,
              fontSize: 16,
              marginBottom: 24,
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />

          <div
            style={{
              border: `2px dashed ${colors.gray[300]}`,
              borderRadius: 12,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: 32,
              transition: 'all 0.2s ease',
              backgroundColor: colors.gray[50],
            }}
          >
            <UploadCloud size={32} color={colors.primary[500]} style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 600, color: colors.gray[700], marginBottom: 4 }}>
              Click to upload documents
            </div>
            <div style={{ fontSize: 13, color: colors.gray[400] }}>PDF, JPG, PNG (max 10MB)</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                backgroundColor: colors.primary[600],
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '14px 32px',
                fontSize: 16,
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              }}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  Submit Response <Send size={18} />
                </>
              )}
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
