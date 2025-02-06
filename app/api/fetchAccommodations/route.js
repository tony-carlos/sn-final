export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import axios from "axios";

/**
 * GET /api/fetchAccommodations?lat=...&lng=...
 * Fetches accommodations from Google Places API based on latitude and longitude.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    // Log incoming request
    console.log(
      `Received fetchAccommodations request with lat=${lat}, lng=${lng}`
    );

    // Validate parameters
    if (!lat || !lng) {
      console.error("Missing latitude or longitude.");
      return NextResponse.json(
        { error: "Missing latitude or longitude." },
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

    // Parse latitude and longitude
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid latitude or longitude values.");
      return NextResponse.json(
        { error: "Invalid latitude or longitude values." },
        { status: 400 }
      );
    }

    // Fetch accommodations from Google Places API
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: 10000, // 10 km radius
          type: "lodging", // Broad category
          keyword: "hotel,camp,lodge,tent", // Multiple types
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

    // Extract relevant accommodation information
    const accommodations = response.data.results.map((place) => ({
      value: place.place_id,
      label: place.name,
      address: place.vicinity,
      placeId: place.place_id,
      location: place.geometry.location, // { lat, lng }
      types: place.types, // Array of types
      rating: place.rating || null, // Optional: User rating
      userRatingsTotal: place.user_ratings_total || null, // Optional: Total user ratings
      website: null, // Not available in Nearby Search API
      phoneNumber: null, // Not available in Nearby Search API
    }));

    // Log number of accommodations fetched
    console.log(
      `Fetched ${accommodations.length} accommodations from Google Places API.`
    );

    // Check if accommodations were fetched
    if (!accommodations || accommodations.length === 0) {
      console.warn("No accommodations found for the given location.");
      return NextResponse.json(
        { error: "No accommodations found for the given location." },
        { status: 404 }
      );
    }

    return NextResponse.json({ accommodations }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in fetchAccommodations API route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
