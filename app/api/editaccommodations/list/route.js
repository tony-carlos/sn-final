// app/api/editaccommodations/list/route.js

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * GET /api/editaccommodations/list
 * 
 * Fetches a list of all accommodations.
 * 
 * Response:
 * - 200: { accommodations: [ ... ] }
 * - 500: { error: "Failed to fetch accommodations." }
 */
export async function GET() {
  try {
    const accommodationsRef = collection(db, "accommodations");
    const snapshot = await getDocs(accommodationsRef);
    const accommodations = snapshot.docs.map((doc) => ({
      slug: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ accommodations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodations." },
      { status: 500 }
    );
  }
}
