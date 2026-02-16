'use client';

import { colors } from '@propflow/theme';
import { PropertyType } from '@propflow/types';
import { motion } from 'framer-motion';
import { Building2, Home, Hotel, Trees, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Stepper from '../../src/components/Stepper';
import { usePropertyStore } from '../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function PropertyTypePage() {
  const router = useRouter();
  const { setDraft, setCurrentStep, draft } = usePropertyStore();

  const handleSelect = (type: PropertyType) => {
    setDraft({ property_type: type });
    setCurrentStep(1); // Advance to Details step
    router.push('/new/details');
  };

  const options = [
    { type: PropertyType.APARTMENT, label: 'Apartment', icon: Building2 },
    { type: PropertyType.HOUSE, label: 'House', icon: Home },
    { type: PropertyType.VILLA, label: 'Villa', icon: Hotel },
    { type: PropertyType.COMMERCIAL, label: 'Commercial', icon: Warehouse },
    { type: PropertyType.LAND, label: 'Land', icon: Trees },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: colors.gray[900] }}
      >
        New Valuation Request
      </h1>

      <Stepper steps={STEPS} currentStep={0} />

      <div style={{ marginTop: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px',
            color: colors.gray[800],
          }}
        >
          What type of property is it?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
          }}
        >
          {options.map((option) => {
            const isSelected = draft.property_type === option.type;
            const Icon = option.icon;

            return (
              <motion.button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 16px',
                  border: `2px solid ${isSelected ? colors.primary[600] : colors.gray[200]}`,
                  borderRadius: '12px',
                  backgroundColor: isSelected ? colors.primary[50] : 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = colors.primary[300];
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = colors.gray[200];
                }}
                aria-label={`Select ${option.label}`}
              >
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'white' : colors.gray[100],
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} color={isSelected ? colors.primary[600] : colors.gray[600]} />
                </div>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: isSelected ? colors.primary[900] : colors.gray[700],
                  }}
                >
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
