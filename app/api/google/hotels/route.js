// app/api/google/hotels/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination");

  if (!destination) {
    return NextResponse.json(
      { success: false, message: "Destination parameter is missing." },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const query = encodeURIComponent(`${destination} hotels`);
    const type = "lodging";

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=${type}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { success: false, message: data.error_message || "API Error." },
        { status: 500 }
      );
    }

    const hotels = data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
      placeId: place.place_id,
      photoReference: place.photos ? place.photos[0].photo_reference : null,
    }));

    return NextResponse.json({ success: true, hotels });
  } catch (error) {
    console.error("Error fetching hotels from Google API:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hotels." },
      { status: 500 }
    );
  }
}
