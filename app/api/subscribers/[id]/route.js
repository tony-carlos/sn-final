// app/api/subscribers/[id]/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

/**
 * DELETE /api/subscribers/:id
 *
 * Deletes a subscriber by ID.
 *
 * @param {Request} request
 * @param {Object} params
 * @param {string} params.id - ID of the subscriber to delete.
 * @returns {Response}
 */
export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Subscriber ID is required." },
      { status: 400 }
    );
  }

  try {
    const subscriberRef = doc(db, "subscribers", id);
    await deleteDoc(subscriberRef);
    return NextResponse.json({ message: "Subscriber deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { message: "Failed to delete subscriber." },
      { status: 500 }
    );
  }
}
