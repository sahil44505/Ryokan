export const SkeletonLoader = () => (
  <div className="bg-white min-h-screen flex flex-col overflow-hidden">
    {/* Minimalist Top Progress Bar */}
    <div className="fixed top-0 left-0 w-full h-[2px] bg-slate-50 overflow-hidden z-[110]">
      <div className="h-full bg-slate-900 w-1/3 animate-[progress_3s_infinite_easeInOutExpo]" />
    </div>

    {/* Branded Centerpiece */}
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center">
        {/* The "Orbit" Spinner - Modern & Thin */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-[1px] border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-t-[1px] border-slate-900 rounded-full animate-spin duration-[2000ms]" />
        </div>
        
        <h2 className="text-[9px] font-black uppercase tracking-[1em] text-slate-900 animate-pulse text-center pl-[1em]">
          Finding Perfection
        </h2>
      </div>
    </div>

    {/* The "Ghost" UI Layout */}
    <div className="flex-1 px-4 md:px-12 py-8 space-y-12 opacity-40">
      {/* Search Bar Placeholder */}
      <div className="max-w-3xl mx-auto h-14 bg-slate-50 rounded-full border border-slate-100 animate-pulse" />

      {/* Horizontal Film Strip */}
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="w-40 h-56 md:w-56 md:h-72 bg-slate-100 rounded-[2.5rem] shrink-0 overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
          </div>
        ))}
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[3/4] bg-slate-50 rounded-[3rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent translate-y-full animate-[shimmerVertical_3s_infinite]" />
            </div>
            <div className="h-2 w-1/2 bg-slate-100 rounded-full mx-auto" />
            <div className="h-2 w-1/4 bg-slate-50 rounded-full mx-auto" />
          </div>
        ))}
      </div>
    </div>

    <style jsx global>{`
      @keyframes progress {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0); }
        100% { transform: translateX(100%); }
      }
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
      @keyframes shimmerVertical {
        100% { transform: translateY(-100%); }
      }
    `}</style>
  </div>
);