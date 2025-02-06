// app/api/nearby-accommodations/route.js

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Latitude and longitude parameters are required." },
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

  const types = "lodging|campground"; // Types of accommodations
  const radius = 5000; // Radius in meters (5 km)

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${types}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      return NextResponse.json(
        { error: response.data.error_message || "Failed to fetch nearby accommodations." },
        { status: 500 }
      );
    }

    const accommodations = response.data.results.map((place) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      types: place.types,
    }));

    return NextResponse.json({ accommodations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby accommodations:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
