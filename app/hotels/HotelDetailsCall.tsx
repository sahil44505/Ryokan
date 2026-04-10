'use client';
import React, { useState, useEffect } from 'react';
import HotelDetails from './HotelDetails';

interface HotelDetailsProps {
  hotelId: string;
  entityId: string;
  checkin?: string;
  checkout?: string;
  adults?: string;
  children?: string;
  rooms?: string;
}

export const HotelDetailsCall = ({ 
  hotelId, 
  entityId, 
  checkin, 
  checkout, 
  adults, 
  children, 
  rooms 
}: HotelDetailsProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchHotelData = async () => {
    if (!hotelId) return; // Prevent fetching if id is missing

    try {
      setLoading(true);
      
      // Use URLSearchParams to handle null/undefined cleanly
      const params = new URLSearchParams({
        hotelId,
        ...(entityId && { entityId }) // Only add if it exists
      });

      const response = await fetch(`/api/hoteldetail?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch hotel data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchHotelData();
}, [hotelId, entityId]);

  if (loading) return <HotelSkeleton />; // Google standard: Always show skeletons
  if (error) return <ErrorMessage message={error} />;

  return <HotelDetails 
  data={data} 
  searchDetails={{ checkin, checkout, adults, children, rooms ,hotelId , entityId }}/>;
};

export default HotelDetailsCall;

// Simple internal components for state
const HotelSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 animate-pulse">
    <div className="h-96 bg-gray-200 rounded-2xl mb-8" />
    <div className="h-10 bg-gray-200 w-1/2 mb-4" />
    <div className="h-6 bg-gray-200 w-1/4" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-20 text-red-500">
    <p>Oops! {message}</p>
  </div>
);