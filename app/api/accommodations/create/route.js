// app/api/accommodations/create.js
export const runtime = "edge"; // <-- Add this at the top

export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { slugify } from "@/app/lib/helpers";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
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
    } = data;

    // Validate required fields
    if (!name || !destinationId) {
      return NextResponse.json(
        { error: "Name and Destination are required." },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = slugify(name);

    // Check if accommodation with the slug already exists
    const accommodationRef = doc(db, "accommodations", slug);
    const accommodationSnap = await getDoc(accommodationRef);
    if (accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "An accommodation with this name already exists." },
        { status: 400 }
      );
    }

    // Additionally, check if any accommodation has the same name (case-insensitive)
    const accommodationsCol = collection(db, "accommodations");
    const qQuery = query(accommodationsCol, where("name_lowercase", "==", name.toLowerCase()));
    const snapshot = await getDocs(qQuery);
    if (!snapshot.empty) {
      return NextResponse.json(
        { error: "An accommodation with this name already exists." },
        { status: 400 }
      );
    }

    // Create accommodation document
    await setDoc(accommodationRef, {
      name,
      name_lowercase: name.toLowerCase(), // For case-insensitive search
      slug,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Accommodation created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating accommodation:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
