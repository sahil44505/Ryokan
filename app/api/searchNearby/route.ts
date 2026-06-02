import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
console.log("Using Geoapify API Key:", GEOAPIFY_API_KEY ? "FOUND" : "MISSING");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lat, lng, keyword } = body;

        if (lat === undefined || lng === undefined) {
            return NextResponse.json({ error: "Missing latitude or longitude coordinate markers" }, { status: 400 });
        }

        if (!GEOAPIFY_API_KEY) {
            return NextResponse.json({ error: "Server missing API key configuration" }, { status: 500 });
        }

        // Configure Geoapify request parameters
        const params: any = {
            filter: `circle:${lng},${lat},10000`, // 10km search circle radius
            bias: `proximity:${lng},${lat}`,
            limit: 25,
            apiKey: GEOAPIFY_API_KEY
        };

        // If the user typed a keyword search
        if (keyword && keyword.trim() !== "") {
            const cleanKeyword = keyword.toLowerCase().trim();

            // Check against a comprehensive dictionary of category keywords
            if (cleanKeyword.includes("beach") || cleanKeyword.includes("sea") || cleanKeyword.includes("coast") || cleanKeyword.includes("shore") || cleanKeyword.includes("ocean")) {
                params.categories = "beach";
            }
            else if (
                cleanKeyword.includes("restaurant") || cleanKeyword.includes("food") || cleanKeyword.includes("cafe") ||
                cleanKeyword.includes("dine") || cleanKeyword.includes("dinner") || cleanKeyword.includes("lunch") ||
                cleanKeyword.includes("breakfast") || cleanKeyword.includes("bakery") || cleanKeyword.includes("baking") ||
                cleanKeyword.includes("fastfood") || cleanKeyword.includes("fast food") || cleanKeyword.includes("eatery")
            ) {
                params.categories = "catering.restaurant,catering.cafe,catering.fast_food";
            }
            else if (
                cleanKeyword.includes("hotel") || cleanKeyword.includes("stay") || cleanKeyword.includes("accommodation") ||
                cleanKeyword.includes("resort") || cleanKeyword.includes("motel") || cleanKeyword.includes("hostel") ||
                cleanKeyword.includes("lodge") || cleanKeyword.includes("lodging") || cleanKeyword.includes("inn")
            ) {
                params.categories = "accommodation.hotel,accommodation.motel,accommodation.hostel";
            }
            else if (
                cleanKeyword.includes("bar") || cleanKeyword.includes("pub") || cleanKeyword.includes("club") ||
                cleanKeyword.includes("nightlife") || cleanKeyword.includes("lounge") || cleanKeyword.includes("beer") ||
                cleanKeyword.includes("wine") || cleanKeyword.includes("discotique")
            ) {
                params.categories = "catering.pub,catering.bar";
            }
            else if (
                cleanKeyword.includes("sight") || cleanKeyword.includes("attraction") || cleanKeyword.includes("monument") ||
                cleanKeyword.includes("museum") || cleanKeyword.includes("historical") || cleanKeyword.includes("heritage") ||
                cleanKeyword.includes("tourism") || cleanKeyword.includes("tourist") || cleanKeyword.includes("fort") ||
                cleanKeyword.includes("palace") || cleanKeyword.includes("castle")
            ) {
                params.categories = "tourism.attraction,tourism.sight";
            }
            else if (
                cleanKeyword.includes("temple") || cleanKeyword.includes("church") || cleanKeyword.includes("mosque") ||
                cleanKeyword.includes("shrine") || cleanKeyword.includes("religious") || cleanKeyword.includes("cathedral") ||
                cleanKeyword.includes("chapel") || cleanKeyword.includes("gurudwara")
            ) {
                params.categories = "place_of_worship";
            }
            else if (
                cleanKeyword.includes("park") || cleanKeyword.includes("garden") || cleanKeyword.includes("nature") ||
                cleanKeyword.includes("forest") || cleanKeyword.includes("lake") || cleanKeyword.includes("zoo") ||
                cleanKeyword.includes("aquarium") || cleanKeyword.includes("wildlife") || cleanKeyword.includes("reserve")
            ) {
                params.categories = "leisure.park,tourism.attraction";
            }
            else if (
                cleanKeyword.includes("shop") || cleanKeyword.includes("mall") || cleanKeyword.includes("store") ||
                cleanKeyword.includes("market") || cleanKeyword.includes("groceries") || cleanKeyword.includes("supermarket") ||
                cleanKeyword.includes("clothing") || cleanKeyword.includes("boutique") || cleanKeyword.includes("bazaar")
            ) {
                params.categories = "commercial.shopping_mall,commercial.supermarket,commercial.clothing";
            }
            else if (
                cleanKeyword.includes("atm") || cleanKeyword.includes("bank") || cleanKeyword.includes("cash") ||
                cleanKeyword.includes("finance") || cleanKeyword.includes("money")
            ) {
                params.categories = "service.financial.atm,service.financial.bank";
            }
            else if (
                cleanKeyword.includes("hospital") || cleanKeyword.includes("clinic") || cleanKeyword.includes("medical") ||
                cleanKeyword.includes("pharmacy") || cleanKeyword.includes("doctor") || cleanKeyword.includes("chemist") ||
                cleanKeyword.includes("emergency") || cleanKeyword.includes("er") || cleanKeyword.includes("dentist") ||
                cleanKeyword.includes("healthcare") || cleanKeyword.includes("care") || cleanKeyword.includes("vet")
            ) {
                // FIXED: Using Geoapify's official healthcare category taxonomy keys
                params.categories = "healthcare.hospital,healthcare.clinic_or_praxis,healthcare.pharmacy";
            }
            else if (
                cleanKeyword.includes("fuel") || cleanKeyword.includes("gas") || cleanKeyword.includes("petrol") ||
                cleanKeyword.includes("charging") || cleanKeyword.includes("ev") || cleanKeyword.includes("diesel")
            ) {
                params.categories = "amenity.fuel,service.vehicle.charging_station";
            }
            else if (
                cleanKeyword.includes("hospital") || cleanKeyword.includes("clinic") || cleanKeyword.includes("medical") ||
                cleanKeyword.includes("pharmacy") || cleanKeyword.includes("doctor") || cleanKeyword.includes("chemist") ||
                cleanKeyword.includes("emergency") || cleanKeyword.includes("er") || cleanKeyword.includes("dentist") ||
                cleanKeyword.includes("healthcare") || cleanKeyword.includes("care") || cleanKeyword.includes("vet")
            ) {
                params.categories = "amenity.medical,healthcare";
            }
            else if (
                cleanKeyword.includes("station") || cleanKeyword.includes("metro") || cleanKeyword.includes("bus") ||
                cleanKeyword.includes("train") || cleanKeyword.includes("transit") || cleanKeyword.includes("airport") ||
                cleanKeyword.includes("railway") || cleanKeyword.includes("subway") || cleanKeyword.includes("stop")
            ) {
                params.categories = "public_transport";
            }
            else if (
                cleanKeyword.includes("theater") || cleanKeyword.includes("cinema") || cleanKeyword.includes("movie") ||
                cleanKeyword.includes("multiplex") || cleanKeyword.includes("entertainment") || cleanKeyword.includes("amusement")
            ) {
                params.categories = "entertainment.cinema,entertainment.theme_park";
            }
            else {
                // Fall back to text name matching for unique business searches (e.g. "Starbucks")
                params.name = keyword.trim();
            }
        } else {
            // YOUR EXACT ORIGINAL DEFAULT SEARCH (Untouched)
            params.categories = "accommodation,entertainment,catering,tourism";
        }

        const placesResponse = await axios.get("https://api.geoapify.com/v2/places", { params });
        const places = placesResponse.data?.features || [];

        // Map through results cleanly
        const mappedLocations = places.map((place: any, index: number) => {
            const props = place.properties;
            const primaryCategory = props.categories?.[0]?.split('.')?.[1] || props.categories?.[0] || "Place";

            const pLat = place.geometry.coordinates[1];
            const pLng = place.geometry.coordinates[0];

            const searchName = props.name || props.formatted || "Location";

            // FIXED: Used standard web URL queries without literal evaluation syntax crashes
            const fallbackLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchName)}`;

            return {
                id: props.place_id || `place-${index}`,
                name: searchName,
                category: primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1),
                address: props.address_line2 || props.city || "Area listed nearby",
                link: props.datasource?.raw?.website || fallbackLink,
                lat: pLat,
                lng: pLng
            };
        });

        return NextResponse.json({
            locations: mappedLocations
        });

    } catch (error: any) {
        console.error("Geoapify Live Coordinates Pipeline Error:", error.message);
        return NextResponse.json({ error: "Failed to gather spatial markers" }, { status: 500 });
    }
}