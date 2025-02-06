// app/api/destinations/fetch/route.js
export const runtime = "edge"; // <-- Add this at the top

export const dynamic = "force-dynamic"; // Ensures dynamic rendering

import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Adjust the import path as needed

/**
 * GET /api/destinations/fetch
 * Fetches all destinations from Firestore.
 */
export async function GET(request) {
  try {
    console.log("Fetching destinations from Firestore...");
    const destinationsRef = collection(db, "destinations");
    const snapshot = await getDocs(destinationsRef);

    const destinations = snapshot.docs.map((doc) => ({
      value: doc.id,
      label: doc.data().title,
      coordinates: doc.data().coordinates,
    }));


    return NextResponse.json({ destinations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations." },
      { status: 500 }
    );
  }
}
