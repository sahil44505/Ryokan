import axios from "axios";
import { useEffect, useState } from "react";

interface DestinationCardProps {
  loc: any;
  onSelect: () => void;
}

export const DestinationCard = ({ loc, onSelect }: DestinationCardProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getXoteloImage() {
      try {
        const res = await axios.post("/api/getDestinationImages", { 
          destination: loc 
        });
        setImage(res.data.xoteloImage);
      } catch (err) {
        console.error("Error fetching individual image:", err);
      } finally {
        setLoading(false);
      }
    }
    getXoteloImage();
  }, [loc]);

  return (
    <button 
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // Stop parent scroll container from hijacking click
        onSelect();
      }}
      className="flex-shrink-0 w-32 h-48 md:w-44 md:h-60 rounded-2xl relative overflow-hidden bg-slate-200 group shadow-sm text-left transition-transform active:scale-95 cursor-pointer"
    >
      {/* Show actual image or fallback once loading is done */}
      <img 
        src={image || loc.image} 
        alt={loc.name || loc.entityName}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {/* Loading Pulse State */}
      {loading && <div className="absolute inset-0 bg-slate-300 animate-pulse" />}
      
      {/* IMPORTANT: pointer-events-none ensures the click passes THROUGH 
          these layers and hits the button. 
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent z-10 pointer-events-none" />
      
      <div className="absolute bottom-4 left-4 z-20 text-white pr-2 pointer-events-none">
        <p className="text-[8px] font-black uppercase opacity-70 mb-1 tracking-widest">
          {loc.class || "Explore"}
        </p>
        <p className="text-xs md:text-sm font-bold leading-tight line-clamp-2">
          {loc.name || loc.entityName}
        </p>
      </div>
    </button>
  );
};