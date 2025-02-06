// app/api/frontend/accommodations/route.js
export const runtime = "edge"; // <-- Add this at the top

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import { fetchAllAccommodations, fetchAccommodationsByDestinationSlug } from "@/app/lib/services/accommodations"; // Adjust the import path as necessary

/**
 * GET /api/frontend/accommodations?destinationSlug=...
 * Fetches all accommodations or filters them by destination slug.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl; // Updated to use request.nextUrl
    const destinationSlug = searchParams.get("destinationSlug");

    let accommodations;

    if (destinationSlug) {
      accommodations = await fetchAccommodationsByDestinationSlug(destinationSlug);
    } else {
      accommodations = await fetchAllAccommodations();
    }

    return NextResponse.json(accommodations, { status: 200 });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}