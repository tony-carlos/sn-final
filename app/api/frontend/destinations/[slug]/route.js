// app/api/frontend/destinations/[slug]/route.js

import { NextResponse } from "next/server";
import { fetchDestinationBySlug } from "@/app/lib/services/destinations"; // Ensure correct path

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const destination = await fetchDestinationBySlug(slug);
    return NextResponse.json(destination, { status: 200 });
  } catch (error) {
    console.error(`Error fetching destination with slug (${slug}):`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch destination." },
      { status: 500 }
    );
  }
}
