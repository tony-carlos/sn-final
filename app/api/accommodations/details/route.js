// app/api/accommodations/details/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId parameter is required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured." },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,price_level,rating,types,geometry,formatted_address&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status !== "OK") {
      return NextResponse.json(
        { error: response.data.error_message || "Failed to fetch place details." },
        { status: 500 }
      );
    }

    const placeDetails = response.data.result;

    return NextResponse.json({ placeDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
