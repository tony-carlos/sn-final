// /app/components/homes/tours/SpecialOffers.js

'use client'; // Designate as a client component to use React hooks

import React, { useEffect, useState } from 'react';
import TourCard from './TourCard';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * SpecialOffers Component
 *
 * Displays a list of tours with special offers.
 *
 * @returns {JSX.Element} - Rendered component.
 */
export default function SpecialOffers() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await fetch('/api/frontend/tour-packages?isOffer=true');
        const result = await response.json();

        if (response.ok) {
          setTours(result.data);
        } else {
          setError(result.error || 'Failed to fetch special offers.');
          console.error('API Error:', result.error);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialOffers();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (tours.length === 0) {
    return (
      <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
        <div className="container">
          <p>No special offers available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 className="text-30 md:text-24">Special Offers</h2>
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
    </section>
  );
}
