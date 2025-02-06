// app/api/frontend/destinations/all/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { fetchAllDestinations } from "@/app/lib/services/destinations"; // Ensure correct path

export async function GET(request) {
  try {
    const destinations = await fetchAllDestinations();
    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error("Error fetching all destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations." },
      { status: 500 }
    );
  }
}
