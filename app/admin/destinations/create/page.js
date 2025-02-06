// app/admin/destinations/create/page.js

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Client Component and disable SSR for it
const CreateDestinationForm = dynamic(
  () => import('@/components/CreateDestinationForm'),
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
export default function CreateDestinationPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Destination</h1>
      <Suspense fallback={<Loading />}>
        <CreateDestinationForm />
      </Suspense>
    </div>
  );
}