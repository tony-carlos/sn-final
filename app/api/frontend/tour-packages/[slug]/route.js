// /app/api/frontend/tour-packages/[slug]/route.js

import { NextResponse } from "next/server";
import { fetchTourPackageBySlug } from "@/app/lib/services/tourPackages";

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const tourPackage = await fetchTourPackageBySlug(slug);

    if (!tourPackage) {
      return NextResponse.json(
        { error: "Tour package not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(tourPackage, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}