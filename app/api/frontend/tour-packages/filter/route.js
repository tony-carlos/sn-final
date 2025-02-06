// app/api/frontend/tour-packages/filter/route.js

import { NextResponse } from "next/server";
import { fetchFilteredTourPackages } from "@/app/lib/services/tourPackages";

export async function POST(request) {
  try {
    const filters = await request.json();
    const filteredTourPackages = await fetchFilteredTourPackages(filters);
    return NextResponse.json(filteredTourPackages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
