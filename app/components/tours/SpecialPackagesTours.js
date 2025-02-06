// /app/components/tours/SpecialPackagesTours.js

'use client';

import React from 'react';
import TourCard from './TourCard';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import { useTours } from '@/app/hooks/useTours';

export default function SpecialPackagesTours() {
  const { tours, loading, error } = useTours();

  console.log('SpecialPackagesTours fetched tours:', tours);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Filter and sort tours
  const specialPackagesTours = tours
    .filter((tour) => tour.basicInfo.isSpecialPackage)
    .filter((tour) => tour.createdAt)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (specialPackagesTours.length === 0) {
    console.warn('No special packages found.');
    return (
      <section className="special-packages-tours-section py-8 bg-white">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-4">Special Packages</h2>
          <p>No special packages available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="special-packages-tours-section py-8 bg-white">
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Special Packages</h2>
          <a href="/tour-packages" className="text-blue-500 hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialPackagesTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
