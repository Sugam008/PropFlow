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
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationPickerMap = ({ lat, lng, onLocationSelect }: LocationPickerMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    if (mapRef.current) {
      // Just update view if map exists
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      return;
    }

    try {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 13,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Draggable Marker
      const marker = L.marker([lat, lng], {
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

    return () => {
      // Don't destroy map on every render, let it persist until unmount
      // But React Strict Mode might mount/unmount.
      // For now, let's just keep it simple.
    };
  }, [isClient]);

  // Handle prop updates
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentCenter = mapRef.current.getCenter();
      // Only update if significantly different to avoid loops if we update on drag
      if (
        Math.abs(currentCenter.lat - lat) > 0.0001 ||
        Math.abs(currentCenter.lng - lng) > 0.0001
      ) {
        // mapRef.current.setView([lat, lng]);
        // Don't auto-center on every prop change if user is dragging,
        // but here we only receive props from parent.
        // Let's just update marker
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
            background: #f8fafc !important;
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
          border: `1px solid ${colors.gray[100]}`,
        }}
      />
    </div>
  );
};

export default LocationPickerMap;
