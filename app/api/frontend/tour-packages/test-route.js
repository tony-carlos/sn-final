// app/api/frontend/tour-packages/test-route.js
export const runtime = "edge"; // <-- Add this at the top

import { db } from '@/app/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Handles GET requests to /api/frontend/tour-packages/test-route
 * Fetches raw tour packages data without transformation.
 */
export async function GET(request) {
  try {
    const q = query(collection(db, 'tourPackages'), orderBy('basicInfo.tourTitle'));
    const snapshot = await getDocs(q);

    const tourPackages = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      tourPackages.push({
        id: doc.id,
        data,
      });
    });

    return new Response(JSON.stringify({ data: tourPackages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/frontend/tour-packages/test-route:', error);

    const responseBody =
      process.env.NODE_ENV === 'development'
        ? { error: 'Internal Server Error', details: error.message }
        : { error: 'Internal Server Error' };

    return new Response(JSON.stringify(responseBody), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
