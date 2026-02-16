'use client';

import { colors } from '@propflow/theme';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, Edit2, Image as ImageIcon, MapPin, Ruler } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewFlowHeader from '../../../src/components/NewFlowHeader';
import Stepper from '../../../src/components/Stepper';
import { useMediaQuery } from '../../../src/hooks/useMediaQuery';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function ReviewPage() {
  const router = useRouter();
  const { draft, photos, submitValuation, setCurrentStep } = usePropertyStore();
  const [isValid, setIsValid] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    } else if (!draft.area_sqft) {
      router.replace('/new/details');
    } else if (!draft.address) {
      router.replace('/new/location');
    } else if (photos.length === 0) {
      router.replace('/new/photos');
    } else {
      setIsValid(true);
    }
  }, [draft, photos, router]);

  const handleEdit = (step: number, route: string) => {
    setCurrentStep(step);
    router.push(route);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await submitValuation();
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
      alert('Network error. Please try again.');
    }
  };

  if (isSubmitting) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: colors.primary[900],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          gap: 24,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: 64,
            height: 64,
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: 'white',
            borderRadius: '50%',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
            Finalizing Transmission
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            Updating property ledger and satellite records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
        padding: isMobile ? '20px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: 800, width: '100%' }}>
        <NewFlowHeader />
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: isMobile ? 32 : 48,
              fontWeight: 900,
              color: 'white',
              margin: '0 0 12px 0',
              letterSpacing: -1.5,
            }}
          >
            Review <span style={{ opacity: 0.6 }}>Submission</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 500 }}>
            Step 5: Final validation of intelligence
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={4} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Summary Glass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: isMobile ? '24px' : '40px',
              borderRadius: 32,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            {/* 1. Type & Size */}
            <Section icon={Building2} title="Classification" onEdit={() => handleEdit(0, '/new')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Tag label="TYPE" value={draft.property_type || '-'} />
                <Tag label="SIZE" value={draft.area_sqft ? `${draft.area_sqft} sq ft` : '-'} />
                <Tag label="AGE" value={draft.age !== undefined ? `${draft.age} Yrs` : '-'} />
              </div>
            </Section>

            {/* 2. Configuration */}
            <Section
              icon={Ruler}
              title="Configuration"
              onEdit={() => handleEdit(1, '/new/details')}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: 16,
                }}
              >
                <SummaryBox label="Bedrooms" value={draft.bedrooms || '-'} />
                <SummaryBox label="Bathrooms" value={draft.bathrooms || '-'} />
                {draft.floor !== undefined && <SummaryBox label="Floor" value={draft.floor} />}
              </div>
            </Section>

            {/* 3. Location */}
            <Section icon={MapPin} title="Geography" onEdit={() => handleEdit(2, '/new/location')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>
                  {draft.address || 'No address set'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500 }}>
                  {[draft.city, draft.state, draft.pincode].filter(Boolean).join(', ')}
                </div>
              </div>
            </Section>

            {/* 4. Photos */}
            <Section
              icon={ImageIcon}
              title="Documentation"
              onEdit={() => handleEdit(3, '/new/photos')}
            >
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                {photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.uri}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
            </Section>

            {/* Nav Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                style={{
                  flex: 0.4,
                  padding: '18px',
                  borderRadius: 20,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Review Photos
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: '#22c55e', color: 'white', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '18px',
                  borderRadius: 20,
                  backgroundColor: colors.success[400],
                  border: 'none',
                  color: colors.primary[900],
                  fontWeight: 900,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                }}
              >
                Submit Request <CheckCircle2 size={22} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  onEdit,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.5)' }}
        >
          <Icon size={18} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
        </div>
        <button
          onClick={onEdit}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 10,
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Edit2 size={12} /> Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800, marginRight: 8 }}
      >
        {label}
      </span>
      <span style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
        {value}
      </span>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span style={{ color: 'white', fontSize: 16, fontWeight: 800 }}>{value}</span>
    </div>
  );
}
