import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    let { lat, lng, categoryKey } = await req.json();

    // 1. Fallback: If no GPS coords, use IP to get rough location
    if (!lat || !lng) {
      try {
        // We use ipapi.co as a fallback
        const ipRes = await axios.get('https://ipapi.co/json/');
        lat = ipRes.data.latitude;
        lng = ipRes.data.longitude;
      } catch (e) {
        // Emergency Fallback: Default to a central location (e.g., London)
        lat = 51.5074; lng = -0.1278;
      }
    }

    const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
    console.log("Fetching nearby places with:", { lat, lng, categoryKey });
    console.log("Using Geoapify API Key:", API_KEY ? "Available" : "Missing");
    // CRITICAL: Geoapify uses (Longitude, Latitude) order for the circle filter
    // filter=circle:lon,lat,radiusMeters
    const url = `https://api.geoapify.com/v2/places?categories=${categoryKey}&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=20&apiKey=${API_KEY}`;

    const response = await axios.get(url);

    // If Geoapify returns no features, we return an empty array instead of crashing
    const features = response.data.features || [];

    const results = features.map((feature: any) => ({
      id: feature.properties.place_id,
      name: feature.properties.name || feature.properties.street || "Special Location",
      address: feature.properties.formatted,
      lat: feature.properties.lat,
      lng: feature.properties.lon,
      distance: feature.properties.distance,
    }));
    console.log(`Geoapify returned ${results.length} places.`);
    console.log("Sample place:", results[0] || "No places found");
    console.log("Full API Response:", response.data);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Geoapify Error:", error.response?.data || error.message);
    return NextResponse.json([], { status: 200 }); // Return empty array to keep UI stable
  }
}