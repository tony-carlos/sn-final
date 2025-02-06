// app/api/getPlaceDetails/route.js
export const dynamic = 'force-dynamic'; // Must be the first line

import { NextResponse } from "next/server";
import axios from "axios";

/**
 * GET /api/getPlaceDetails?placeId=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");

    // Log incoming request
    console.log(`Received getPlaceDetails request for placeId=${placeId}`);

    // Validate placeId
    if (!placeId) {
      console.error("Missing placeId parameter.");
      return NextResponse.json(
        { error: "Missing placeId parameter." },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is not configured.");
      return NextResponse.json(
        { error: "Google Maps API key is not configured." },
        { status: 500 }
      );
    }

    // Fetch place details from Google Places API
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields:
            "name,website,formatted_address,formatted_phone_number,geometry,types,rating,price_level,opening_hours",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    // Check API response status
    if (response.data.status !== "OK") {
      console.error(
        "Google Places API Error:",
        response.data.status,
        response.data.error_message
      );
      return NextResponse.json(
        { error: `Google Places API Error: ${response.data.status}` },
        { status: 500 }
      );
    }

    const place = response.data.result;

    // Prepare detailed place information without photos
    const placeDetails = {
      name: place.name || "",
      website: place.website || "",
      address: place.formatted_address || "",
      phoneNumber: place.formatted_phone_number || "",
      location: place.geometry.location || { lat: 0, lng: 0 },
      types: place.types || [],
      rating: place.rating || null,
      priceLevel: place.price_level || null,
      openingHours: place.opening_hours || {}, // Optional: Opening hours
    };

    console.log(`Fetched details for placeId=${placeId}`);

    return NextResponse.json({ placeDetails }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in getPlaceDetails API route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
