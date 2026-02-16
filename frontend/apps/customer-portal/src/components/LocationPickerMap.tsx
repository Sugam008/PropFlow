'use client';

import { colors } from '@propflow/theme';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

// Fix for default marker icons in Leaflet
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  userLat?: number;
  userLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  zoom?: number;
}

const LocationPickerMap = ({
  lat,
  lng,
  userLat,
  userLng,
  onLocationSelect,
  zoom = 15,
}: LocationPickerMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    if (mapRef.current) {
      if (lat && lng) {
        // Smoothly zoom and pan to the new location
        mapRef.current.setView([lat, lng], zoom, { animate: true });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
      }
      return;
    }

    try {
      const map = L.map(containerRef.current, {
        center: [lat || 19.076, lng || 72.8777],
        zoom: zoom,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Property Marker (Draggable)
      const marker = L.marker([lat || 19.076, lng || 72.8777], {
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onLocationSelect(position.lat, position.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
    } catch (e) {
      console.error('Leaflet initialization failed:', e);
    }
  }, [isClient]);

  // Handle user location updates
  useEffect(() => {
    if (mapRef.current && userLat && userLng) {
      if (!userMarkerRef.current) {
        const userDot = L.circleMarker([userLat, userLng], {
          radius: 8,
          fillColor: '#3b82f6',
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(mapRef.current);

        // Add a pulsing effect via CSS class
        userDot.getElement()?.classList.add('user-location-pulse');
        userMarkerRef.current = userDot;
      } else {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      }
    }
  }, [userLat, userLng]);

  // Handle prop updates
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [lat, lng]);

  if (!isClient) {
    return (
      <div
        style={{
          height: '100%',
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
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <style>
        {`
          .leaflet-container {
            height: 100% !important;
            width: 100% !important;
            background: #111827 !important;
          }
          .user-location-pulse {
            animation: pulse-blue 2s infinite;
          }
          @keyframes pulse-blue {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
        `}
      </style>
      <div
        ref={containerRef}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
    </div>
  );
};

export default LocationPickerMap;
