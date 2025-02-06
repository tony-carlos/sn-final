// app/api/accommodations/get/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "slug parameter is required." },
      { status: 400 }
    );
  }

  try {
    const accommodationRef = doc(db, "accommodations", slug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation not found." },
        { status: 404 }
      );
    }

    const accommodation = accommodationSnap.data();

    return NextResponse.json({ accommodation }, { status: 200 });
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
