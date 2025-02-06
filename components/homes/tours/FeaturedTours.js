// /app/components/homes/tours/FeaturedTours.js

'use client'; // Designate as a client-side component

import React from 'react';
import TourCard from './TourCard';
import ErrorMessage from '@/components/common/ErrorMessage';
import Spinner from '@/components/common/Spinner';
import { useTours } from '@/app/hooks/useTours';

/**
 * FeaturedTours Component
 *
 * Displays a list of featured tours.
 *
 * @returns {JSX.Element} - Rendered component.
 */
export default function FeaturedTours() {
  const { tours, loading, error } = useTours();

  console.log("DayTripsTours fetched tours:", tours);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Filter and sort tours
  const featured = tours
    .filter((tour) => tour.basicInfo.isFeatured)
    .filter((tour) => tour.createdAt)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (featured.length === 0) {
    console.warn("No day trips found.");
    return (
      <section className="day-trips-tours-section py-8 bg-gray-100">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-4">Day Trips</h2>
          <p>No day trips available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 className="text-30 md:text-24">Featured Tours</h2>
          </div>

          <div className="col-auto">
            <a href="/tour-list-1" className="buttonArrow d-flex items-center">
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </a>
          </div>
        </div>

        <div className="row y-gap-30 justify-between pt-40 sm:pt-20 mobile-css-slider -w-300">
          {tours.map((tour) => (
            <div key={tour.id} className="col-lg-3 col-md-6">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .buttonArrow {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #09f;
        }
        .buttonArrow:hover {
          text-decoration: underline;
        }
        .icon-arrow-top-right {
          transition: transform 0.3s;
        }
        .buttonArrow:hover .icon-arrow-top-right {
          transform: translate(5px, -5px);
        }
      `}</style>
    </section>
  );
}
