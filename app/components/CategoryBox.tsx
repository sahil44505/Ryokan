"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "../types/categories";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CategoryBox = ({ label, icon: Icon, selected, kindKey, setNearby }: Category) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getCoords = () =>
    new Promise<GeolocationCoordinates>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(err),
        // reduced timeout to 5s for better UX, increased age to use cached GPS
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 600000 }
      );
    });

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    let lat = null;
    let lng = null;

    try {
      const coords = await getCoords();
      lat = coords.latitude;
      lng = coords.longitude;
    } catch (error) {
      console.warn("GPS failed, using IP fallback in backend.");
    }

    try {
      // 1. Fetch data for immediate UI updates if setNearby exists
      const res = await axios.post('/api/getnearby', {
        lat,
        lng,
        categoryKey: kindKey
      });

      if (setNearby) setNearby(res.data);

      // 2. CONSTRUCT URL CORRECTLY
      // Format: /discover?category=Beach&kindKey=natural.beach&lat=...&lng=...
      const baseUrl = "/discover";
      const params = new URLSearchParams();
      
       params.set("category", label);
      if (kindKey) params.set("kindKey", kindKey);
      if (lat) params.set("lat", lat.toString());
      if (lng) params.set("lng", lng.toString());

      router.push(`${baseUrl}?${params.toString()}`);

    } catch (apiError) {
      console.error("API Error:", apiError);
      alert("Failed to find nearby places. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [label, kindKey, setNearby, router, loading]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col justify-center items-center gap-2 p-3 border-b-2 
        hover:text-neutral-800 transition cursor-pointer min-w-[90px]
        active:scale-95 select-none
        ${selected ? "border-b-neutral-800 text-neutral-800" : "border-transparent text-neutral-500"}
        ${loading ? "opacity-50 cursor-wait" : "opacity-100"}
      `}
    >
      {loading ? (
        <Loader2 className="animate-spin text-blue-600" size={26} />
      ) : (
        <Icon size={26} />
      )}
      <div className="text-sm font-medium whitespace-nowrap">{label}</div>
    </div>
  );
};

export default CategoryBox;