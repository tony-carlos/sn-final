// app/api/accommodations/delete/[slug]/route.js

import { NextResponse } from "next/server";
import { db, storage } from "@/app/lib/firebase";

async function deleteSubcollections(docRef) {
  const subcollections = await docRef.listCollections();

  for (const subcol of subcollections) {
    const subcolSnapshot = await subcol.get();
    for (const docSnap of subcolSnapshot.docs) {
      const nestedDocRef = db.collection(subcol.path).doc(docSnap.id);
      await deleteSubcollections(nestedDocRef);
      await nestedDocRef.delete();
      console.log(
        `Deleted document ${docSnap.id} from subcollection ${subcol.id}`
      );
    }
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Accommodation slug is required." },
        { status: 400 }
      );
    }

    const accommodationRef = db.collection("accommodations").doc(slug);
    const accommodationSnap = await accommodationRef.get();

    if (!accommodationSnap.exists) {
      return NextResponse.json(
        { error: "Accommodation not found." },
        { status: 404 }
      );
    }

    const accommodationData = accommodationSnap.data();

    // Delete associated images from Firebase Storage if storage is initialized
    if (
      storage &&
      accommodationData.images &&
      accommodationData.images.length > 0
    ) {
      for (const image of accommodationData.images) {
        if (image.storagePath) {
          try {
            await storage.file(image.storagePath).delete();
            console.log(`Deleted image at path: ${image.storagePath}`);
          } catch (imageError) {
            console.error(
              `Error deleting image at path ${image.storagePath}:`,
              imageError
            );
          }
        }
      }
    }

    await deleteSubcollections(accommodationRef);
    await accommodationRef.delete();
    console.log(`Deleted accommodation document: ${slug}`);

    return NextResponse.json(
      {
        message: "Accommodation and all associated data deleted successfully.",
      },
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

export const runtime = "nodejs";
