// app/api/accommodations/nearby/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || 5000; // Default radius: 5 km
    const types = searchParams.getAll("type"); // Allow multiple types

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and longitude are required." },
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

    // Construct the types parameter
    const typeParams = types.length > 0 ? `&type=${types.join("|")}` : "";

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}${typeParams}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Google Places API error:", response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch nearby accommodations." },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: "Failed to fetch nearby accommodations." },
        { status: 500 }
      );
    }

    // Map the results to a simpler structure
    const accommodations = data.results.map((place) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      types: place.types,
    }));

    return NextResponse.json(
      { accommodations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching nearby accommodations:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
 