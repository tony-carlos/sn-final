// app/admin/destinations/page.js
export const runtime = "edge"; // <-- Add this at the top

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { db } from '@/app/lib/firebase'; // Ensure correct import path
import { collection, getDocs } from 'firebase/firestore';
import { transformDestination } from '@/app/lib/transformData'; // Ensure this function handles Firestore data correctly

// Dynamically import the Client Component and disable SSR for it
const DestinationsListClient = dynamic(
  () => import('@/components/DestinationsListClient'),
  { ssr: false, loading: () => <Loading /> }
);

// Loading Component
const Loading = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// Server Component
export default async function AdminDestinationsPage() {
  // Fetch data server-side
  const fetchDestinations = async () => {
    try {
      const destinationsRef = collection(db, 'destinations');
      const snapshot = await getDocs(destinationsRef);
      const destinations = [];
      snapshot.forEach((doc) => {
        destinations.push(transformDestination(doc));
      });
      return destinations;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return [];
    }
  };

  const destinations = await fetchDestinations();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Destinations</h1>
      <Suspense fallback={<Loading />}>
        <DestinationsListClient initialDestinations={destinations} />
      </Suspense>
    </div>
  );
}