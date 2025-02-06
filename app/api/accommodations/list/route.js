// app/api/accommodations/list/route.js

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase"; // Adjust the import path if necessary
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

/**
 * GET /api/accommodations/list?status=...&limit=...&last=...
 * Lists accommodations with optional filtering by status and pagination.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl; // Updated to use request.nextUrl
    const status = searchParams.get("status") || "All";
    const limitNum = parseInt(searchParams.get("limit"), 10) || 10;
    const last = searchParams.get("last"); // ISO string of last createdAt

    const accommodationsRef = collection(db, "accommodations");

    const constraints = [];

    // Apply status filter if not "All"
    if (status !== "All") {
      constraints.push(where("status", "==", status));
    }

    // Order by createdAt descending
    constraints.push(orderBy("createdAt", "desc"));

    // Apply pagination if 'last' is provided
    if (last) {
      const lastDate = new Date(last);
      if (isNaN(lastDate)) {
        console.error(
          "Invalid 'last' parameter. It should be a valid date string."
        );
        return NextResponse.json(
          {
            error:
              "Invalid 'last' parameter. It should be a valid date string.",
          },
          { status: 400 }
        );
      }
      constraints.push(startAfter(lastDate));
    }

    // Limit the results
    constraints.push(limit(limitNum));

    // Construct the query
    const accommodationsQuery = query(accommodationsRef, ...constraints);

    // Execute the query
    const snapshot = await getDocs(accommodationsQuery);

    // Map the results
    const accommodations = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        slug: doc.id,
        ...data,
        facilities: data.facilities ? data.facilities.filter(Boolean) : [],
      };
    });

    // Determine the cursor for the next page
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastDoc
      ? lastDoc.data().createdAt.toDate().toISOString()
      : null;

    // Determine if there's a next page
    let hasNextPage = false;
    if (lastDoc) {
      const nextQueryConstraints = [];

      // Re-apply status filter if necessary
      if (status !== "All") {
        nextQueryConstraints.push(where("status", "==", status));
      }

      // Re-apply ordering
      nextQueryConstraints.push(orderBy("createdAt", "desc"));

      // Start after the last document's createdAt
      nextQueryConstraints.push(startAfter(lastDoc.data().createdAt.toDate()));

      // Check if at least one more document exists
      nextQueryConstraints.push(limit(1));

      const nextQuery = query(accommodationsRef, ...nextQueryConstraints);
      const nextSnapshot = await getDocs(nextQuery);
      if (!nextSnapshot.empty) {
        hasNextPage = true;
      }
    }

    return NextResponse.json(
      {
        accommodations,
        nextCursor: nextCursor || null,
        hasNextPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listing accommodations:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}