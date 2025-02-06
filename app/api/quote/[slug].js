// /app/api/quote/[slug]/route.js

import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const quoteRef = doc(db, "quotes", slug);
    const quoteSnap = await getDoc(quoteRef);

    if (!quoteSnap.exists()) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(quoteSnap.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}
