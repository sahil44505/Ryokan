"use client";

import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-slate-900">
      {/* Background Image - Static & Sharp */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://static.tacdn.com/img2/branding/homepage/hotel-hero-default-4.jpg"
          alt="Luxury Hotel"
          className="w-full h-full object-cover brightness-[0.6] contrast-[1.1]"
        />
      </div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* Content Container */}
      <div className="relative  mt-36 z-20 h-full flex flex-col justify-center items-center px-6 text-center">
        
        <div className="max-w-4xl mb-4 space-y-6">
          <span className="inline-block text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-blue-400 mb-2">
            Luxury Stays & Experiences
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
            Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">differently.</span>
          </h1>
          
          <p className="text-lg   md:text-xl text-slate-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover handpicked hotels and hidden gems tailored to your unique journey.
          </p>
        </div>

        {/* Visual spacer to account for your external search bar's presence */}
        <div className="h-32 md:h-48" />

        {/* Subtle Brand Tagline */}
        
      </div>
    </div>
  );
};

export default Hero;