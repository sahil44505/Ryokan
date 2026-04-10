import axios from "axios";

import { NextResponse } from "next/server";

const RAPID_HEADERS = {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
};
const formatDate = (date: Date) => date.toISOString().split('T')[0];
export async function POST(req: Request) {
    try {
        const { title, checkin, checkout } = await req.json();
        const today = new Date();
        
        const checkinDate = new Date(today);
        checkinDate.setDate(today.getDate() + 1); // Tomorrow

        const checkoutDate = new Date(today);
        checkoutDate.setDate(today.getDate() + 3); // 2 days after check-in

        const checkinStr = formatDate(checkinDate);
        const checkoutStr = formatDate(checkoutDate);
        // STEP 1: Get structured destinations from the string "Mumbai, India"
        const destinationRes = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel', {
            params: { query: title },
            headers: RAPID_HEADERS
        });

        const destinations = destinationRes.data.data; // This is your "Row" of results

        if (!destinations || destinations.length === 0) {
            return NextResponse.json({ msg: "No destinations found", data: [] });
        }

        // STEP 2: Grab the first (default) entityId
        const defaultEntityId = destinations[0].entityId;

        // STEP 3: Hit the search hotels API using that default ID
        const hotelListRes = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchHotels', {
            params: {
                entityId: defaultEntityId,
                checkin: checkinStr,
                checkout: checkoutStr,
                adults: '2',
                rooms: '1'
            },
            headers: RAPID_HEADERS
        });
       
        // Return both: the list of locations for your UI row, and the actual hotels
        return NextResponse.json({ 
            availableLocations: destinations, 
            hotels: hotelListRes.data.data ,
            EntityId : defaultEntityId
        });

    } catch (err: any) {
        console.error("Workflow Error:", err.message);
        return NextResponse.json({ error: "Failed to fetch travel data" }, { status: 500 });
    }
}