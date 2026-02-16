'use client';

import { colors } from '@propflow/theme';
import { Button, Input } from '@propflow/ui';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stepper from '../../../src/components/Stepper';
import { useMediaQuery } from '../../../src/hooks/useMediaQuery';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const LocationPickerMap = dynamic(() => import('../../../src/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '400px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.gray[100],
        borderRadius: '16px',
      }}
    >
      <div style={{ color: colors.gray[400], fontSize: 14, fontWeight: 600 }}>Loading Map...</div>
    </div>
  ),
});

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function LocationPage() {
  const router = useRouter();
  const { draft, setDraft, setCurrentStep } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    } else if (!draft.area_sqft) {
      router.replace('/new/details');
    }
  }, [draft, router]);

  const handleChange = (field: string, value: string | number) => {
    setDraft({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setDraft({ lat, lng });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.address) newErrors.address = 'Address is required';
    if (!draft.city) newErrors.city = 'City is required';
    if (!draft.state) newErrors.state = 'State is required';
    if (!draft.pincode) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(3); // Go to Photos
      router.push('/new/photos');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.back();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: colors.gray[900] }}
      >
        New Valuation Request
      </h1>

      <Stepper steps={STEPS} currentStep={2} />

      <div style={{ marginTop: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px',
            color: colors.gray[800],
          }}
        >
          Location Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: '400px', width: '100%' }}>
            <LocationPickerMap
              lat={draft.lat || 28.6139}
              lng={draft.lng || 77.209}
              onLocationSelect={handleLocationSelect}
            />
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: colors.gray[500],
                textAlign: 'center',
              }}
            >
              Drag the marker or click on the map to pinpoint the property location.
            </div>
          </div>

          <Input
            label="Address"
            placeholder="Flat No, Building Name, Street"
            value={draft.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            error={errors.address}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '16px',
            }}
          >
            <Input
              label="City"
              placeholder="City"
              value={draft.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              error={errors.city}
            />
            <Input
              label="State"
              placeholder="State"
              value={draft.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              error={errors.state}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Pincode"
              placeholder="123456"
              value={draft.pincode || ''}
              onChange={(e) => handleChange('pincode', e.target.value)}
              error={errors.pincode}
              type="number"
            />
            {/* Spacer to align grid if needed, or maybe add landmark later */}
            {!isMobile && <div />}
          </div>

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
