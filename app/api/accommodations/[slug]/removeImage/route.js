// app/api/accommodations/[slug]/edit/route.js

import { NextResponse } from "next/server";
import { db, storage } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export async function PUT(request, { params }) {
  try {
    const { slug } = params;

    const formData = await request.formData();

    const name = formData.get("name");
    const slugFromForm = formData.get("slug"); // Ensure slug is part of form data
    const description = formData.get("description");
    const website = formData.get("website");
    const phoneNumber = formData.get("phoneNumber");
    const levelCategory = formData.get("levelCategory");
    const amenities = formData.getAll("amenities"); // Array
    const zone = formData.get("zone");
    const status = formData.get("status");
    const isInPark = formData.get("isInPark") === "true";
    const concessionFeeCategory = formData.get("concessionFeeCategory");
    const concessionFees = formData.getAll("concessionFees"); // Array
    const pricing = formData.get("pricing"); // Assume it's a JSON string
    const images = formData.getAll("images"); // Array of { url, storagePath }
    const seoTitle = formData.get("seoTitle");
    const seoDescription = formData.get("seoDescription");
    const facilities = formData.getAll("facilities"); // Array

    // Validation
    if (!name || !description || !zone) {
      return NextResponse.json(
        { error: "Name, Description, and Zone are required." },
        { status: 400 }
      );
    }

    // Reference to the accommodation document
    const accommodationRef = doc(db, "accommodations", slug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation not found." },
        { status: 404 }
      );
    }

    // Handle image uploads
    const existingImages = accommodationSnap.data().images || [];
    let updatedImages = [...existingImages];

    for (const image of images) {
      if (image instanceof File) {
        const storageRef = ref(storage, `accommodations/${slug}/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              updatedImages.push({ url: downloadURL, storagePath: storageRef.fullPath });
              resolve();
            }
          );
        });
      }
    }

    // Update the accommodation document
    await setDoc(accommodationRef, {
      name,
      slug: slugFromForm || slug,
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
      pricing: JSON.parse(pricing),
      images: updatedImages,
      seo: { title: seoTitle, description: seoDescription },
      facilities,
      updatedAt: new Date(),
    }, { merge: true });

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
