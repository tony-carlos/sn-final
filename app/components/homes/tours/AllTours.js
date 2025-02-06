// /app/components/homes/tours/AllTours.js

'use client'; // Designate as a client-side component

import React from 'react';
import TourCard from './TourCard';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import PropTypes from 'prop-types';
import { useTours } from '@/hooks/useTours';

/**
 * AllTours Component
 *
 * Displays a list of all available tours based on global filters.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.filters - The global filter criteria.
 * @returns {JSX.Element} - Rendered component.
 */
export default function AllTours({ filters }) {
  const { tours, loading, error } = useTours(filters);

  console.log('AllTours fetched tours:', tours);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (tours.length === 0) {
    console.warn('No tours found with the applied filters.');
    return (
      <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
        <div className="container">
          <p>No tours available based on your filters.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 className="text-30 md:text-24">All Tours</h2>
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

AllTours.propTypes = {
  filters: PropTypes.object.isRequired,
};
