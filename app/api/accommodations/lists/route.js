// app/api/destinations/lists/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET(request) {
  try {
    const destinationsRef = collection(db, "destinations");
    const destinationsQuery = query(destinationsRef, orderBy("title", "asc")); // Order alphabetically
    const snapshot = await getDocs(destinationsQuery);

    const destinations = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      coordinates: doc.data().coordinates, // { lat, lng }
    }));

    return NextResponse.json(
      { destinations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
