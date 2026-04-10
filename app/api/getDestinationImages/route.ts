import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { destination } = await request.json();
    const cleanName = (destination.entityName || destination.name || "")
      .replace(/\([^)]*\)/g, "") // Clean parentheses
      .trim();

    console.log(`--- SerpApi Fetching: ${cleanName} ---`);

    const params = {
      api_key: process.env.SERP_API_KEY, // Ensure this is in your .env
      engine: "google_images",
      q: cleanName,
      google_domain: "google.com",
      gl: "in", // Set to 'in' for India-centric results or 'us'
      hl: "en",
    };

    // Calling SerpApi via axios
    const response = await axios.get("https://serpapi.com/search", { params });

    // SerpApi returns an array called 'images_results'
    const firstResult = response.data?.images_results?.[0];
    
    // We prefer the 'original' or 'thumbnail' link
    const imageUrl = firstResult?.original || firstResult?.thumbnail || destination.image;

    console.log(`SerpApi found image for ${cleanName}:`, imageUrl ? "Success" : "Failed");

    return NextResponse.json({ xoteloImage: imageUrl });

  } catch (error: any) {
    console.error("SerpApi Route Error:", error.response?.data || error.message);
    return NextResponse.json({ xoteloImage: null }, { status: 200 });
  }
}