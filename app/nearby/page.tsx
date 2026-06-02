'use client';

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import dynamicImport from "next/dynamic";
import { AiOutlineCompass, AiOutlineLoading3Quarters, AiOutlineEnvironment, AiOutlineSearch } from "react-icons/ai";

const HotelMap = dynamicImport(() => import("../components/Map"), { ssr: false });

interface LocationItem {
  id: string;
  name: string;
  category: string;
  address: string;
  link: string;
  lat: number;
  lng: number;
}

export default function NearbySearchPage() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core Search Function: Passes coordinates + query keyword down to our local route
  const executeSearch = useCallback(async (lat: number, lng: number, keywordFilter: string = "") => {
    setLoadingSearch(true);
    setError(null);

    try {
      const response = await axios.post("/api/searchNearby", {
        lat,
        lng,
        keyword: keywordFilter
      });
      
      if (response.data) {
        setLocations(response.data.locations || []);
      }
    } catch (err: any) {
      console.error("Discovery execution failed:", err);
      setError("Failed to locate points matching that criteria.");
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  // Lifecycle: Ask permission and extract live GPS coordinates on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setLoadingLocation(false);
        
        // Initial auto-search for general points around the user
        executeSearch(latitude, longitude, "");
      },
      (geoError) => {
        console.error("Geolocation failed:", geoError);
        // Fallback safely to a default location (e.g., Mumbai) if permission denied
        const fallbackLat = 19.0760;
        const fallbackLng = 72.8777;
        setMapCenter([fallbackLat, fallbackLng]);
        setError("Location access denied. Displaying fallback location (Mumbai).");
        setLoadingLocation(false);
        executeSearch(fallbackLat, fallbackLng, "");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [executeSearch]);

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapCenter) return;
    executeSearch(mapCenter[0], mapCenter[1], searchKeyword);
  };

  if (loadingLocation) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <AiOutlineLoading3Quarters className="animate-spin text-neutral-500" size={32} />
        <span className="text-xs font-medium text-neutral-400">Requesting device satellite metrics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-neutral-800">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AiOutlineCompass className="text-neutral-800" /> Live Explore Hub
          </h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            Discovering attractions, beaches, or food directly around your current location.
          </p>
        </div>

        {/* Dynamic Global Input Search Box */}
        <form onSubmit={handleCustomSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search 'beaches', 'hotels', 'starbucks'..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full text-xs bg-neutral-50 border border-neutral-200 pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition"
          />
          <button type="submit" className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-900 transition">
            <AiOutlineSearch size={16} />
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 text-xs bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Split Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Cards list items */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          {loadingSearch ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-3 bg-neutral-50 rounded-2xl border border-neutral-200/60">
              <AiOutlineLoading3Quarters className="animate-spin text-neutral-600" size={28} />
              <span className="text-xs font-medium text-neutral-400">Scanning local coordinates...</span>
            </div>
          ) : locations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map((loc) => (
                <div key={loc.id} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition duration-150">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm tracking-tight text-neutral-900 line-clamp-1">{loc.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-400 px-2 py-0.5 rounded-md shrink-0">
                        {loc.category}
                      </span>
                    </div>
                    {loc.address && (
                      <p className="text-xs text-neutral-400 mt-2 flex items-start gap-1 line-clamp-2">
                        <AiOutlineEnvironment className="shrink-0 mt-0.5" /> {loc.address}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 text-right">
                    <a
                      href={loc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-neutral-900 text-white text-xs px-4 py-2 rounded-xl font-medium hover:bg-neutral-800 transition"
                    >
                      Navigate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-neutral-50 rounded-2xl border border-neutral-200/60 text-neutral-400 text-xs text-center p-4">
              No matching locations found for "{searchKeyword}" within a 10km radius.
            </div>
          )}
        </div>

        {/* Right Side: Sticky Map Container */}
        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-6 h-[400px] lg:h-[calc(100vh-200px)] min-h-[350px] w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
          {mapCenter && !loadingSearch && (
            <HotelMap center={mapCenter} locations={locations} />
          )}
        </div>

      </div>
    </div>
  );
}