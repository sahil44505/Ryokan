import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const { title } = await req.json(); // This is the city name (e.g., "Mumbai")
        const checkIn = new Date();
         checkIn.setDate(checkIn.getDate() + 7); // Set for 1 week from now
        const checkOut = new Date();
        checkOut.setDate(checkOut.getDate() + 10);
            const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const response = await axios.get("https://serpapi.com/search", {
            params: {
                engine: "google_hotels",
                q: title,
                api_key: "09804ddbc26083d47687c93cbaa001c6dc6ff5fe2e0843220ea785e9ccd89323",
                check_in_date: formatDate(checkIn), // Example future dates
                check_out_date: formatDate(checkOut),
                adults: "2",
                currency: "USD"
            }
        });

        // We only want the root 'properties' array
       const properties = response.data.properties;
        console.log(properties)

        if (!properties || properties.length === 0) {
            return NextResponse.json(null);
        }

        // STEP: Take only the FIRST object
        const firstHotel = properties[0];

        // STEP: Extract only Name, Price, and GPS
        const simplifiedHotel = {
            name: firstHotel.name,
            price: firstHotel.rate_per_night?.lowest || "N/A",
            gps: firstHotel.gps_coordinates,
            thumbnail: firstHotel.thumbnail, // Kept for UI visibility
            link: firstHotel.link
        };

        return NextResponse.json(simplifiedHotel);

    } catch (error: any) {
        console.error("SerpApi Error:", error.message);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}