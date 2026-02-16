'use client';

import { colors } from '@propflow/theme';
import { Button } from '@propflow/ui';
import { Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stepper from '../../../src/components/Stepper';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function ReviewPage() {
  const router = useRouter();
  const { draft, photos, submitValuation, isLoading, setCurrentStep } = usePropertyStore();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    } else if (!draft.area_sqft) {
      router.replace('/new/details');
    } else if (!draft.address) {
      router.replace('/new/location');
    } else {
      setIsValid(true);
    }
  }, [draft, router]);

  const handleEdit = (step: number, route: string) => {
    setCurrentStep(step);
    router.push(route);
  };

  const handleSubmit = async () => {
    if (!isValid) {
      alert('Please complete all previous steps before submitting.');
      return;
    }
    try {
      const id = await submitValuation();
      // In Phase 5, we will navigate to /property/[id]/result
      // For now, let's just alert and go home or to a placeholder
      alert(`Valuation submitted! ID: ${id}`);
      router.push('/');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit valuation. Please try again.');
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
    router.back();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: colors.gray[900] }}
      >
        New Valuation Request
      </h1>

      <Stepper steps={STEPS} currentStep={4} />

      <div style={{ marginTop: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px',
            color: colors.gray[800],
          }}
        >
          Review & Submit
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Property Type Section */}
          <Section title="Property Type" onEdit={() => handleEdit(0, '/new')}>
            <div style={{ fontSize: '16px', color: colors.gray[900], textTransform: 'capitalize' }}>
              {draft.property_type?.toLowerCase() || 'Not selected'}
            </div>
          </Section>

          {/* Details Section */}
          <Section title="Details" onEdit={() => handleEdit(1, '/new/details')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <DetailItem label="Area" value={draft.area_sqft ? `${draft.area_sqft} sq ft` : '-'} />
              <DetailItem label="Age" value={draft.age ? `${draft.age} years` : '-'} />
              <DetailItem label="Bedrooms" value={draft.bedrooms || '-'} />
              <DetailItem label="Bathrooms" value={draft.bathrooms || '-'} />
              {draft.floor !== undefined && <DetailItem label="Floor" value={draft.floor} />}
              {draft.total_floors !== undefined && (
                <DetailItem label="Total Floors" value={draft.total_floors} />
              )}
            </div>
          </Section>

          {/* Location Section */}
          <Section title="Location" onEdit={() => handleEdit(2, '/new/location')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '16px', color: colors.gray[900] }}>
                {draft.address || '-'}
              </div>
              <div style={{ fontSize: '14px', color: colors.gray[600] }}>
                {[draft.city, draft.state, draft.pincode].filter(Boolean).join(', ')}
              </div>
            </div>
          </Section>

          {/* Photos Section */}
          <Section title="Photos" onEdit={() => handleEdit(3, '/new/photos')}>
            {photos.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    style={{
                      flexShrink: 0,
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: `1px solid ${colors.gray[200]}`,
                    }}
                  >
                    <img
                      src={photo.uri}
                      alt="Property"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: colors.gray[500], fontStyle: 'italic' }}>
                No photos uploaded
              </div>
            )}
          </Section>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button variant="outline" onClick={handleBack} disabled={isLoading} style={{ flex: 1 }}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!isValid}
              style={{ flex: 1 }}
            >
              Submit Valuation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'white',
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.gray[800], margin: 0 }}>
          {title}
        </h3>
        <button
          onClick={onEdit}
          style={{
            background: 'none',
            border: 'none',
            color: colors.primary[600],
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '4px 8px',
            borderRadius: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primary[50])}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Edit2 size={14} />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '12px',
          color: colors.gray[500],
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: '14px', color: colors.gray[900], fontWeight: 500 }}>{value}</span>
    </div>
  );
}
