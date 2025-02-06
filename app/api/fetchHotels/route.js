// app/api/fetchHotels/route.js

import { NextResponse } from "next/server";
import { fetchNearbyHotels } from "@/app/lib/googlePlaces";

/**
 * GET /api/fetchHotels?lat=...&lng=...
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing latitude or longitude." },
      { status: 400 }
    );
  }

  const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const hotels = await fetchNearbyHotels(
      parseFloat(lat),
      parseFloat(lng),
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    );
    return NextResponse.json({ hotels }, { status: 200 });
  } catch (error) {
    console.error("Error in fetchHotels API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels." },
      { status: 500 }
    );
  }
}
