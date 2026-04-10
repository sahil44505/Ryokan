import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hotelId = searchParams.get('hotelId');
  const entityId = searchParams.get('entityId');

  if (!hotelId || !entityId) {
    return NextResponse.json({ error: "Missing Ids" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      'https://sky-scrapper.p.rapidapi.com/api/v1/hotels/getHotelDetails',
      {
        params: { hotelId, entityId },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY, // Secured on the server
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Backend Detail Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch details" },
      { status: error.response?.status || 500 }
    );
  }
}