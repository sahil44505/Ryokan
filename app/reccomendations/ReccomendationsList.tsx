'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Star, MapPin } from 'lucide-react';
import { HotelMap } from '../hotels/HotelMap'; // Import your existing Map component

const ReccomendationsList = ({ titles }: { titles: string[] }) => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to convert "$62" to "₹5,177"
  const formatToINR = (usdString: string) => {
    const numeric = parseFloat(usdString.replace(/[^0-9.]/g, ''));
    if (isNaN(numeric)) return usdString;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numeric * 83.5);
  };

  useEffect(() => {
  const fetchTopHotels = async () => {
    setLoading(true);
    const results: any[] = [];

    for (const title of titles) {
      try {
        // 1. Fetch Hotel Basic Info (POST)
        const response = await axios.post('/api/searchHotelsforpy', { title });
        const hotelData = response.data;

        if (hotelData) {
          // 2. Fetch Image using POST to match your API route
          // We wrap the name in an object to match your 'await request.json()' call
          const imgRes = await axios.post('/api/getDestinationImages', { 
            destination: { name: hotelData.name } 
          });
          
          // 3. Extract the URL using the key returned by your API: 'xoteloImage'
          hotelData.thumbnail = imgRes.data?.xoteloImage || "/default_hotel.jpg";
          
          results.push(hotelData);
        }
      } catch (err) {
        console.error(`Error fetching for ${title}:`, err);
      }
    }
    setHotels(results);
    setLoading(false);
  };

  if (titles.length > 0) fetchTopHotels();
}, [titles]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Curating Recommendations...</p>
    </div>
  );

  return (
    <section className="py-12">
      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
        Suggested for You <span className="h-px flex-1 bg-slate-100" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel, index) => (
          <div key={index} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            
            {/* IMAGE SECTION */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={hotel.thumbnail}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                <p className="text-sm font-black text-slate-900">{formatToINR(hotel.price)}</p>
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-slate-400">Recommended Stay</span>
                  </div>
                </div>
                <a 
                  href={hotel.link} 
                  target="_blank" 
                  className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              </div>

              {/* MINI MAP SECTION */}
              <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-4 border border-slate-50">
                {hotel.gps ? (
                  <HotelMap 
                    latitude={hotel.gps.latitude} 
                    longitude={hotel.gps.longitude} 
                    hotelName={hotel.name}
                  />
                ) : (
                  <div className="bg-slate-50 w-full h-full flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold">
                    Map Unavailable
                  </div>
                )}
                {/* Overlay to prevent accidental scrolling inside the list map */}
                <div className="absolute inset-0 z-10 bg-transparent" />
              </div>

              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReccomendationsList;