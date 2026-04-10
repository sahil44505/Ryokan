"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapSync({ center, locations }: { center: [number, number], locations: any[] }) {
  const map = useMap();

  useEffect(() => {
    // This fixes the "gray map" issue when the map container size changes
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    if (locations?.length > 0) {
      const bounds = L.latLngBounds(locations.map(p => [p.lat, p.lng]));
      map.flyToBounds(bounds, { padding: [40, 40] });
    } else {
      map.flyTo(center, 13);
    }
  }, [locations, center, map]);

  return null;
}

const Map = ({ center, locations }: { center: [number, number], locations: any[] }) => {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || "YOUR_GEOAPIFY_KEY";
  const url = `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${apiKey}`;

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={13} 
        className="h-full w-full" // CRITICAL: Must be full height
        scrollWheelZoom={true}
      >
        <TileLayer url={url} attribution='&copy; Geoapify' />
        <MapSync center={center} locations={locations} />
        
        <Marker position={center} icon={customIcon}><Popup>You</Popup></Marker>

        {locations.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={customIcon}>
            <Popup><strong>{p.name}</strong></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;