'use client';

import { colors, glass } from '@propflow/theme';
import { PropertyType } from '@propflow/types';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Home, Hotel, Trees, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NewFlowHeader from '../../src/components/NewFlowHeader';
import Stepper from '../../src/components/Stepper';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import { usePropertyStore } from '../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function PropertyTypePage() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { setDraft, setCurrentStep, draft } = usePropertyStore();

  const handleSelect = (type: PropertyType) => {
    setDraft({ property_type: type });
    setCurrentStep(1);
    router.push('/new/details');
  };

  const options = [
    {
      type: PropertyType.APARTMENT,
      label: 'Apartment',
      icon: Building2,
      desc: 'Flats, Penthouses, Condos',
    },
    { type: PropertyType.HOUSE, label: 'House', icon: Home, desc: 'Individual Homes, Row Houses' },
    { type: PropertyType.VILLA, label: 'Villa', icon: Hotel, desc: 'Luxury Villas, Bungalows' },
    {
      type: PropertyType.COMMERCIAL,
      label: 'Commercial',
      icon: Warehouse,
      desc: 'Offices, Shops, Warehouses',
    },
    { type: PropertyType.LAND, label: 'Land', icon: Trees, desc: 'Residential/Commercial Plots' },
  ];

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
        {/* Header Area */}
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
            New <span style={{ opacity: 0.6 }}>Valuation</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 500 }}>
            Step 1: Define the asset category
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={0} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...glass.card,
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: isMobile ? '24px' : '40px',
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: 'white',
              marginBottom: 32,
              textAlign: isMobile ? 'left' : 'center',
            }}
          >
            Select Property Type
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {options.map((option, idx) => {
              const isSelected = draft.property_type === option.type;
              const Icon = option.icon;

              return (
                <motion.button
                  key={option.type}
                  onClick={() => handleSelect(option.type)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '24px',
                    border: `1.5px solid ${isSelected ? colors.white : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 24,
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: isSelected ? colors.white : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? colors.primary[700] : 'white',
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                      {option.desc}
                    </div>
                  </div>

                  <ArrowRight size={18} color="rgba(255,255,255,0.3)" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
