// app/api/accommodations/edit/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import { db, storage } from "@/app/lib/firebase";
import { doc, updateDoc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { slugify } from "@/app/lib/helpers";
import { ref, deleteObject } from "firebase/storage";

export async function PUT(request) {
  try {
    const data = await request.json();

    const {
      originalSlug, // The original slug before editing
      name,
      destinationId,
      title,
      status,
      images, // Array of { url, storagePath }
      description,
      website,
      phoneNumber,
      levelCategory,
      amenities,
      zone,
      isInPark,
      concessionFeeCategory,
      concessionFees,
      pricing,
      facilities,
      seo,
      address,
    } = data;

    // Validate required fields
    if (!originalSlug || !name || !destinationId) {
      return NextResponse.json(
        { error: "Original Slug, Name, and Destination are required." },
        { status: 400 }
      );
    }

    // Generate new slug from the updated name
    const newSlug = slugify(name);

    // Reference to the original accommodation document
    const accommodationRef = doc(db, "accommodations", originalSlug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation does not exist." },
        { status: 404 }
      );
    }

    // If the name has changed, ensure the new slug is unique
    if (originalSlug !== newSlug) {
      const accommodationsCol = collection(db, "accommodations");
      const q = query(accommodationsCol, where("slug", "==", newSlug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return NextResponse.json(
          { error: "An accommodation with the new name already exists." },
          { status: 400 }
        );
      }

      // Rename the document by creating a new one and deleting the old
      await setDoc(doc(db, "accommodations", newSlug), {
        name,
        name_lowercase: name.toLowerCase(),
        slug: newSlug,
        destinationId,
        title,
        status: status || "Draft",
        images: images || [],
        description: description || "",
        website: website || "",
        phoneNumber: phoneNumber || "",
        levelCategory: levelCategory || "",
        amenities: amenities || [],
        zone: zone || "",
        isInPark: isInPark || false,
        concessionFeeCategory: isInPark ? concessionFeeCategory : null,
        concessionFees: isInPark ? concessionFees : [],
        pricing: pricing || { high_season: { categories: [] }, low_season: { categories: [] } },
        facilities: facilities || [],
        seo: seo || { title: "", description: "" },
        address: address || "",
        createdAt: accommodationSnap.data().createdAt, // Preserve original creation date
        updatedAt: new Date().toISOString(),
      });

      // Delete the old document
      await deleteDoc(accommodationRef);
    } else {
      // If slug hasn't changed, simply update the document
      await updateDoc(accommodationRef, {
        name,
        name_lowercase: name.toLowerCase(),
        destinationId,
        title,
        status: status || "Draft",
        images: images || [],
        description: description || "",
        website: website || "",
        phoneNumber: phoneNumber || "",
        levelCategory: levelCategory || "",
        amenities: amenities || [],
        zone: zone || "",
        isInPark: isInPark || false,
        concessionFeeCategory: isInPark ? concessionFeeCategory : null,
        concessionFees: isInPark ? concessionFees : [],
        pricing: pricing || { high_season: { categories: [] }, low_season: { categories: [] } },
        facilities: facilities || [],
        seo: seo || { title: "", description: "" },
        address: address || "",
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { message: "Accommodation updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error editing accommodation:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
