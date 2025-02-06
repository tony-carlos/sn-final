// /app/api/tour-packages/[slug]/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase'; // Adjust the import path as necessary
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

/**
 * GET handler to fetch a single tour package by slug.
 *
 * Route Parameters:
 * - slug: The unique slug of the tour package
 */
export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const q = query(
      collection(db, 'tourPackages'),
      where('basicInfo.slug', '==', slug)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Tour package not found' },
        { status: 404 }
      );
    }

    const tourPackage = querySnapshot.docs[0];
    return NextResponse.json(
      { tourPackage: { id: tourPackage.id, ...tourPackage.data() } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tour package by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour package' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler to update a tour package by slug.
 *
 * Route Parameters:
 * - slug: The unique slug of the tour package
 *
 * Expects the request body to contain the updated tour package data.
 */
export async function PUT(request, { params }) {
  const { slug: originalSlug } = params;

  try {
    const updatedData = await request.json();

    // Validate required fields if necessary
    if (!updatedData.basicInfo || !updatedData.basicInfo.tourTitle) {
      return NextResponse.json(
        { error: 'Tour Title is required.' },
        { status: 400 }
      );
    }

    // Find the document by original slug
    const q = query(
      collection(db, 'tourPackages'),
      where('basicInfo.slug', '==', originalSlug)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Tour package not found' },
        { status: 404 }
      );
    }

    const tourDoc = querySnapshot.docs[0];
    const tourRef = doc(db, 'tourPackages', tourDoc.id);

    const existingData = tourDoc.data();

    // Determine the new slug
    const newSlug = updatedData.basicInfo.slug
      ? updatedData.basicInfo.slug
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove non-word characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
      : existingData.basicInfo.slug;

    // Check if the new slug is different from the original slug
    if (newSlug !== originalSlug) {
      // Check if the new slug already exists
      const slugCheckQuery = query(
        collection(db, 'tourPackages'),
        where('basicInfo.slug', '==', newSlug)
      );
      const slugCheckSnapshot = await getDocs(slugCheckQuery);

      if (!slugCheckSnapshot.empty) {
        return NextResponse.json(
          {
            error:
              'The new slug is already in use. Please choose a different title.',
          },
          { status: 400 }
        );
      }
    }

    // Merge basicInfo, ensuring the slug is updated if provided
    const mergedBasicInfo = {
      ...existingData.basicInfo, // Preserve existing basicInfo fields
      ...updatedData.basicInfo, // Overwrite with updated basicInfo fields
      slug: newSlug, // Update slug to the new value
    };

    // Handle the images field
    // If images are being updated (i.e., provided in updatedData), use them
    // Otherwise, preserve existing images
    const mergedImages =
      updatedData.images !== undefined
        ? updatedData.images
        : existingData.images;

    // Validate that 'images' is an array of objects with 'url' and 'storagePath'
    if (
      !Array.isArray(mergedImages) ||
      !mergedImages.every(
        (img) =>
          img &&
          typeof img === 'object' &&
          typeof img.url === 'string' &&
          typeof img.storagePath === 'string'
      )
    ) {
      return NextResponse.json(
        { error: 'Images must be an array of objects with url and storagePath.' },
        { status: 400 }
      );
    }

    // Construct the merged data object
    const mergedData = {
      ...updatedData,
      basicInfo: mergedBasicInfo,
      images: mergedImages,
      updatedAt: new Date(), // Optionally, set updatedAt timestamp
    };

    // Optional: Further Validations
    // Ensure that other fields meet your requirements

    // Update the document in Firestore
    await updateDoc(tourRef, mergedData);

    return NextResponse.json(
      { message: 'Tour package updated successfully', newSlug },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating tour package:', error);
    return NextResponse.json(
      { error: 'Failed to update tour package' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to delete a tour package by slug.
 *
 * Route Parameters:
 * - slug: The unique slug of the tour package
 */
export async function DELETE(request, { params }) {
  const { slug } = params;

  try {
    const q = query(
      collection(db, 'tourPackages'),
      where('basicInfo.slug', '==', slug)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Tour package not found' },
        { status: 404 }
      );
    }

    const tourDoc = querySnapshot.docs[0];
    const tourRef = doc(db, 'tourPackages', tourDoc.id);

    await deleteDoc(tourRef);

    return NextResponse.json(
      { message: 'Tour package deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tour package:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour package' },
      { status: 500 }
    );
  }
}
