// app/api/accommodations/delete/route.js

import { NextResponse } from "next/server";
import { db, storage } from "@/app/lib/firebase"; // Adjust as per your project structure
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "slug parameter is required." },
        { status: 400 }
      );
    }

    const accommodationRef = doc(db, "accommodations", slug);
    const accommodationSnap = await getDoc(accommodationRef);

    if (!accommodationSnap.exists()) {
      return NextResponse.json(
        { error: "Accommodation does not exist." },
        { status: 404 }
      );
    }

    const accommodationData = accommodationSnap.data();

    // Delete images from Firebase Storage
    if (accommodationData.images && accommodationData.images.length > 0) {
      const deletePromises = accommodationData.images.map((img) => {
        const imageRef = ref(storage, img.storagePath);
        return deleteObject(imageRef).catch((error) => {
          console.error(`Error deleting image at ${img.storagePath}:`, error);
        });
      });
      await Promise.all(deletePromises);
    }

    // Delete accommodation document from Firestore
    await deleteDoc(accommodationRef);

    return NextResponse.json(
      { message: "Accommodation deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
