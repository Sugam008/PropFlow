'use client';

import { colors } from '@propflow/theme';
import { PropertyType } from '@propflow/types';
import { Button, Input } from '@propflow/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stepper from '../../../src/components/Stepper';
import { useMediaQuery } from '../../../src/hooks/useMediaQuery';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { draft, setDraft, setCurrentStep } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    }
  }, [draft.property_type, router]);

  const handleChange = (field: string, value: string | number) => {
    setDraft({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.area_sqft) newErrors.area_sqft = 'Area is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(2); // Go to Location
      router.push('/new/location');
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
    router.back();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: colors.gray[900] }}
      >
        New Valuation Request
      </h1>

      <Stepper steps={STEPS} currentStep={1} />

      <div style={{ marginTop: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px',
            color: colors.gray[800],
          }}
        >
          Property Characteristics
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '16px',
            }}
          >
            <Input
              label="Area (sq ft)"
              placeholder="e.g. 1200"
              value={draft.area_sqft || ''}
              onChange={(e) => handleChange('area_sqft', Number(e.target.value))}
              error={errors.area_sqft}
              type="number"
            />
            <Input
              label="Property Age (years)"
              placeholder="e.g. 5"
              value={draft.age || ''}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              type="number"
            />
          </div>

          {/* Conditional fields based on property type */}
          {(draft.property_type === PropertyType.APARTMENT ||
            draft.property_type === PropertyType.HOUSE ||
            draft.property_type === PropertyType.VILLA) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
              }}
            >
              <Input
                label="Bedrooms"
                placeholder="e.g. 2"
                value={draft.bedrooms || ''}
                onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
                type="number"
              />
              <Input
                label="Bathrooms"
                placeholder="e.g. 2"
                value={draft.bathrooms || ''}
                onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
                type="number"
              />
            </div>
          )}

          {draft.property_type === PropertyType.APARTMENT && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Floor No."
                placeholder="e.g. 4"
                value={draft.floor || ''}
                onChange={(e) => handleChange('floor', Number(e.target.value))}
                type="number"
              />
              <Input
                label="Total Floors"
                placeholder="e.g. 10"
                value={draft.total_floors || ''}
                onChange={(e) => handleChange('total_floors', Number(e.target.value))}
                type="number"
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button variant="outline" onClick={handleBack} style={{ flex: 1 }}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext} style={{ flex: 1 }}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
