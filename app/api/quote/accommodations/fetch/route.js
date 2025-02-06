// /app/api/quote/accommodations/fetch/route.js

import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function POST(request) {
  try {
    const { destinationIds } = await request.json();

    if (
      !destinationIds ||
      !Array.isArray(destinationIds) ||
      destinationIds.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid destination IDs" },
        { status: 400 }
      );
    }

    // Firestore's 'in' operator can handle up to 10 values
    const batchSize = 10;
    let accommodationsList = [];

    for (let i = 0; i < destinationIds.length; i += batchSize) {
      const batch = destinationIds.slice(i, i + batchSize);
      const accommodationsCol = collection(db, "accommodations");
      const q = query(accommodationsCol, where("destinationId", "in", batch));
      const accommodationsSnapshot = await getDocs(q);
      const batchList = accommodationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      accommodationsList = accommodationsList.concat(batchList);
    }

    return NextResponse.json(accommodationsList, { status: 200 });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
