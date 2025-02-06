// app/api/editaccommodations/checkSlug/route.js

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase"; // Adjust the import path if necessary
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * GET /api/editaccommodations/checkSlug?slug=...
 * Checks if a slug is unique for accommodations.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl; // Updated to use request.nextUrl
    const slug = searchParams.get("slug");

    if (!slug) {
      console.error("Missing slug parameter.");
      return NextResponse.json(
        { error: "slug parameter is required." },
        { status: 400 }
      );
    }

    const accommodationsRef = collection(db, "accommodations");
    const q = query(accommodationsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    const exists = !snapshot.empty;

    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}