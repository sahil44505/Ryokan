'use client';
import React, { useState, useMemo } from 'react';
import { Calendar, Users, Home, ChevronRight, RefreshCw, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export const RateEditor = ({ searchDetails, onClose, onSelectRoom }: {
  searchDetails: any,
  onClose: () => void,
  onSelectRoom: (room:any ) => void
}) => {

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const handleSelectRoom = (room: any) => {
    // When a room is selected, we send the price to the parent and close the modal
    const inrValue = room.price ? (convertToINR(room.price) !== null
      ? formatCurrency(convertToINR(room.price)!, 'INR')
      : 'N/A') : 'N/A';
      const adults = Number(searchDetails.adults || 0);
      const children = Number(searchDetails.children || 0);
      const roomCount = Number(searchDetails.rooms || 1);

    // Pass the formatted INR string back to the parent
    onSelectRoom({
    price: inrValue,
    checkin: searchDetails.checkin,
    checkout: searchDetails.checkout,
    guests: adults + children,
    rooms: roomCount,
    roomName: room.roomType || 'Standard Room'
  });
    onClose();
  };

  // Dollar to INR conversion (Adjust rate as needed)
  const convertToINR = (usdString: any) => {
    const exchangeRate = 83.50;
    // Remove symbols/commas to get a clean number
    const numericValue = parseFloat(usdString.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return null;
    return numericValue * exchangeRate;
  };


  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);

  const [localDetails, setLocalDetails] = useState({
    ...searchDetails,
    rooms: searchDetails.rooms || '1',
    children: searchDetails.children || '0',
    adults: searchDetails.adults || '2',
    checkin: searchDetails.checkin || '',
    checkout: searchDetails.checkout || ''
  });

  const RunApi = async (params: any) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/getHotelPrices', { params });
      // Drilling down: result -> data -> metaInfo -> rates
      const rates = response.data?.result?.data?.metaInfo?.rates;

      if (rates && Array.isArray(rates)) {
        setPriceData(rates);
      } else {
        setPriceData([]);
      }
    } catch (error) {
      console.error("Error fetching hotel prices:", error);
      setPriceData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter unique room types (Strict requirement: no repeats)
  const uniqueRooms = useMemo(() => {
    if (!priceData || priceData.length === 0) return [];
    const seenTypes = new Set();
    return priceData.filter((rate: any) => {
      const typeKey = rate.roomType?.toLowerCase().trim();
      if (!typeKey || seenTypes.has(typeKey)) return false;
      seenTypes.add(typeKey);
      return true;
    });
  }, [priceData]);

  const handleVerify = () => {
    setIsVerified(true);
    RunApi(localDetails);
  };



  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`bg-white rounded-[48px] shadow-2xl w-full transition-all duration-500 ease-in-out overflow-hidden ${isVerified ? 'max-w-6xl' : 'max-w-4xl'}`}>

        {/* HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isVerified ? "Available Options" : "Set Your Stay"}
            </h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">
              {isVerified ? "Live pricing from providers" : "Refine dates and guest occupancy"}
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* LEFT PANEL: INPUTS */}
          <div className={`p-10 transition-all duration-500 ${isVerified ? 'md:w-1/3 border-r border-slate-100' : 'w-full'}`}>
            <div className="space-y-8 mb-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stay Period</label>
                <div className="flex flex-col gap-2 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-blue-600" />
                    <input
                      type="date"
                      disabled={isVerified}
                      value={localDetails.checkin}
                      className="bg-transparent font-black text-sm outline-none w-full disabled:text-slate-400"
                      onChange={(e) => setLocalDetails({ ...localDetails, checkin: e.target.value })}
                    />
                  </div>
                  <div className="h-px bg-slate-200 w-full my-1" />
                  <div className="flex items-center gap-3">
                    <div className="w-[18px]" /> {/* Spacer for alignment */}
                    <input
                      type="date"
                      disabled={isVerified}
                      value={localDetails.checkout}
                      className="bg-transparent font-black text-sm outline-none w-full disabled:text-slate-400"
                      onChange={(e) => setLocalDetails({ ...localDetails, checkout: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Adults', key: 'adults' },
                  { label: 'Children', key: 'children' },
                  { label: 'Rooms', key: 'rooms' }
                ].map((item) => (
                  <div key={item.key} className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <input
                        type="number"
                        disabled={isVerified}
                        value={localDetails[item.key as keyof typeof localDetails]}
                        className="bg-transparent font-black text-sm outline-none w-full disabled:text-slate-400"
                        onChange={(e) => setLocalDetails({ ...localDetails, [item.key]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isVerified ? (
              <button
                onClick={handleVerify}
                className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl"
              >
                Verify & Show Rates
              </button>
            ) : (
              <button
                onClick={() => { setIsVerified(false); setPriceData([]); }}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <RefreshCw size={14} /> Modify Search
              </button>
            )}
          </div>

          {/* RIGHT PANEL: RESULTS / EMPTY STATE */}
          {isVerified && (
            <div className="flex-1 p-10 bg-slate-50/30 overflow-y-auto max-h-[600px] flex flex-col">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full m-auto space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Checking Availability...</p>
                </div>
              ) : uniqueRooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right duration-500">
                  {uniqueRooms.map((room: any, index: number) => (

                    <div key={index} className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase">Score: {room.score}</span>
                          {room.cugRate?.discount && (
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase">{room.cugRate.discount}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{room.roomType}</h3>
                        <p className="text-slate-400 text-[11px] font-bold uppercase mb-4">{room.roomPolicies}</p>
                        <div className="flex flex-wrap gap-2">
                          {room.rateBriefFeatures?.slice(0, 4).map((feat: string, i: number) => (
                            <span key={i} className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                              <CheckCircle2 size={12} className="text-emerald-500" /> {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-3 min-w-[150px]">
                        <div className="flex flex-col items-end leading-none">
                          {/* Styled Price Display */}
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter mb-1">Best Daily Rate</span>
                          <div className="text-3xl font-black text-slate-900 tracking-tighter">
                            {room.price ? (convertToINR(room.price) !== null ? formatCurrency(convertToINR(room.price)!, 'INR') : 'N/A') : 'N/A'}
                          </div>
                          <div className="text-[11px] font-bold text-slate-400 mt-1">
                            Approx. {room.price} USD
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectRoom(room)}
                          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                        >
                          Select Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* PROFESSIONAL NO-HOTELS STATE */
                <div className="flex flex-col items-center justify-center h-full m-auto max-w-sm text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="text-red-500" size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">No Vacancy Found</h3>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed mb-10 uppercase tracking-tight">
                    We couldn't find any available room types for these specific dates or guest count. This property might be fully booked.
                  </p>

                  <div className="flex flex-col w-full gap-3">
                    <button
                      onClick={() => { setIsVerified(false); setPriceData([]); }}
                      className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                    >
                      Try Different Dates
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-5 bg-white text-slate-400 border border-slate-200 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Exit Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};