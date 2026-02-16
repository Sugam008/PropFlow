'use client';

import { colors, glass } from '@propflow/theme';
import { PropertyType } from '@propflow/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  Navigation,
  Target,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { propertyApi } from '../../../src/api/property';
import NewFlowHeader from '../../../src/components/NewFlowHeader';
import Stepper from '../../../src/components/Stepper';
import { useMediaQuery } from '../../../src/hooks/useMediaQuery';
import { usePropertyStore } from '../../../src/store/usePropertyStore';

const STEPS = ['Type', 'Details', 'Location', 'Photos', 'Review'];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const result = await propertyApi.geocodeAddress(address);
    return result;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

interface RoomCategory {
  id: string;
  label: string;
  mandatory: boolean;
}

function getRoomCategories(
  propertyType?: string,
  bedrooms?: number,
  bathrooms?: number,
): RoomCategory[] {
  const rooms: RoomCategory[] = [];

  rooms.push({ id: 'exterior', label: 'Exterior', mandatory: true });
  rooms.push({ id: 'living_room', label: 'Living Room', mandatory: true });
  rooms.push({ id: 'kitchen', label: 'Kitchen', mandatory: true });
  rooms.push({ id: 'bedroom_1', label: 'Bedroom 1', mandatory: true });
  rooms.push({ id: 'bathroom_1', label: 'Bathroom 1', mandatory: true });

  if (bedrooms && bedrooms >= 2) {
    rooms.push({ id: 'bedroom_2', label: 'Bedroom 2', mandatory: true });
  }
  if (bedrooms && bedrooms >= 3) {
    rooms.push({ id: 'bedroom_3', label: 'Bedroom 3', mandatory: true });
  }
  if (bathrooms && bathrooms >= 2) {
    rooms.push({ id: 'bathroom_2', label: 'Bathroom 2', mandatory: true });
  }

  if (propertyType === PropertyType.APARTMENT || propertyType === PropertyType.VILLA) {
    rooms.push({ id: 'balcony', label: 'Balcony', mandatory: false });
  }
  if (propertyType !== PropertyType.LAND) {
    rooms.push({ id: 'parking', label: 'Parking', mandatory: false });
  }

  if (propertyType === PropertyType.COMMERCIAL) {
    const commercialRooms: RoomCategory[] = [
      { id: 'exterior', label: 'Exterior', mandatory: true },
      { id: 'reception', label: 'Reception', mandatory: true },
      { id: 'office_area', label: 'Office Area', mandatory: true },
      { id: 'toilet', label: 'Toilet/Washroom', mandatory: true },
      { id: 'meeting_room', label: 'Meeting Room', mandatory: true },
      { id: 'pantry', label: 'Pantry', mandatory: false },
      { id: 'parking', label: 'Parking', mandatory: false },
    ];
    return commercialRooms;
  }

  if (propertyType === PropertyType.LAND) {
    const landRooms: RoomCategory[] = [
      { id: 'front_view', label: 'Front View', mandatory: true },
      { id: 'side_view_1', label: 'Side View 1', mandatory: true },
      { id: 'side_view_2', label: 'Side View 2', mandatory: true },
      { id: 'boundary', label: 'Boundary Markers', mandatory: true },
      { id: 'approach_road', label: 'Approach Road', mandatory: true },
    ];
    return landRooms;
  }

  return rooms;
}

