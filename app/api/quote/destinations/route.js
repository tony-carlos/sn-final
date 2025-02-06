// /app/api/quote/destinations/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function GET() {
  try {
    const destinationsCol = collection(db, "destinations");
    const destinationsSnapshot = await getDocs(destinationsCol);
    const destinationsList = destinationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(destinationsList, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
