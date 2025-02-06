// app/api/accommodations/fetchDetails/route.js

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import axios from "axios";

/**
 * GET /api/accommodations/fetchDetails?placeId=...
 * Fetches detailed accommodation information using Google Places API.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl; // Updated to use request.nextUrl
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      console.error("placeId parameter is required.");
      return NextResponse.json(
        { error: "placeId parameter is required." },
        { status: 400 }
      );
    }

    const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_PLACES_API_KEY) {
      console.error("Google Places API key is not configured.");
      return NextResponse.json(
        { error: "Google Places API key is not configured." },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,website,formatted_phone_number,types,rating,price_level,photos,description&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      console.error("Google Places Details API Error:", response.data.status);
      return NextResponse.json(
        { error: `Google Places Details API Error: ${response.data.status}` },
        { status: 500 }
      );
    }

    const placeDetails = response.data.result;

    // Extract necessary details
    const details = {
      name: placeDetails.name || "",
      address: placeDetails.formatted_address || "",
      website: placeDetails.website || "",
      phoneNumber: placeDetails.formatted_phone_number || "",
      types: placeDetails.types || [],
      rating: placeDetails.rating || null,
      priceLevel: placeDetails.price_level || null,
      description: placeDetails.description || "",
      photos: placeDetails.photos || [],
    };

    return NextResponse.json(
      { placeDetails: details },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching accommodation details:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}