export default function PhotosPage() {
  const router = useRouter();
  const { photos, addPhoto, removePhoto, setCurrentStep, draft, setDraft } = usePropertyStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showWarning, setShowWarning] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [_locationVerified, setLocationVerified] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const roomCategories = getRoomCategories(draft.property_type, draft.bedrooms, draft.bathrooms);

  const mandatoryRooms = roomCategories.filter((r) => r.mandatory);
  const capturedRoomIds = new Set(photos.map((p) => p.roomCategory).filter(Boolean));
  const capturedMandatoryCount = mandatoryRooms.filter((r) => capturedRoomIds.has(r.id)).length;
  const allMandatoryCaptured = capturedMandatoryCount === mandatoryRooms.length;

  useEffect(() => {
    if (!draft.property_type) {
      router.replace('/new');
    } else if (!draft.area_sqft) {
      router.replace('/new/details');
    } else if (!draft.address) {
      router.replace('/new/location');
    }
  }, [draft, router]);

  const handleVerifyLocation = async () => {
    setIsVerifying(true);
    setLocationError(null);

    try {
      const getPosition = (highAccuracy: boolean): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => reject(err),
            {
              enableHighAccuracy: highAccuracy,
              timeout: 30000,
              maximumAge: 0,
            },
          );
        });
      };

      let position: GeolocationPosition;
      try {
        position = await getPosition(true);
      } catch (highError: any) {
        if (highError.code === 3) {
          position = await getPosition(false);
        } else {
          throw highError;
        }
      }

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const addressVariations = [
        `${draft.landmark || ''}, ${draft.city || ''}, ${draft.state || ''}`.trim(),
        `${draft.address_line1 || ''}, ${draft.landmark || ''}, ${draft.city || ''}`.trim(),
      ].filter((a) => a.length > 5);

      let addressCoords: { lat: number; lng: number } | null = null;

      for (const address of addressVariations) {
        addressCoords = await geocodeAddress(address);
        if (addressCoords) break;
      }

      if (!addressCoords) {
        setLocationError(
          'Could not verify address. Please ensure your landmark is valid and try again.',
        );
        setIsVerifying(false);
        return;
      }

      const distance = calculateDistance(userLat, userLng, addressCoords.lat, addressCoords.lng);
      const threshold = retryCount >= 2 ? 150 : 100;

      if (distance > threshold) {
        setLocationError(
          `You must be within ${threshold}m of the property. Current distance: ${Math.round(distance)}m`,
        );
        setRetryCount((prev) => prev + 1);
        setIsVerifying(false);
        return;
      }

      setDraft({ lat: addressCoords.lat, lng: addressCoords.lng });
      setLocationVerified(true);
      setShowLocationModal(false);
    } catch (error: any) {
      if (error.code === 1) {
        setLocationError(
          'Location permission denied. Please enable location access in your browser settings.',
        );
      } else if (error.code === 2) {
        setLocationError('Unable to get your location. Please check your GPS and try again.');
      } else if (error.code === 3) {
        setLocationError(
          "Location request timed out. Please try again - make sure you're outdoors or near a window.",
        );
      } else {
        setLocationError('Failed to verify location. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setCameraStream(stream);
      setShowCameraModal(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setCameraError(
          'Camera permission denied. Please enable camera access in your browser settings.',
        );
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. Please try again.');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  // Attach stream to video element when it changes
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !selectedRoom) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const uri = URL.createObjectURL(blob);
            addPhoto({
              id: Math.random().toString(36).substring(7),
              uri,
              type: 'camera_capture',
              uploaded: false,
              file: new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' }),
              roomCategory: selectedRoom,
            });
            setShowWarning(false);
          }
          setIsCapturing(false);
          stopCamera();
        },
        'image/jpeg',
        0.9,
      );
    } else {
      setIsCapturing(false);
    }
  };

  const handleNext = () => {
    if (photos.length === 0) {
      setShowWarning(true);
      return;
    }
    if (!allMandatoryCaptured) {
      setShowWarning(true);
      return;
    }
    setCurrentStep(4);
    router.push('/new/review');
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.back();
  };

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
            Capture <span style={{ opacity: 0.6 }}>Evidence</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: 500 }}>
            Step 4: Real-time property documentation
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={3} />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            ...glass.card,
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: isMobile ? '24px' : '40px',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Progress Indicator */}
            <div
              style={{
                padding: '16px',
                backgroundColor: allMandatoryCaptured
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${allMandatoryCaptured ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {allMandatoryCaptured ? (
                  <CheckCircle2 size={20} style={{ color: colors.success[400] }} />
                ) : (
                  <Target size={20} style={{ color: '#3b82f6' }} />
                )}
                <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
                  {capturedMandatoryCount} of {mandatoryRooms.length} mandatory photos
                </span>
              </div>
              {allMandatoryCaptured && (
                <span style={{ color: colors.success[400], fontSize: 12, fontWeight: 700 }}>
                  All mandatory photos captured!
                </span>
              )}
            </div>

            {/* Room Category Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                }}
              >
                Select Room to Capture
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {roomCategories.map((room) => {
                  const isCaptured = capturedRoomIds.has(room.id);
                  const isSelected = selectedRoom === room.id;
                  return (
                    <motion.button
                      key={room.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRoom(room.id)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 12,
                        border: 'none',
                        backgroundColor: isSelected
                          ? colors.primary[500]
                          : isCaptured
                            ? 'rgba(34, 197, 94, 0.15)'
                            : 'rgba(255,255,255,0.08)',
                        color: isSelected ? 'white' : isCaptured ? colors.success[300] : 'white',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {isCaptured && <Check size={14} />}
                      {room.label}
                      {room.mandatory && !isCaptured && <span style={{ opacity: 0.5 }}>*</span>}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Tip Message */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Info size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
              <p
                style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}
              >
                Tip: More captures usually result in better valuation
              </p>
            </div>

            {/* Capture Area */}
            <div
              onClick={() => {
                if (!selectedRoom) {
                  setShowWarning(true);
                  return;
                }
                startCamera();
              }}
              style={{
                border: `2px dashed ${!selectedRoom ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '24px',
                padding: isMobile ? '40px 20px' : '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: colors.white,
                  boxShadow: '0 0 30px rgba(255,255,255,0.1)',
                }}
              >
                <Camera size={40} />
              </motion.div>

              <div
                style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '8px' }}
              >
                {selectedRoom
                  ? `Capture ${roomCategories.find((r) => r.id === selectedRoom)?.label}`
                  : 'Select a Room First'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                {selectedRoom ? 'Tap to open camera' : 'Tap a room above to start capturing'}
              </div>
            </div>

            {/* Canvas for capturing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Business Rule Warning */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: '16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    color: colors.error[300],
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={20} />
                  {!selectedRoom
                    ? 'Please select a room above before capturing.'
                    : !allMandatoryCaptured
                      ? `Please capture all mandatory photos (${capturedMandatoryCount}/${mandatoryRooms.length} done).`
                      : 'At least 1 property photo is mandatory for valuation.'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Photo Preview Grid */}
            {photos.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>
                    CAPTURED ASSETS
                  </span>
                  <span
                    style={{
                      color: colors.success[400],
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={14} /> {photos.length} Photos
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {photos.map((photo, idx) => {
                    const roomLabel =
                      roomCategories.find((r) => r.id === photo.roomCategory)?.label ||
                      photo.roomCategory ||
                      'Unknown';
                    return (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: `1px solid rgba(255,255,255,0.1)`,
                        }}
                      >
                        <img
                          src={photo.uri}
                          alt="Property"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Room Label */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '6px 8px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 700,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          {roomLabel}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(photo.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 16,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <ChevronLeft size={20} />
                Back
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'white', color: colors.primary[700] }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  color: colors.primary[900],
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Review Request
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Location Verification Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: colors.primary[900],
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 32,
                padding: isMobile ? 24 : 40,
                maxWidth: 450,
                width: '100%',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: '#3b82f6',
                }}
              >
                <MapPin size={40} />
              </div>

              <h2
                style={{
                  color: 'white',
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 900,
                  marginBottom: 12,
                }}
              >
                Verify Your Location
              </h2>

              <p
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 15,
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                To proceed, we need to verify that you're at the property location. Please allow
                location access when prompted.
              </p>

              {locationError && (
                <div
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 12,
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    color: colors.error[300],
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={18} />
                  {locationError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <motion.button
                  onClick={handleVerifyLocation}
                  disabled={isVerifying}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    borderRadius: 16,
                    backgroundColor: isVerifying ? 'rgba(255,255,255,0.5)' : 'white',
                    border: 'none',
                    color: colors.primary[900],
                    fontWeight: 900,
                    fontSize: 16,
                    cursor: isVerifying ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {isVerifying ? (
                    <>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          border: `2px solid ${colors.primary[700]}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      Verifying Location...
                    </>
                  ) : (
                    <>
                      <Navigation size={20} />
                      Verify My Location
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleBack}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 14,
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Go Back
                </motion.button>
              </div>

              <p
                style={{
                  marginTop: 20,
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                You must be within 100m of the property to continue
              </p>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCameraModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={stopCamera}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                top: isMobile ? 20 : 40,
                right: isMobile ? 20 : 40,
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              ✕
            </motion.button>

            {/* Room Label */}
            <div
              style={{
                position: 'absolute',
                top: isMobile ? 20 : 40,
                left: isMobile ? 20 : 40,
                padding: '12px 20px',
                backgroundColor: colors.primary[600],
                borderRadius: 14,
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                zIndex: 10,
              }}
            >
              Capturing: {roomCategories.find((r) => r.id === selectedRoom)?.label}
            </div>

            {/* Camera Preview Container */}
            <div
              style={{
                width: '100%',
                maxWidth: 500,
                aspectRatio: '3/4',
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: 'black',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                }}
              />
            </div>

            {cameraError && (
              <div
                style={{
                  marginTop: 16,
                  padding: '14px 20px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 14,
                  color: colors.error[300],
                  fontWeight: 600,
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {cameraError}
              </div>
            )}

            {/* Capture Button */}
            <motion.button
              onClick={capturePhoto}
              disabled={isCapturing}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: 30,
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '6px solid rgba(255,255,255,0.3)',
                cursor: isCapturing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255,255,255,0.3)',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: `4px solid ${colors.primary[600]}`,
                }}
              />
            </motion.button>

            <p
              style={{
                marginTop: 16,
                color: 'rgba(255,255,255,0.5)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {isCapturing ? 'Capturing...' : 'Tap to capture photo'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
