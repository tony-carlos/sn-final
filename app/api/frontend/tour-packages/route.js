// app/api/frontend/tour-packages/route.js

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import { getFilteredTourPackages } from "@/app/lib/services/tourPackages"; // Adjust the import path as necessary

/**
 * GET /api/frontend/tour-packages?filter1=value1&filter2=value2&...
 * Fetches tour packages based on provided filters.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl; // Updated to use request.nextUrl

    // Extract filter parameters from query string
    const filters = {
      isFeatured: searchParams.has("isFeatured")
        ? searchParams.get("isFeatured") === "true"
        : undefined,
      isRecommended: searchParams.has("isRecommended")
        ? searchParams.get("isRecommended") === "true"
        : undefined,
      isSpecialPackage: searchParams.has("isSpecialPackage")
        ? searchParams.get("isSpecialPackage") === "true"
        : undefined,
      isDayTrip: searchParams.has("isDayTrip")
        ? searchParams.get("isDayTrip") === "true"
        : undefined,
      isOffer: searchParams.has("isOffer")
        ? searchParams.get("isOffer") === "true"
        : undefined,
      tags: searchParams.has("tags")
        ? searchParams.get("tags").split(",")
        : undefined,
      mainFocusSlugs: searchParams.has("mainFocusSlugs")
        ? searchParams.get("mainFocusSlugs").split(",")
        : undefined,
      priceMin: searchParams.has("priceMin")
        ? Number(searchParams.get("priceMin"))
        : undefined,
      priceMax: searchParams.has("priceMax")
        ? Number(searchParams.get("priceMax"))
        : undefined,
      type: searchParams.has("type") ? searchParams.get("type") : undefined,
      destinations: searchParams.has("destinations")
        ? searchParams.get("destinations").split(",")
        : undefined,
    };

    // Optional: Implement authentication or authorization here
    // Example: Verify API key or user token

    // Fetch filtered tour packages using the service layer
    const tourPackages = await getFilteredTourPackages(filters);

    // Return the response
    return NextResponse.json({ data: tourPackages }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/frontend/tour-packages:", error);

    const responseBody =
      process.env.NODE_ENV === "development"
        ? { error: "Internal Server Error", details: error.message }
        : { error: "Internal Server Error" };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
