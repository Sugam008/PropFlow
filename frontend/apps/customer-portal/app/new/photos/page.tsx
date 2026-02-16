'use client';

import { colors } from '@propflow/theme';
import { Button } from '@propflow/ui';
import { Camera, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Stepper from '../../../src/components/Stepper';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

export default function PhotosPage() {
  const router = useRouter();
  const { photos, addPhoto, removePhoto, setCurrentStep, draft } = usePropertyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    } else if (!draft.area_sqft) {
      router.replace('/new/details');
    } else if (!draft.address) {
      router.replace('/new/location');
    }
  }, [draft, router]);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const uri = URL.createObjectURL(file);
        addPhoto({
          id: Math.random().toString(36).substring(7),
          uri,
          type: 'camera_capture',
          uploaded: false,
          file,
        });
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleNext = () => {
    setCurrentStep(4);
    router.push('/new/review');
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.back();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: colors.gray[900] }}
      >
        New Valuation Request
      </h1>

      <Stepper steps={STEPS} currentStep={3} />

      <div style={{ marginTop: '32px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '8px',
            color: colors.gray[800],
          }}
        >
          Take Property Photos
        </h2>
        <p style={{ fontSize: '14px', color: colors.gray[500], marginBottom: '24px' }}>
          Capture photos directly from your camera to verify the property exists.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${colors.gray[300]}`,
              borderRadius: '16px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: colors.gray[50],
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: colors.primary[50],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: colors.primary[600],
              }}
            >
              <Camera size={32} />
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: colors.gray[900],
                marginBottom: '4px',
              }}
            >
              Take Photo
            </div>
            <div style={{ fontSize: '12px', color: colors.gray[500] }}>Tap to open camera</div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
            />
          </div>

          {photos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '16px',
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${colors.gray[200]}`,
                  }}
                >
                  <img
                    src={photo.uri}
                    alt="Property"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button variant="outline" onClick={handleBack} style={{ flex: 1 }}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext} style={{ flex: 1 }}>
              {photos.length > 0 ? 'Next' : 'Skip & Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
