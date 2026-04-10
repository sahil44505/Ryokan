'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Star, Trash2, Map as MapIcon, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { HotelMap } from "../hotels/HotelMap"

const Bookings = () => {
  const [hotels, sethotels] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/getuserbookings');
        sethotels(res.data);
      } finally { setloading(false); }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    setDeletingId(id);
    toast.info("Contacting provider...");

    setTimeout(async () => {
      try {
        await axios.delete(`/api/bookings/${id}`);
        sethotels(prev => prev.filter(h => h.id !== id));
        toast.success("Cancelled. Refund in 7 working days.");
      } catch (error) { toast.error("Error cancelling."); }
      finally { setDeletingId(''); }
    }, 2000);
  };

  if (loading) return <div className="text-center py-20 font-bold uppercase tracking-widest text-slate-400">Loading Trips...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {hotels.map((hotel) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkinDate = new Date(hotel.startDate);
        checkinDate.setHours(0, 0, 0, 0);
        console.log(hotel)

        const canCancel = checkinDate >= today;
        const isExpanded = expandedId === hotel.id;

        return (
          <div key={hotel.id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
              {/* thumbnail */}
              <img src={hotel.Image} className="w-full md:w-48 h-32 object-cover rounded-2xl" alt="" />

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{hotel.title}</h3>
                <div className="flex gap-4 mt-2 text-slate-500 text-xs font-bold uppercase tracking-tight">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(hotel.startDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-blue-600"><Star size={14} fill="currentColor" /> {hotel.ratings}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : hotel.id)}
                  className="px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <MapIcon size={14} />}
                  {isExpanded ? "Close Map" : "Location"}
                </button>

                {canCancel && (
                  <button
                    disabled={deletingId === hotel.id}
                    onClick={() => handleCancel(hotel.id)}
                    className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> {deletingId === hotel.id ? "Processing..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Map Section */}
            {isExpanded && (
              <div className="h-80 w-full border-t border-slate-50 animate-in slide-in-from-top-4 duration-500">
                {(() => {
                  // 1. Split the string by the comma
                  // Using optional chaining and fallback to avoid "split of undefined"
                  const coords = (hotel.gps_coordinates || "").split(',');

                  // 2. Convert the split strings into numbers
                  const lat = parseFloat(coords[0]);
                  const lng = parseFloat(coords[1]);

                  // 3. IMPORTANT: Return the component using the NEW variables
                  return (
                    <HotelMap
                      latitude={lat}
                      longitude={lng}
                      hotelName={hotel.title}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Bookings;