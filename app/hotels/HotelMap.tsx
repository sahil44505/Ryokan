'use client';
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

interface MapProps {
  longitude: number;
  latitude: number;
  hotelName?: string;
}

export const HotelMap = ({ longitude, latitude, hotelName }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
  const lng = Number(longitude);
  const lat = Number(latitude);

  useEffect(() => {
    if (!mapContainer.current || isNaN(lng) || isNaN(lat)) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json?apiKey=${GEOAPIFY_KEY}`,
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    // --- GOOGLE STYLE MARKER ---
    const el = document.createElement('div');
    el.className = 'google-style-marker';
    // Using a high-fidelity SVG that replicates the classic G-Maps teardrop
    el.innerHTML = `
      <div style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25)); cursor: pointer;">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C13.2 0 8 5.2 8 12C8 21 20 36 20 36C20 36 32 21 32 12C32 5.2 26.8 0 20 0Z" fill="#EA4335"/>
          <path d="M20 16C22.2091 16 24 14.2091 24 12C24 9.79086 22.2091 8 20 8C17.7909 8 16 9.79086 16 12C16 14.2091 17.7909 16 20 16Z" fill="#760E06"/>
          <circle cx="20" cy="12" r="4" fill="white"/>
        </svg>
      </div>
    `;

    new maplibregl.Marker({ 
        element: el,
        anchor: 'bottom' // Ensures the tip of the pin points exactly at the coordinates
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lng, lat]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
      
      <div className="absolute bottom-4 left-4 flex gap-2">
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2 border border-slate-100"
        >
          <MapPin size={12} className="text-[#EA4335]" /> Directions
        </a>
      </div>
    </div>
  );
};