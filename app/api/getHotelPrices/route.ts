import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
    try{
       const { searchParams } = new URL(request.url);

        // Extract each piece of data from the URL
        const PriceDetails = {
            adults: searchParams.get("adults"),
            checkin: searchParams.get("checkin"),
            checkout: searchParams.get("checkout"),
            children: searchParams.get("children"),
            rooms: searchParams.get("rooms"),
            hotelId: searchParams.get("hotelId"),
            entityId: searchParams.get("entityId")
        };

       
        const response = await axios.get(`https://sky-scrapper.p.rapidapi.com/api/v1/hotels/getHotelPrices`, {
            params: PriceDetails,
            
            headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY, // Secured on the server
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
        },
        })
        
        const result = response.data
        return NextResponse.json({ message: "Hotel prices fetched successfully" ,result}, { status: 200 });
    }catch(error){
        console.error("Error fetching hotel prices:", error);
        return NextResponse.json({ error: "Api request failed" }, { status: 500 });
    }
}