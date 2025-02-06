// app/api/frontend/destinations/route.js

import { NextResponse } from "next/server";
import { fetchAllDestinations } from "@/app/lib/services/destinations";

export async function GET(request) {
  try {
    const destinations = await fetchAllDestinations();
    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
