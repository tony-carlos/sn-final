// app/api/accommodations/deleteImage/route.js

import { NextResponse } from "next/server";
import { storage } from "@/app/lib/firebase";
import { ref, deleteObject } from "firebase/storage";

export async function DELETE(request) {
  try {
    const { storagePath } = await request.json();

    if (!storagePath) {
      return NextResponse.json(
        { error: "Storage path is required." },
        { status: 400 }
      );
    }

    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);

    return NextResponse.json(
      { message: "Image deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image." },
      { status: 500 }
    );
  }
}
