'use client';

import { colors, glass } from '@propflow/theme';
import { PropertyType } from '@propflow/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpCircle,
  Bath,
  Bed,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Ruler,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewFlowHeader from '../../../src/components/NewFlowHeader';
import Stepper from '../../../src/components/Stepper';
import { useMediaQuery } from '../../../src/hooks/useMediaQuery';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { draft, setDraft, setCurrentStep } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    }
  }, [draft.property_type, router]);

  const handleChange = (field: string, value: string | number) => {
    setDraft({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!draft.area_sqft) {
      newErrors.area_sqft = 'Area is required';
    } else if (draft.area_sqft < 50) {
      newErrors.area_sqft = 'Min. area required is 50 sq ft';
    } else if (draft.area_sqft > 100000) {
      newErrors.area_sqft = 'Please verify high area value';
    }

    if (draft.age !== undefined && draft.age < 0) {
      newErrors.age = 'Age cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      setCurrentStep(2);
      router.push('/new/location');
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
    router.back();
  };

  const isResidential = [PropertyType.APARTMENT, PropertyType.HOUSE, PropertyType.VILLA].includes(
    draft.property_type as PropertyType,
  );

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
            Property <span style={{ opacity: 0.6 }}>Details</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 500 }}>
            Step 2: Enter physical characteristics
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={1} />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            ...glass.card,
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: isMobile ? '24px' : '48px',
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Primary Metrics Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 24,
              }}
            >
              <StyledInput
                label="Area (sq ft)"
                icon={Ruler}
                placeholder="e.g. 1200"
                value={draft.area_sqft}
                onChange={(val) => handleChange('area_sqft', Number(val))}
                error={errors.area_sqft}
              />
              <StyledInput
                label="Property Age (Yrs)"
                icon={Calendar}
                placeholder="e.g. 5"
                value={draft.age}
                onChange={(val) => handleChange('age', Number(val))}
                error={errors.age}
              />
            </div>

            <AnimatePresence mode="wait">
              {isResidential && (
                <motion.div
                  key="residential-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '32px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: 24,
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 24,
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        opacity: 0.5,
                      }}
                    >
                      <Info size={14} /> Room Configuration
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      <StyledInput
                        label="Bedrooms"
                        icon={Bed}
                        type="number"
                        value={draft.bedrooms}
                        onChange={(val) => handleChange('bedrooms', Number(val))}
                        compact
                      />
                      <StyledInput
                        label="Bathrooms"
                        icon={Bath}
                        type="number"
                        value={draft.bathrooms}
                        onChange={(val) => handleChange('bathrooms', Number(val))}
                        compact
                      />
                    </div>

                    {draft.property_type === PropertyType.APARTMENT && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 24,
                          paddingTop: 24,
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <StyledInput
                          label="Floor No."
                          icon={Layers}
                          type="number"
                          value={draft.floor}
                          onChange={(val) => handleChange('floor', Number(val))}
                          compact
                        />
                        <StyledInput
                          label="Total Floors"
                          icon={ArrowUpCircle}
                          type="number"
                          value={draft.total_floors}
                          onChange={(val) => handleChange('total_floors', Number(val))}
                          compact
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                style={{
                  flex: 0.8,
                  padding: '18px',
                  borderRadius: 20,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <ChevronLeft size={20} />
                Back
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'white', color: colors.primary[700], scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                style={{
                  flex: 1.2,
                  padding: '18px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  color: colors.primary[900],
                  fontWeight: 900,
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                }}
              >
                Continue to Location
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface StyledInputProps {
  label: string;
  icon: any;
  value: string | number | undefined;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  compact?: boolean;
}

function StyledInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  type = 'number',
  compact,
}: StyledInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      <label
        style={{
          color: 'white',
          fontSize: 11,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          opacity: 0.6,
          paddingLeft: 4,
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: isFocused ? 'white' : 'rgba(255,255,255,0.3)',
            transition: 'color 0.3s ease',
            zIndex: 1,
          }}
        >
          <Icon size={compact ? 16 : 20} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: `2px solid ${error ? colors.error[400] : isFocused ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 18,
            padding: compact ? '14px 16px 14px 44px' : '18px 20px 18px 52px',
            color: 'white',
            fontSize: compact ? 15 : 17,
            fontWeight: 600,
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isFocused ? '0 0 20px rgba(255,255,255,0.05)' : 'none',
          }}
        />
      </div>
      {error && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ color: colors.error[400], fontSize: 12, fontWeight: 600, paddingLeft: 8 }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
