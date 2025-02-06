// app/api/unsubscribe/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

/**
 * GET /api/unsubscribe
 *
 * Unsubscribes a user based on their email.
 *
 * @param {Request} request
 * @returns {Response}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required." },
      { status: 400 }
    );
  }

  try {
    // Query for the subscriber
    const subscribersRef = collection(db, "subscribers");
    const q = query(subscribersRef, where("email", "==", email));
    const subscribersSnapshot = await getDocs(q);

    if (subscribersSnapshot.empty) {
      return NextResponse.json(
        { message: "Subscriber not found." },
        { status: 404 }
      );
    }

    // Delete the subscriber
    subscribersSnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "subscribers", docSnap.id));
    });

    return NextResponse.json(
      { message: "You have been unsubscribed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { message: "Failed to unsubscribe." },
      { status: 500 }
    );
  }
}
