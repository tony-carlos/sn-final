// app/api/travel-guides/route.js
export const runtime = "edge"; // <-- Add this at the top

export const dynamic = 'force-dynamic'; // Must be the first line

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * GET /api/travel-guides
 * Fetches all travel guides from Firestore.
 */
export async function GET(request) {
  try {
    const travelGuidesCol = collection(db, "travel-guides");
    const snapshot = await getDocs(travelGuidesCol);

    const travelGuides = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ travelGuides }, { status: 200 });
  } catch (error) {
    console.error("Error fetching travel guides:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}