// app/api/frontend/accommodations/[slug]/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { fetchAccommodationBySlug } from "@/app/lib/services/accommodations";

export async function GET(request, { params }) {
  const { slug } = params;
  try {
    const accommodation = await fetchAccommodationBySlug(slug);
    return NextResponse.json(accommodation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
