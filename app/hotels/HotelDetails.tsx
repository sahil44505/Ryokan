'use client';
import React, { useState, useMemo } from 'react';
import {
  Star, MapPin, Clock, ShieldCheck, CheckCircle2,
  Info, Bed, Users, Camera, Car, Wifi, Dumbbell,
  Dog, Languages, CreditCard, ChevronRight, Map,
  Share2, Heart, ExternalLink, Globe, Copy, Quote
} from 'lucide-react';
import { RateEditor } from './RateEditor';
import { HotelMap } from './HotelMap';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import { toast } from 'sonner';
const HotelDetails = ({ data, searchDetails }: { data: any, searchDetails?: any }) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [showRateEditor, setShowRateEditor] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const handleProceedToBook = async () => {
    if (!selectedBooking) return;

    setIsPaying(true);
    try {
      // 1. Initialize SDK
      const cashfree = await load({ mode: "sandbox" }); // or "production"

      // 2. Create Order in Backend
      const res = await axios.post('/api/createOrder', {
        bookingDetails: selectedBooking
      });

     const sessionId = res.data.payment_session_id;

      // 3. Open Checkout Modal
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        toast.error(result.error.message || 'Payment cancelled');
      } else if (result.paymentDetails) {
        await handleConfirmBooking()
        toast.success('Booking Successful!');
        // Optional: Redirect to a success page or refresh
      }
    } catch (error: any) {
      console.error("Booking failed", error);
      toast.error(error.response?.data?.error || "Failed to initiate booking");
    } finally {
      setIsPaying(false);
    }
  };
 const handleConfirmBooking = async () => {
  // Guard clause: ensure a room is selected before trying to save to DB
  if (!selectedBooking) {
    toast.error("Please select a room first");
    return;
  }

  try {
    const bookingData = {
      title: general?.name, // From the 'data' prop
      // We strip non-numeric characters (like ₹ or commas) from the price string
      totalPrice: parseFloat(selectedBooking.price.replace(/[^0-9.]/g, '')), 
      rating: parseFloat(reviewRatingSummary?.score) || 0,
      img: allImages[0]?.dynamic || "", // Takes the first image from the gallery
      gps_coordinates: location?.coordinates 
        ? `${location.coordinates.latitude},${location.coordinates.longitude}` 
        : "0,0",
      startDate: new Date(searchDetails?.checkin).toISOString(), 
      endDate: new Date(searchDetails?.checkout).toISOString(),
    };

    const response = await axios.post('/api/bookings', bookingData);

    if (response.status === 201) {
      toast.success("Booking saved to your account!");
      // router.push('/bookings'); // Uncomment this if you have the router imported
    }
  } catch (error: any) {
    console.error("Database save failed", error);
    toast.error("Failed to save booking details.");
  }
};

  const {
    general, goodToKnow, location, gallery,
    amenities, reviewRatingSummary, distance, reviews
  } = data;
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for the sticky header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  const totalNights = useMemo(() => {
    if (!searchDetails?.checkin || !searchDetails?.checkout) return 1;
    const start = new Date(searchDetails.checkin);
    const end = new Date(searchDetails.checkout);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [searchDetails]);

  const allImages = useMemo(() => gallery?.images || [], [gallery]);
  const galleryCats = useMemo(() => gallery?.categories || [], [gallery]);

  const filteredImages = useMemo(() => {
    if (galleryFilter === 'All') return allImages;
    const filterKey = galleryFilter === 'Traveler photos' ? 'Traveller' : galleryFilter;
    return allImages.filter((img: any) => img.category === filterKey || img.category === galleryFilter);
  }, [galleryFilter, allImages]);

  const copyFullAddress = () => {
    const fullText = `${general?.name}, ${location?.address}`;
    navigator.clipboard.writeText(fullText);
    alert("Hotel name and address copied!");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 font-sans">

      {/* --- TOP NAV BAR --- */}
      <div className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <button
              onClick={() => scrollToSection('overview')}
              className="font-bold text-xs tracking-widest border-b-2 border-slate-900 pb-7 mt-7 text-slate-900 uppercase"
            >
              Overview
            </button>
            <h2 className="font-bold text-xs tracking-widest text-slate-400 hover:text-slate-900 cursor-pointer transition uppercase">Prices</h2>
            <h2 className="font-bold text-xs tracking-widest text-slate-400 hover:text-slate-900 cursor-pointer transition uppercase">Reviews</h2>
          </div>
          <div className="flex gap-3">
            <button className="p-3 hover:bg-slate-100 rounded-full border border-slate-200 transition-all"><Share2 size={18} /></button>
            <button className="p-3 hover:bg-slate-100 rounded-full border border-slate-200 transition-all"><Heart size={18} /></button>
          </div>
        </div>
      </div>

      <header className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4">{general?.name}</h1>
            <div className="flex items-center gap-3 mb-8">
              <span className="flex text-amber-400">
                {[...Array(general?.stars || 4)].map((_, i) => <Star key={i} size={18} fill="currentColor" stroke="none" />)}
              </span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{general?.stars}-Star Property</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 inline-flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <MapPin className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{general?.name}</p>
                <p className="text-sm text-slate-500 mb-2">{location?.address}</p>
                <button
                  onClick={copyFullAddress}
                  className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider hover:underline"
                >
                  <Copy size={12} /> Copy Address
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100 min-w-[280px]">
            <div className="text-center">
              <p className="text-5xl font-bold tracking-tighter">{reviewRatingSummary?.score}</p>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{reviewRatingSummary?.scoreDesc}</p>
            </div>
            <div className="w-px h-16 bg-slate-100" />
            <div className="text-sm font-semibold text-slate-400">
              <span className="text-slate-900 block font-bold text-lg">{reviewRatingSummary?.count}</span>
              Verified Reviews
            </div>
          </div>
        </div>
      </header>

      {/* --- GALLERY SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {galleryCats.map((cat: any) => (
            <button
              key={cat.name}
              onClick={() => { setGalleryFilter(cat.name); setActiveImg(0); }}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${galleryFilter === cat.name ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
            >
              {cat.displayName}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
          <div className="md:col-span-8 relative rounded-3xl overflow-hidden group shadow-lg">
            <img src={filteredImages[activeImg]?.dynamic} className="w-full h-full object-cover" alt="Main" />
          </div>
          <div className="hidden md:grid md:col-span-4 grid-cols-2 grid-rows-2 gap-4">
            {filteredImages.slice(1, 5).map((img: any, i: number) => (
              <div key={i} onClick={() => setActiveImg(i + 1)} className="relative rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all">
                <img src={img.dynamic} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-32">
        <div className="lg:col-span-2 space-y-20">

          <section id="overview">
            <h2

              className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
              Property Overview <span className="h-px flex-1 bg-slate-100" />
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">{goodToKnow?.description?.content}</p>
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
              Essential Amenities <span className="h-px flex-1 bg-slate-100" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {amenities?.contentV2?.map((group: any) => (
                <div key={group.id} className="space-y-4">
                  <h4 className="font-bold text-[10px] text-blue-600 uppercase tracking-widest">{group.category}</h4>
                  <ul className="space-y-3">
                    {group.items.slice(0, 4).map((item: any) => (
                      <li key={item.id} className="flex items-center gap-3 text-slate-700 text-sm">
                        <div className="w-1 h-1 rounded-full bg-slate-300" /> {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* DYNAMIC REVIEWS SECTION */}
          <section className="p-10 border border-slate-100 rounded-3xl bg-white shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-slate-900 text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{reviewRatingSummary?.score}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{reviewRatingSummary?.scoreDesc}</h2>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {reviewRatingSummary?.formatCountString} Verified Reviews
                  </p>
                </div>
              </div>

              {data.highScoreReviews?.[0] && (
                <div className="flex items-center gap-4 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 max-w-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <p className="text-xs font-medium text-emerald-800 leading-snug">
                    {data.highScoreReviews[0].text.replace(/\{tag\}|\{\/tag\}/g, '')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                {reviewRatingSummary?.categories && Object.values(reviewRatingSummary.categories).map((cat: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase">{cat.name}</span>
                      <span className="text-xs font-bold text-slate-400">{cat.formatScore}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(parseFloat(cat.score) / 5) * 100}%`,
                          backgroundColor: cat.color === 'colorMonteverde' ? '#10b981' : '#3b82f6'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Details</h3>
                <div className="space-y-6">
                  {data.reviews?.explanations && Object.values(data.reviews.explanations).map((exp: any, i: number) => (
                    <div key={i}>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{exp.title}</h4>
                      <p className="text-xs text-slate-500 italic leading-relaxed">{exp.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ADDED BACK POLICIES SECTION */}
          <section>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
              Hotel Policies <span className="h-px flex-1 bg-slate-100" />
            </h2>
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {goodToKnow?.policies?.content?.map((policy: any, i: number) => (
                <div key={i} className="py-6 flex flex-col md:flex-row md:items-start gap-6 group">
                  <div className="w-48 shrink-0 font-bold text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                    {policy.type}
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {Array.isArray(policy.values[0].content) ? policy.values[0].content.join(", ") : policy.values[0].content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-1">
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg flex flex-col justify-between min-h-[450px]">
              <div>
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">Reservation</h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Check-In</p>
                    <p className="text-lg font-bold text-slate-900">{goodToKnow?.checkinTime?.time || "14:00"}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Check-Out</p>
                    <p className="text-lg font-bold text-slate-900">{goodToKnow?.checkoutTime?.time || "11:00"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRateEditor(true)}
                  className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${selectedBooking ? 'bg-slate-100 text-slate-500 border border-dashed border-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                  {selectedBooking ? "Change Room Selection" : "Check Rates"}
                </button>

                {/* --- BILL STRUCTURE --- */}
                {selectedBooking && (
                  <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="relative bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-white border-b border-x border-slate-200 rounded-b-full" />

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Stay Details</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{selectedBooking.roomName}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase">{totalNights} Night{totalNights > 1 ? 's' : ''} Stay</p>
                        </div>

                        <div className="h-px bg-slate-200/60" />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Occupancy</p>
                            <p className="text-xs font-bold text-slate-700">{selectedBooking.guests} Guests</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Rooms</p>
                            <p className="text-xs font-bold text-slate-700">{selectedBooking.rooms} Unit{selectedBooking.rooms > 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        <div className="h-px bg-slate-200 border-t border-dashed my-2" />

                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Base ({totalNights} Nights)</span>
                            <span className="text-slate-900">{selectedBooking.price}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Taxes & Fees</span>
                            <span className="text-emerald-600">Included</span>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col items-end border-t border-slate-100">
                          <span className="text-[10px] font-black text-slate-900 uppercase self-start mt-2">Grand Total (INR)</span>
                          <div className="text-3xl font-black text-blue-600 tracking-tighter">
                            {selectedBooking.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-1 mt-0.5">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-slate-50 border-b border-r border-slate-100 rotate-45 -mt-1" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTON */}
              <button
                disabled={!selectedBooking || isPaying}
                onClick={handleProceedToBook}
                className={`w-full py-4 mt-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${selectedBooking
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100'
                    : 'bg-white border border-slate-200 text-slate-300 cursor-not-allowed'
                  } ${isPaying ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isPaying ? 'Initializing...' : 'Proceed to Book'}
              </button>
            </div>


            <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[3rem] p-4 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group">

              {/* Header Section - Floating Style */}
              <div className="flex flex-col items-center justify-center p-8 text-center">

                <p className="text-2xl font-bold text-slate-900 tracking-tight">Property Map</p>

                {/* Centered Description */}
                <p className="text-sm text-slate-500 leading-relaxed font-medium mt-4 max-w-[80%]">
                  {distance || "Perfectly positioned within walking distance of the city's main attractions."}
                </p>
              </div>

              {/* Description - De-emphasized */}


              {/* The Map Container - Full Width Bleed */}
              <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 border border-slate-50">
                {location?.coordinates ? (
                  <HotelMap
                    longitude={location.coordinates.longitude}
                    latitude={location.coordinates.latitude}
                    hotelName={general?.name}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initialising...</span>
                    </div>
                  </div>
                )}



                {/* Interactive Overlay - Only shows on hover */}
                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors pointer-events-none" />

                {/* Floating Controls Overlay (Visual Only) */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur shadow-sm rounded-xl flex items-center justify-center text-slate-900">
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>


            </div>
          </div>
        </aside>
      </main>

      {showRateEditor && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="absolute inset-0" onClick={() => setShowRateEditor(false)} />
          <div className="w-full max-w-5xl relative">
            <RateEditor
              searchDetails={searchDetails}
              onClose={() => setShowRateEditor(false)}
              onSelectRoom={(room) => setSelectedBooking(room)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;