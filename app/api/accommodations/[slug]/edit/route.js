// app/api/accommodations/[slug]/edit/route.js

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { slugify } from "@/app/lib/helpers";

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const data = await request.json();

    const accommodationRef = doc(db, "accommodations", slug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation not found." },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      website,
      phoneNumber,
      levelCategory,
      amenities,
      zone,
      status,
      isInPark,
      concessionFeeCategory,
      concessionFees,
      pricing,
      images, // Array of { url, storagePath }
      seo,
      facilities,
      // ... other fields
    } = data;

    // Generate new slug if name has changed
    const newSlug = slugify(name);

    // If slug has changed and is different, handle renaming (optional)
    if (newSlug !== slug) {
      // Check if new slug already exists
      const newAccommodationRef = doc(db, "accommodations", newSlug);
      const newAccommodationSnap = await getDoc(newAccommodationRef);
      if (newAccommodationSnap.exists()) {
        return NextResponse.json(
          { error: "An accommodation with the new name already exists." },
          { status: 400 }
        );
      }

      // Rename document: Create a new document and delete the old one
      await setDoc(newAccommodationRef, { ...data, slug: newSlug, updatedAt: new Date().toISOString() });
      await deleteDoc(accommodationRef);
    } else {
      // Update existing accommodation
      await setDoc(accommodationRef, {
        name,
        slug: newSlug,
        description,
        website,
        phoneNumber,
        levelCategory,
        amenities,
        zone,
        status,
        isInPark,
        concessionFeeCategory,
        concessionFees,
        pricing,
        images: images || [],
        seo,
        facilities,
        updatedAt: new Date().toISOString(),
        // ... other fields
      }, { merge: true });
    }

    return NextResponse.json(
      { message: "Accommodation updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating accommodation:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
