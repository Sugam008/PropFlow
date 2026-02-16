'use client';

import { colors } from '@propflow/theme';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

interface MapViewProps {
  lat: number;
  lng: number;
  address?: string;
  comps?: Array<{
    id: string;
    address: string;
    lat: number;
    lng: number;
    price: number;
  }>;
}

const MapView = ({ lat, lng, address, comps }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // @ts-ignore
    if (containerRef.current._leaflet_id) {
      // @ts-ignore
      containerRef.current._leaflet_id = null;
    }
    containerRef.current.innerHTML = '';

    try {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom Target Marker
      const targetIcon = L.divIcon({
        className: 'target-marker',
        html: `<div style="width: 24px; height: 24px; background-color: ${colors.primary[500]}; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const targetPopup = L.popup({
        maxWidth: 240,
        className: 'custom-premium-popup',
      }).setContent(`
        <div style="overflow: hidden; border-radius: 12px;">
          <div style="padding: 12px 16px; background: ${colors.primary[500]}; color: white; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
            📍 Primary Asset
          </div>
          <div style="padding: 16px; background: white;">
            <div style="font-size: 14px; font-weight: 700; color: ${colors.gray[900]}; line-height: 1.4; margin-bottom: 8px;">${address || 'Target Location'}</div>
            <div style="font-size: 11px; color: ${colors.gray[500]}; font-weight: 600;">Subject of Valuation</div>
          </div>
        </div>
      `);

      L.marker([lat, lng], { icon: targetIcon }).addTo(map).bindPopup(targetPopup);

      comps?.forEach((comp) => {
        const compIcon = L.divIcon({
          className: 'comp-marker',
          html: `<div style="background-color: ${colors.success[500]}; color: white; padding: 4px 10px; border-radius: 10px; font-size: 12px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.15); white-space: nowrap;">₹${(comp.price / 100000).toFixed(1)}L</div>`,
          iconSize: [60, 30],
          iconAnchor: [30, 15],
        });

        const compPopup = L.popup({
          maxWidth: 240,
          className: 'custom-premium-popup',
        }).setContent(`
          <div style="overflow: hidden; border-radius: 12px;">
            <div style="padding: 12px 16px; background: ${colors.success[600]}; color: white; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
              📊 Market Comp
            </div>
            <div style="padding: 16px; background: white;">
              <div style="font-size: 14px; font-weight: 700; color: ${colors.gray[900]}; line-height: 1.4; margin-bottom: 8px;">${comp.address}</div>
              <div style="font-size: 16px; font-weight: 800; color: ${colors.success[600]}; display: flex; align-items: center; gap: 4px;">
                ₹${(comp.price / 10000000).toFixed(2)} Cr
              </div>
              <div style="font-size: 11px; color: ${colors.gray[500]}; margin-top: 4px;">Verified Sale Transaction</div>
            </div>
          </div>
        `);

        L.marker([comp.lat, comp.lng], { icon: compIcon }).addTo(map).bindPopup(compPopup);
      });

      mapRef.current = map;
    } catch (e) {
      console.error('Leaflet initialization failed:', e);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, lat, lng, address, comps]);

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
        <div style={{ color: colors.gray[400], fontSize: 14, fontWeight: 600 }}>
          Initializing Map Layout...
        </div>
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
          .custom-premium-popup .leaflet-popup-content-wrapper {
            padding: 0;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            border: 1px solid rgba(255, 255, 255, 0.8);
          }
          .custom-premium-popup .leaflet-popup-content {
            margin: 0 !important;
            width: 240px !important;
          }
          .custom-premium-popup .leaflet-popup-tip {
            background: rgba(255, 255, 255, 0.95);
          }
          .leaflet-popup-close-button {
            color: white !important;
            font-size: 16px !important;
            padding: 8px !important;
          }
        `}
      </style>
      <div
        ref={containerRef}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          border: `1px solid ${colors.gray[100]}`,
        }}
      />
    </div>
  );
};

export default MapView;
