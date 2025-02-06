export const dynamic = "force-dynamic"; // Must be the first line


import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextURL } from "next/dist/server/web/next-url"; // Import NextURL

export async function GET(request) {
  try {
    // Use NextURL to handle the URL parsing and query parameters
    const url = new NextURL(request.url);
    const slug = url.searchParams.get("slug");
    const currentSlug = url.searchParams.get("currentSlug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Get reference to the accommodations collection in Firebase
    const accommodationsRef = collection(db, "accommodations");

    // Query to check if a document with the same 'slug' exists
    const q = query(accommodationsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    let exists = false;
    querySnapshot.forEach((docSnap) => {
      // Exclude the current document if currentSlug is provided
      if (currentSlug && docSnap.id !== currentSlug) {
        exists = true;
      } else if (!currentSlug) {
        exists = true;
      }
    });

    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
