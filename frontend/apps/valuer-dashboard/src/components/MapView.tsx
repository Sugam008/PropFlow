'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { colors } from '@propflow/theme';

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

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const MapView = ({ lat, lng, address, comps }: MapViewProps) => {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const center: [number, number] = [lat, lng];

  return (
    <div 
      role="region" 
      aria-label={`Interactive map showing property location at ${address || 'target location'} and ${comps?.length || 0} comparable properties nearby.`}
      style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}
    >
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        
        <Marker position={center}>
          <Popup>
            <strong>Target Property</strong><br />
            {address || 'Target Location'}
          </Popup>
        </Marker>

        {comps?.map(comp => (
          <Marker 
            key={comp.id} 
            position={[comp.lat, comp.lng]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: ${colors.success}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 2px solid white; white-space: nowrap;">₹${(comp.price / 100000).toFixed(1)}L</div>`,
              iconSize: [40, 20],
              iconAnchor: [20, 10]
            })}
          >
            <Popup>
              <strong>Comparable</strong><br />
              {comp.address}<br />
              ₹{comp.price.toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
