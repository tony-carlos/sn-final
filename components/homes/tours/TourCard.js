// /app/components/tours/TourCard.js

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

/**
 * TourCard Component
 *
 * Displays individual tour details in a card format.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.tour - Tour data.
 * @returns {JSX.Element} - Rendered component.
 */
export default function TourCard({ tour }) {
  // Destructure necessary fields with defaults
  const {
    basicInfo: {
      isFeatured = false,
      isRecommended = false,
      isOffer = false,
      isDayTrip = false,
      tourTitle = '',
      slug = '',
      country = { label: '', value: '' },
      rating = 0,
      ratingCount = 0,
      durationValue = 0,
      durationUnit = '',
      tags = [],
    } = {},
    images = [],
    pricing: {
      manual: {
        highSeason = {},
        lowSeason = {},
        midSeason = {},
      } = {},
    } = {},
  } = tour;

  // Function to determine the current season
  function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth(); // Months are 0-based in JavaScript
    const day = now.getDate();

    // High Season
    if (
      month === 6 || // July
      month === 7 || // August
      (month === 11 && day >= 20) || // December 20th - 31st
      (month === 0 && day <= 10) // January 1st - 10th
    ) {
      return 'highSeason';
    }

    // Low Season
    if (
      (month === 3 && day >= 1) || // April 1st - April 30th
      (month === 4 && day <= 19) // May 1st - May 19th
    ) {
      return 'lowSeason';
    }

    // Mid Season
    return 'midSeason';
  }

  // Get the current season
  const currentSeason = getCurrentSeason();

  // Get the price based on the current season
  let price = 'N/A';

  // Assuming costs is an array and we take the first entry
  if (currentSeason === 'highSeason' && highSeason.costs && highSeason.costs.length > 0) {
    price = highSeason.costs[0].cost || 'N/A';
  } else if (currentSeason === 'lowSeason' && lowSeason.costs && lowSeason.costs.length > 0) {
    price = lowSeason.costs[0].cost || 'N/A';
  } else if (currentSeason === 'midSeason' && midSeason.costs && midSeason.costs.length > 0) {
    price = midSeason.costs[0].cost || 'N/A';
  }

  return (
    <Link href={`/tour-single/${slug}`} className="tourCard block border bg-white hover:shadow-lg overflow-hidden rounded">
      <div className="relative h-48">
        <Image
          src={images[0]?.url || '/images/placeholder.jpg'}
          alt={tourTitle}
          fill
          className="object-cover"
        />
        {isFeatured && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Featured</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{tourTitle}</h3>
        <p className="text-sm text-gray-500">{country.label}</p>
        <div className="flex items-center space-x-1 mt-2">
          <span>⭐ {rating}</span>
          <span className="text-sm text-gray-500">({ratingCount})</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-700">
            Duration: {durationValue} {durationUnit}
          </span>
          <span className="text-sm font-semibold">
            From ${price}
          </span>
        </div>
      </div>

      <style jsx>{`
        .tourCard {
          transition: box-shadow 0.3s;
        }
        .tourCard:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .relative {
          position: relative;
        }
        .absolute {
          position: absolute;
        }
        .bg-red-500 {
          background-color: #ef4444;
        }
        .text-white {
          color: #ffffff;
        }
        .text-xs {
          font-size: 0.75rem;
        }
        .px-2 {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .rounded {
          border-radius: 0.25rem;
        }
      `}</style>
    </Link>
  );
}

TourCard.propTypes = {
  tour: PropTypes.shape({
    basicInfo: PropTypes.shape({
      isFeatured: PropTypes.bool,
      isRecommended: PropTypes.bool,
      isOffer: PropTypes.bool,
      isDayTrip: PropTypes.bool,
      tourTitle: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      country: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }).isRequired,
      rating: PropTypes.number.isRequired,
      ratingCount: PropTypes.number.isRequired,
      durationValue: PropTypes.number.isRequired,
      durationUnit: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        storagePath: PropTypes.string,
      })
    ),
    pricing: PropTypes.shape({
      manual: PropTypes.shape({
        highSeason: PropTypes.shape({
          costs: PropTypes.arrayOf(
            PropTypes.shape({
              category: PropTypes.string,
              cost: PropTypes.number,
              discount: PropTypes.number,
            })
          ),
        }),
        lowSeason: PropTypes.shape({
          costs: PropTypes.arrayOf(
            PropTypes.shape({
              category: PropTypes.string,
              cost: PropTypes.number,
              discount: PropTypes.number,
            })
          ),
        }),
        midSeason: PropTypes.shape({
          costs: PropTypes.arrayOf(
            PropTypes.shape({
              category: PropTypes.string,
              cost: PropTypes.number,
              discount: PropTypes.number,
            })
          ),
        }),
      }),
    }),
  }).isRequired,
};
