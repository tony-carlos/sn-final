import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";

// Utility function to generate slug from name
const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * GET: Returns accommodation data by slug.
 */
export async function GET(request, { params }) {
  try {
    const currentSlug = params.slug; // Slug from the URL
    console.log(`GET request for accommodation with slug: "${currentSlug}"`);

    const accommodationRef = doc(db, "accommodations", currentSlug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation does not exist." },
        { status: 404 }
      );
    }

    const accommodationData = accommodationSnap.data();
    return NextResponse.json(
      { accommodation: { ...accommodationData, id: accommodationSnap.id } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodation." },
      { status: 500 }
    );
  }
}

/**
 * PUT: Updates accommodation data. If the slug changed, rename the doc in Firestore.
 */
export async function PUT(request, { params }) {
  try {
    const currentSlug = params.slug;
    console.log(`PUT request for accommodation with slug: "${currentSlug}"`);

    const accommodationRef = doc(db, "accommodations", currentSlug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation does not exist." },
        { status: 404 }
      );
    }

    const accommodationData = await request.json();
    console.log("Received PUT data:", accommodationData);

    // Validate required fields
    const requiredFields = ["name", "slug"];
    for (const field of requiredFields) {
      if (
        !accommodationData[field] ||
        typeof accommodationData[field] !== "string" ||
        accommodationData[field].trim() === ""
      ) {
        return NextResponse.json(
          { error: `Missing or invalid required field: "${field}"` },
          { status: 400 }
        );
      }
    }

    // Normalize slug
    const newSlug = slugify(accommodationData.slug);
    if (!newSlug) {
      return NextResponse.json(
        { error: "Invalid slug generated from the provided name." },
        { status: 400 }
      );
    }

    // Check if slug has changed
    const slugChanged = newSlug !== currentSlug;
    console.log(`Slug changed: ${slugChanged}`);

    if (slugChanged) {
      // Check if new slug already exists
      const newAccommodationRef = doc(db, "accommodations", newSlug);
      const newAccommodationSnap = await getDoc(newAccommodationRef);
      if (newAccommodationSnap.exists()) {
        return NextResponse.json(
          { error: "Accommodation with the new slug already exists." },
          { status: 400 }
        );
      }

      // Perform a transaction to rename the document
      await runTransaction(db, async (transaction) => {
        const currentDoc = await transaction.get(accommodationRef);
        if (!currentDoc.exists()) {
          throw new Error("Accommodation does not exist.");
        }

        const newDoc = await transaction.get(newAccommodationRef);
        if (newDoc.exists()) {
          throw new Error("Accommodation with the new slug already exists.");
        }

        // Create new document with new slug
        transaction.set(newAccommodationRef, accommodationData);

        // Delete old document
        transaction.delete(accommodationRef);
      });

      console.log(
        `Accommodation slug updated from "${currentSlug}" to "${newSlug}".`
      );
      return NextResponse.json(
        {
          message: "Accommodation updated successfully with new slug.",
          newSlug,
        },
        { status: 200 }
      );
    } else {
      // Slug hasn't changed; simply update the existing doc
      await updateDoc(accommodationRef, accommodationData);
      console.log(`Accommodation "${currentSlug}" updated successfully.`);
      return NextResponse.json(
        { message: "Accommodation updated successfully." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating accommodation:", error);

    let errorMessage = "Failed to update accommodation.";
    let statusCode = 500;

    if (error.message.includes("already exists")) {
      errorMessage = "Accommodation with the new slug already exists.";
      statusCode = 400;
    } else if (error.message.includes("does not exist")) {
      errorMessage = "Accommodation does not exist.";
      statusCode = 404;
    } else if (error.message.includes("Invalid")) {
      errorMessage = error.message;
      statusCode = 400;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
