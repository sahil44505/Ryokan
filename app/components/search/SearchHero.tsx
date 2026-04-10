"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SearchHero = ({ isNavbarMode = false, setNearby }: { isNavbarMode?: boolean, setNearby: (data: any[]) => void; }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // Get Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          setError("Failed to get location.");
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    router.push(`/hotels?query=${query}`);
  };

  async function handleNearby() {
    if (location) {
      const res: any = await axios.post('/api/getnearby', { location });
      const data = res.data;
      setNearby(data);
    }
    setIsOpen(false);
  }

  // --- SCROLL LOGIC REMOVED COMPLETELY ---

  return (
    <div
      ref={dropdownRef}
      className={`${
        isNavbarMode
          ? "w-[342px] bg-white absolute top-[55%] left-[36%] transform -translate-x-1/2 -translate-y-1/2"
          : "w-[90vw] md:w-[60vw] font-normal absolute top-[278px] left-[50%] transform -translate-x-1/2"
      } z-50`}
    >
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full flex items-center bg-white rounded-full px-3 py-2 border border-gray-400 focus-within:ring-0 text-black shadow-md"
      >
        <Search className="w-5 h-5 text-black ml-1" />
        <input
          type="text"
          placeholder="Search for hotels and places..."
          className={`w-full ml-2 text-base outline-none bg-transparent ${
            isNavbarMode ? "text-sm p-1" : "font-medium"
          }`}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-1.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Search"}
        </button>
      </div>

      {/* Show dropdown only in hero mode */}
      {isOpen && !isNavbarMode && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl mt-2 p-2 font-medium z-50 border border-gray-100">
          <button
            className="flex items-center w-full text-black py-3 hover:bg-gray-100 px-3 rounded-xl transition-colors"
            onClick={handleNearby}
          >
            <MapPin className="w-5 h-5 mr-3 text-black" />
            <span className="font-semibold">Nearby Hotels</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchHero;