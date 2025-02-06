// app/api/accommodations/fetchPlaceDetails/route.js

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import axios from "axios";

/**
 * GET /api/accommodations/fetchPlaceDetails?placeId=...
 * Fetches detailed information for a specific place using Google Places API.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl; // Updated to use request.nextUrl
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      console.error("Missing placeId parameter.");
      return NextResponse.json(
        { error: "placeId parameter is required." },
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

    // Define the fields you want to retrieve
    const fields =
      "name,website,formatted_phone_number,rating,price_level,formatted_address,photos,types,description";

    // Construct the Google Places API URL
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

    // Make the API request
    const response = await axios.get(googleApiUrl);

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

    // Extract place details
    const placeDetails = response.data.result;

    return NextResponse.json(
      { placeDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}