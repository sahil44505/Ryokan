'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { Star, MapPin, Tag, Info, Calendar, Users, Search, ChevronDown, Minus, Plus, X } from "lucide-react";
import { DestinationCard } from "./DestinationCard";
import {SkeletonLoader} from "./SkeletonLoader";


const HotelCard = ({ hotel, parsePrice, imageIndexGlobal ,entityId, searchParams}: { hotel: any, parsePrice: any, imageIndexGlobal: number ,entityId:string, searchParams: any}) => {
  const [localIndex, setLocalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prices = parsePrice(hotel.price);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setLocalIndex((prev) => (prev + 1) % (hotel.images?.length || 3));
      }, 1200);
    } else {
      setLocalIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, hotel.images?.length]);

  // Construct the URL with all search parameters
  const detailUrl = `/hotels/${hotel.hotelId}?entityId=${entityId}&checkin=${searchParams.checkIn}&checkout=${searchParams.checkOut}&adults=${searchParams.guests.adults}&rooms=${searchParams.guests.rooms}&children=${searchParams.guests.children}`;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col group transition-all"
    >
      <div className="aspect-square md:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-100 relative mb-3 shadow-sm border border-slate-100">
        <img 
          src={hotel.images?.[localIndex] || hotel.heroImage} 
          className="w-full h-full object-cover transition-opacity duration-300" 
          alt={hotel.name} 
        />
        {hotel.discount && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-emerald-600 text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-lg z-20">
            {hotel.discount}
          </div>
        )}
        <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${localIndex === i ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start gap-1 mb-1">
          <h3 className="text-[12px] md:text-[16px] font-bold text-slate-900 leading-tight line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded-lg shrink-0">
            <Star size={9} className="fill-blue-600 text-blue-600" />
            <span className="text-[10px] md:text-[12px] font-black text-blue-700">{hotel.rating?.value || "8.5"}</span>
          </div>
        </div>
        <p className="text-[10px] md:text-[12px] text-slate-500 font-medium mb-2 flex items-center">
          <MapPin size={10} className="mr-1 opacity-70" /> {hotel.relevantPoiDistance || "Center"}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.rateFeatures?.map((feature: any, idx: number) => (
            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[8px] md:text-[9px] font-bold uppercase border border-slate-100">
              <Info size={8} className="mr-1 text-blue-400" />
              {feature.text}
            </span>
          )).slice(0, 2)}
        </div>
        <div className="mt-auto pt-2 flex flex-col md:flex-row md:items-end justify-between border-t border-slate-100 gap-2">
          <div>
            <p className="text-[14px] md:text-xl font-black text-slate-900 leading-none mb-0.5">₹{prices.inr.toLocaleString('en-IN')}</p>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight">Approx {hotel.price}</p>
          </div>
          <Link href={detailUrl} className="text-center py-2 px-3 md:px-5 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest shadow-sm">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

