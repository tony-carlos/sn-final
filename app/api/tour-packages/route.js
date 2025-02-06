// /app/api/tour-packages/route.js

import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase'; // Adjust the import path as necessary
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import generateSlug from '@/app/utils/generateSlug'; // Ensure this path is correct

/**
 * GET handler to fetch all tour packages with optional filtering.
 *
 * Query Parameters:
 * - status: Filter packages by status (e.g., 'draft', 'published')
 * - search: Search term to filter packages by title or description
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let q = collection(db, 'tourPackages'); // Correct collection name

    // Apply status filter if provided and not 'All'
    if (status && status.toLowerCase() !== 'all') {
      q = query(q, where('basicInfo.status', '==', status.toLowerCase()));
    }

    // Fetch documents based on the constructed query
    const querySnapshot = await getDocs(q);
    let tourPackages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Format includes and excludes to ensure they are arrays of objects
    tourPackages = tourPackages.map(pkg => ({
      ...pkg,
      includes: Array.isArray(pkg.includes)
        ? pkg.includes.map(item =>
            typeof item === 'string' ? { value: item, label: item } : item
          )
        : [],
      excludes: Array.isArray(pkg.excludes)
        ? pkg.excludes.map(item =>
            typeof item === 'string' ? { value: item, label: item } : item
          )
        : [],
    }));

    // Implement basic search functionality (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      tourPackages = tourPackages.filter(pkg =>
        pkg.basicInfo.tourTitle.toLowerCase().includes(searchLower) ||
        pkg.basicInfo.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ tourPackages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    return NextResponse.json({ error: 'Failed to fetch tour packages' }, { status: 500 });
  }
}


/**
 * POST handler to create a new tour package.
 *
 * Expects the request body to contain the tour package data.
 * Generates a unique slug based on the tour title.
 */
export async function POST(request) {
  try {
    const tourData = await request.json();

    // Validate required fields
    if (!tourData.basicInfo || !tourData.basicInfo.tourTitle) {
      return NextResponse.json({ error: 'Tour Title is required.' }, { status: 400 });
    }

    // Ensure includes and excludes are arrays of objects
    const formatSelectOptions = (items) => {
      if (!Array.isArray(items)) return [];
      return items.map(item =>
        typeof item === 'string' ? { value: item, label: item } : item
      );
    };

    tourData.includes = formatSelectOptions(tourData.includes);
    tourData.excludes = formatSelectOptions(tourData.excludes);

    // Generate unique slug
    let slug = generateSlug(tourData.basicInfo.tourTitle);
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const q = query(collection(db, 'tourPackages'), where('basicInfo.slug', '==', uniqueSlug));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        break;
      }
      uniqueSlug = `${slug}-${counter}`;
      counter += 1;
    }

    tourData.basicInfo.slug = uniqueSlug;

    // Optionally, set the status to 'draft' if not provided
    if (!tourData.basicInfo.status) {
      tourData.basicInfo.status = 'draft';
    }

    const docRef = await addDoc(collection(db, 'tourPackages'), {
      ...tourData,
      createdAt: new Date(), // Or use serverTimestamp() if preferred
    }); // Correct collection name

    return NextResponse.json({ id: docRef.id, slug: uniqueSlug }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour package:', error);
    return NextResponse.json({ error: 'Failed to create tour package' }, { status: 500 });
  }
}
