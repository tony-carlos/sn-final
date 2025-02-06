// app/api/accommodations/edit.js

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { slugify } from "@/app/lib/helpers";

export async function PUT(request) {
  try {
    const data = await request.json();

    const {
      slug, // Current slug of the accommodation
      name,
      destinationId,
      title,
      status,
      images,
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
    } = data;

    // Validate required fields
    if (!slug || !name || !destinationId) {
      return NextResponse.json(
        { error: "Slug, Name, and Destination are required." },
        { status: 400 }
      );
    }

    // Generate new slug
    const newSlug = slugify(name);

    // Reference to the current accommodation document
    const accommodationRef = doc(db, "accommodations", slug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation does not exist." },
        { status: 404 }
      );
    }

    // If slug has changed, check for uniqueness and rename
    if (newSlug !== slug) {
      const newAccommodationRef = doc(db, "accommodations", newSlug);
      const newAccommodationSnap = await getDoc(newAccommodationRef);

      if (newAccommodationSnap.exists()) {
        return NextResponse.json(
          { error: "An accommodation with the new name already exists." },
          { status: 400 }
        );
      }

      // Create a new document with the new slug
      await setDoc(newAccommodationRef, {
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
        pricing: pricing || {
          high_season: { categories: [] },
          low_season: { categories: [] },
        },
        facilities: facilities || [],
        seo: seo || { title: "", description: "" },
        createdAt:
          accommodationSnap.data().createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Delete the old document
      await deleteDoc(accommodationRef);
    } else {
      // Update the existing document
      await setDoc(
        accommodationRef,
        {
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
          pricing: pricing || {
            high_season: { categories: [] },
            low_season: { categories: [] },
          },
          facilities: facilities || [],
          seo: seo || { title: "", description: "" },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
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
