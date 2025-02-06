// app/api/frontend/destinations/published/route.js

import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Adjust the path based on your project structure

export async function GET(request) {
  try {
    const destinationsRef = collection(db, "destinations"); // Ensure your collection is named 'destinations'
    const q = query(destinationsRef, where("status", "==", "published"));
    const snapshot = await getDocs(q);

    const publishedDestinations = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        images: data.images || [], // Array of { storagePath, url }
        title: data.title || "Unnamed Destination",
        tourCount: data.tourCount || 0, // Ensure this field exists or calculate as needed
      };
    });

    return NextResponse.json(publishedDestinations, { status: 200 });
  } catch (error) {
    console.error("Error fetching published destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch published destinations." },
      { status: 500 }
    );
  }
}
