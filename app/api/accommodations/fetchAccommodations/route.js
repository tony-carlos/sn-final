export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and Longitude are required." },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude values." },
        { status: 400 }
      );
    }

    // Fetch accommodations with exact lat and lng
    const colRef = collection(db, "accommodations");
    const q = query(
      colRef,
      where("location.lat", "==", latitude),
      where("location.lng", "==", longitude)
    );
    const snapshot = await getDocs(q);

    const accommodations = snapshot.docs.map((doc) => ({
      value: doc.id,
      label: doc.data().name,
      placeId: doc.data().placeId || null,
      address: doc.data().address || "",
      location: doc.data().location || { lat: 0, lng: 0 },
      types: doc.data().types || [],
      rating: doc.data().rating || null,
      userRatingsTotal: doc.data().userRatingsTotal || null,
      website: doc.data().website || "",
      phoneNumber: doc.data().phoneNumber || "",
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
