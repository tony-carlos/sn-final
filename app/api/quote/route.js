// /app/api/quote/route.js

import { NextResponse } from "next/server";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Adjust the import path if necessary

export async function GET() {
  try {
    const quotesCol = collection(db, "quotes");
    const quotesSnapshot = await getDocs(quotesCol);
    const quotesList = quotesSnapshot.docs.map((doc) => ({
      slug: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(quotesList, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const quotesCol = collection(db, "quotes");
    const docRef = await addDoc(quotesCol, data);
    return NextResponse.json({ slug: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
