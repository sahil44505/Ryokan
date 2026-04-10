import {HotelDetailsCall} from '../HotelDetailsCall'

interface PageProps {
  params: Promise<{ id: string }>; // Define as a Promise
  searchParams: Promise<{ entityId: string;
    checkin?: string;
    checkout?: string;
    adults?: string;
    children?: string;
    rooms?: string;
   }>; // Define as a Promise
}
export default async function HotelDetailPage({ params, searchParams }: PageProps) {
  
  // Await the promises to get the actual values
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const id = resolvedParams.id;
 const { 
    entityId, 
    checkin, 
    checkout, 
    adults, 
    children, 
    rooms 
  } = resolvedSearchParams;

  return (
    <div className="min-h-screen bg-white">
      <HotelDetailsCall 
        hotelId={id} 
        entityId={entityId} 
        checkin={checkin}
        checkout={checkout}
        adults={adults}
        children={children}
        rooms={rooms}
      />
    </div>
  );
}