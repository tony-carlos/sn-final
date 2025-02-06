"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import Stars from "@/components/common/Stars";

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
      tourTitle = "",
      slug = "",
      country = { label: "", value: "" },
      rating = 0,
      ratingCount = 0,
      durationValue = 0,
      durationUnit = "",
      tags = [],
    } = {},
    images = [],
    pricing: {
      manual: { highSeason = {}, lowSeason = {}, midSeason = {} } = {},
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
      return "highSeason";
    }

    // Low Season
    if (
      (month === 3 && day >= 1) || // April 1st - April 30th
      (month === 4 && day <= 19) // May 1st - May 19th
    ) {
      return "lowSeason";
    }

    // Mid Season
    return "midSeason";
  }

  // Get the current season
  const currentSeason = getCurrentSeason();

  // Get the price based on the current season
  let price = "N/A";

  // Assuming costs is an array and we take the first entry
  if (
    currentSeason === "highSeason" &&
    highSeason.costs &&
    highSeason.costs.length > 0
  ) {
    price = highSeason.costs[0].cost || "N/A";
  } else if (
    currentSeason === "lowSeason" &&
    lowSeason.costs &&
    lowSeason.costs.length > 0
  ) {
    price = lowSeason.costs[0].cost || "N/A";
  } else if (
    currentSeason === "midSeason" &&
    midSeason.costs &&
    midSeason.costs.length > 0
  ) {
    price = midSeason.costs[0].cost || "N/A";
  }

  return (
    <Link
      href={`/tours/${slug || tour.id}`}
      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow"
    >
      <div className="tourCard__header">
        <div className="tourCard__image ratio ratio-28:20">
          <Image
            width={421}
            height={301}
            src={images[0]?.url || "/images/placeholder.jpg"}
            alt={tourTitle || "Tour Image"}
            className="img-ratio rounded-12"
          />
        </div>

        <button className="tourCard__favorite">
          <i className="icon-heart"></i>
        </button>
      </div>

      <div className="tourCard__content px-10 pt-10">
        <div className="tourCard__location d-flex items-center text-13 text-light-2">
          <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
          {country.label || "Unknown Location"}
        </div>

        <h3 className="tourCard__title text-16 fw-500 mt-5">
          <span>{tourTitle || "Untitled Tour"}</span>
        </h3>


        <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
          <div className="d-flex items-center">
            <i className="icon-clock text-16 mr-5"></i>
            {durationValue} {durationUnit}
          </div>

          <div>
            From <span className="text-16 fw-500">${price}</span>
          </div>
        </div>
      </div>
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
      tourTitle: PropTypes.string,
      slug: PropTypes.string,
      country: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
      rating: PropTypes.number,
      ratingCount: PropTypes.number,
      durationValue: PropTypes.number,
      durationUnit: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
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
