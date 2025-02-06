// /app/components/tours/AllTours.js

'use client';

import React from 'react';
import TourCard from './TourCard';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { useTours } from '@/app/hooks/useTours';

export default function AllTours() {
  const { tours, loading, error } = useTours();

  console.log('AllTours fetched tours:', tours);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (tours.length === 0) {
    console.warn('No tours found.');
    return (
      <section className="all-tours-section py-8 bg-gray-100">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-4">All Tours</h2>
          <p>No tours available at the moment.</p>
        </div>
      </section>
    );
  }

  // Sort tours by date in descending order
  const sortedTours = tours
    .filter((tour) => tour.createdAt) // Ensure createdAt exists
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="all-tours-section py-8 bg-gray-100">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-4">All Tours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
