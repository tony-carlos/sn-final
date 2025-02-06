export const dynamic = 'force-dynamic'; 
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required." },
        { status: 400 }
      );
    }

    const accommodationsCol = collection(db, "accommodations");
    const q = query(
      accommodationsCol,
      where("name_lowercase", "==", name.toLowerCase())
    );
    const snapshot = await getDocs(q);

    return NextResponse.json({ exists: !snapshot.empty }, { status: 200 });
  } catch (error) {
    console.error("Error checking accommodation name:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}