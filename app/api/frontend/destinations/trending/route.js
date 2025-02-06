// app/api/frontend/destinations/trending/route.js

import { NextResponse } from "next/server";
import { fetchTrendingDestinations } from "@/app/lib/services/destinations";

export async function GET(request) {
  try {
    const destinations = await fetchTrendingDestinations();

    // Only return published destinations
    const publishedDestinations = destinations.filter(
      (dest) => dest.status === "publish"
    );

    return NextResponse.json({ data: publishedDestinations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trending destinations:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
