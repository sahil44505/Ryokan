'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Loader2, MapPin, Navigation } from "lucide-react";

// Dynamically import the Map to prevent SSR issues with Leaflet/Map libraries
const Map = dynamic(() => import('@/app/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-neutral-100 flex items-center justify-center italic">
      Loading Map...
    </div>
  )
});

/**
 * 1. THE CONTENT COMPONENT
 * This component handles all the logic but is "unsafe" for static pre-rendering
 * because it uses useSearchParams().
 */
function DiscoverContent() {
  const searchParams = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const lat = parseFloat(searchParams.get('lat') || "");
  const lng = parseFloat(searchParams.get('lng') || "");
  const kindKey = searchParams.get('kindKey');
  const categoryLabel = searchParams.get('category');

  useEffect(() => {
    const fetchPlaces = async () => {
      // Prevent fetching if coordinates are missing
      if (!kindKey || isNaN(lat) || isNaN(lng)) return;
      
      try {
        setLoading(true);
        const res = await axios.post('/api/getnearby', { 
          lat, 
          lng, 
          categoryKey: kindKey 
        });
        setLocations(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaces();
  }, [kindKey, lat, lng]);

  // Handle case where coordinates are not yet available in URL
  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-neutral-500 font-medium">Locating position...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white">
      {/* Top Navbar Header */}
      <div className="pt-20 pb-4 px-6 border-b flex justify-between items-center bg-white z-20">
        <div>
          <h1 className="text-xl font-bold text-neutral-800">
            {categoryLabel || 'Places'} near you
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Found {locations.length} results
          </p>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDE: List of Places */}
        <div className="w-full md:w-[350px] lg:w-[400px] h-full overflow-y-auto border-r bg-white z-10 custom-scrollbar">
          {loading ? (
            <div className="p-10 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-500" />
              <p className="text-sm text-neutral-400">Searching nearby...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="p-10 text-center text-neutral-400">
              No results found in this area.
            </div>
          ) : (
            locations.map((place: any) => (
              <div 
                key={place.id} 
                className="p-5 border-b hover:bg-neutral-50 cursor-pointer transition group"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="font-bold text-neutral-800 group-hover:text-blue-600 transition">
                      {place.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {place.address}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {(place.distance / 1000).toFixed(1)} km
                      </span>
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank')}
                        className="text-xs flex items-center gap-1 text-neutral-600 hover:text-black font-medium"
                      >
                        <Navigation size={12} /> Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE: Full Map */}
        <div className="hidden md:block flex-1 h-full relative">
          <Map center={[lat, lng]} locations={locations} />
        </div>
      </div>
    </div>
  );
}

/**
 * 2. THE MAIN EXPORT
 * This wraps the content in Suspense to fix the Next.js build error.
 */
export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p className="text-neutral-400 animate-pulse">Loading Discovery Tools...</p>
        </div>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}