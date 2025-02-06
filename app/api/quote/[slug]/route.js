// /app/api/quote/[slug]/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Adjust the import path if necessary

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const quoteDocRef = doc(db, "quotes", slug);
    const quoteSnapshot = await getDoc(quoteDocRef);

    if (quoteSnapshot.exists()) {
      return NextResponse.json(quoteSnapshot.data(), { status: 200 });
    } else {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { slug } = params;

  try {
    const data = await request.json();
    const quoteDocRef = doc(db, "quotes", slug);
    await updateDoc(quoteDocRef, data);
    return NextResponse.json({ message: "Quote updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