const HotelListing = ({ title: initialTitle }: { title: string }) => {
  const [currentEntityId, setCurrentEntityId] = useState<string>("");
  const [destinations, setDestinations] = useState<any[]>([]);
  const [allHotels, setAllHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'price' | 'guests' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [currentSearchTitle, setCurrentSearchTitle] = useState(initialTitle);
  
  const [priceMaxInr, setPriceMaxInr] = useState(150000);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate default dates
  const today = new Date();
  const twoDaysLater = new Date();
  twoDaysLater.setDate(today.getDate() + 2); 
  
   const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const defaultCheckIn = formatDate(today);
  const defaultCheckOut = formatDate(twoDaysLater);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  const EXCHANGE_RATE = 83.5;
  const hotelsPerPage = 6;

  const performSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setCurrentSearchTitle(searchQuery);
    setCurrentPage(1);
    try {
      const res = await axios.post("/api/searchHotels", { title: searchQuery });
      setDestinations(res.data.availableLocations || []);
      setAllHotels((res.data.hotels?.hotels || []).slice(0, 15));
      setCurrentEntityId(res.data.EntityId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    performSearch(initialTitle);
  }, [initialTitle, performSearch]);

  useEffect(() => {
    const closeMenus = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const parsePrice = useCallback((priceStr: string) => {
    const usd = parseInt(priceStr?.replace(/[^0-9]/g, '') || "0");
    return { usd, inr: Math.round(usd * EXCHANGE_RATE) };
  }, []);

  const filteredHotels = useMemo(() => {
    return allHotels.filter(hotel => {
      const prices = parsePrice(hotel.price);
      const matchesPrice = prices.inr <= priceMaxInr;
      const matchesStars = starFilter ? Math.floor(hotel.stars) === starFilter : true;
      return matchesPrice && matchesStars;
    });
  }, [allHotels, priceMaxInr, starFilter, parsePrice]);
   

  

  const paginatedHotels = filteredHotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="bg-white min-h-screen text-slate-800 antialiased" ref={menuRef}>
      
      {/* 1. MODERN HEADING */}
      <div className="max-w-7xl mx-auto px-3 md:px-8 pt-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Explore <span className="text-blue-600">{currentSearchTitle}</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Discover popular areas and verified stays</p>
      </div>

      <section className="px-3 md:px-8 py-6 flex gap-3 overflow-x-auto no-scrollbar">
        {destinations.map((loc, idx) => (
          <DestinationCard 
            key={loc.entityId || idx} 
            loc={loc} 
            onSelect={() => performSearch(loc.entityName || loc.name)}
          />
        ))}
      </section>

      {/* 2. HR SEPARATOR */}
      <div className="max-w-7xl mx-auto px-3 md:px-8">
        <hr className="border-slate-100" />
      </div>

     {/* 3. HOTELS LABEL & FILTERS BLOCK */}
      <div className="max-w-7xl mx-auto px-3 md:px-8 py-10">
        <div className="flex flex-col gap-6">
          {/* Centered Heading */}
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 text-center tracking-tight mb-2">
            Available Hotels
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* BLOCK 1: SEARCH INPUTS (Left Side) */}
            <div className="flex flex-col md:flex-row bg-white border-2 border-slate-100 p-1.5 rounded-2xl md:rounded-full shadow-sm flex-1 max-w-3xl">
              
              {/* Location Display */}
              <div className="flex items-center gap-3 px-5 py-3 border-b md:border-b-0 md:border-r border-slate-100">
                <Search size={18} className="text-blue-600 shrink-0" />
                <span className="text-sm font-black text-slate-900 truncate">{currentSearchTitle}</span>
              </div>

              {/* High-Visibility Date Pickers */}
              <div className="flex items-center gap-3 px-5 py-3 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 md:bg-transparent">
                <Calendar size={16} className="text-slate-500 shrink-0" />
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={checkIn} 
                    onChange={(e) => setCheckIn(e.target.value)} 
                    className="bg-transparent text-xs font-black outline-none w-28 cursor-pointer text-blue-700" 
                  />
                  <span className="text-slate-300 font-bold">to</span>
                  <input 
                    type="date" 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)} 
                    className="bg-transparent text-xs font-black outline-none w-28 cursor-pointer text-blue-700" 
                  />
                </div>
              </div>

              {/* Guest Selector */}
              <button 
                onClick={() => setActiveMenu(activeMenu === 'guests' ? null : 'guests')} 
                className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 rounded-xl md:rounded-full transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  <span className="text-xs font-black text-slate-900">
                    {guests.adults + guests.children} Guests
                  </span>
                </div>
                <ChevronDown size={14} className="ml-2 text-slate-400" />
              </button>
            </div>

            {/* BLOCK 2: FILTERS (Right Side) */}
           <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl md:rounded-full border border-slate-200">
              
              {/* Budget Filter - Added relative here to anchor the popup */}
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === 'price' ? null : 'price')}
                  className={`px-5 py-3 rounded-full text-[11px] font-black uppercase tracking-tight transition-all border-2 ${
                    activeMenu === 'price' 
                    ? 'border-blue-600 bg-white text-blue-600 shadow-sm' 
                    : 'border-transparent bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Max: ₹{(priceMaxInr / 1000).toFixed(0)}k
                </button>

                {/* PRICE POPUP - Now anchored directly below the button */}
                {activeMenu === 'price' && (
                  <div className="absolute top-full left-0 mt-3 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xl w-64 z-[70]">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Adjust Budget</p>
                    <input 
                      type="range" 
                      min="5000" 
                      max="250000" 
                      step="5000" 
                      value={priceMaxInr} 
                      onChange={(e) => setPriceMaxInr(Number(e.target.value))} 
                      className="w-full accent-blue-600 mb-4" 
                    />
                    <div className="text-center font-black text-base text-slate-900 mb-4">₹{priceMaxInr.toLocaleString()}</div>
                    <button 
                      onClick={() => setActiveMenu(null)} 
                      className="w-full py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest"
                    >
                      Apply Filter
                    </button>
                  </div>
                )}
              </div>
              
              {/* Star Filters */}
              <div className="flex gap-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                {[5, 4, 3].map(s => (
                  <button 
                    key={s} 
                    onClick={() => {setStarFilter(starFilter === s ? null : s); setCurrentPage(1);}} 
                    className={`w-10 h-10 rounded-full text-[11px] font-black transition-all ${
                      starFilter === s 
                      ? 'bg-slate-900 text-white scale-105 shadow-md' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {s}★
                  </button>
                ))}
              </div>
              
              {/* Reset Button */}
              {(starFilter || priceMaxInr < 250000) && (
                <button 
                  onClick={() => {setPriceMaxInr(250000); setStarFilter(null);}} 
                  className="w-10 h-10 flex items-center justify-center text-red-500 bg-white rounded-full border border-red-100 hover:bg-red-50 transition-colors shadow-sm"
                >
                  <X size={16}/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 md:px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
          {paginatedHotels.map((hotel) => (
            <HotelCard 
              key={hotel.hotelId} 
              hotel={hotel} 
              entityId={currentEntityId}
              parsePrice={parsePrice} 
              imageIndexGlobal={0} 
              searchParams={{ checkIn, checkOut, guests }}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => { setCurrentPage(i + 1); window.scrollTo({top:0, behavior:'smooth'}); }}
                className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 border border-slate-100"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* GUESTS MODAL */}
      {activeMenu === 'guests' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-8 rounded-[32px] shadow-2xl border border-slate-100">
            <div className="space-y-6">
              {['Rooms', 'Adults', 'Children'].map((label) => {
                const key = label.toLowerCase() as keyof typeof guests;
                return (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{label}</span>
                    <div className="flex items-center gap-5">
                      <button onClick={() => setGuests({...guests, [key]: Math.max(key==='children'?0:1, guests[key]-1)})} className="p-2 border border-slate-200 rounded-xl"><Minus size={14}/></button>
                      <span className="text-sm font-black w-4 text-center">{guests[key]}</span>
                      <button onClick={() => setGuests({...guests, [key]: guests[key]+1})} className="p-2 border border-slate-200 rounded-xl"><Plus size={14}/></button>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => setActiveMenu(null)} className="w-full py-4 bg-slate-900 text-white text-[11px] font-black rounded-2xl uppercase tracking-widest">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelListing;