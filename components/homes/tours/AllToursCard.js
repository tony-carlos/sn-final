// /app/components/tours/cards/AllToursCard.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getSeasonalPrice } from "@/app/utils/priceUtils";
import Stars from "@/components/common/Stars"; // Adjust the import path as necessary

/**
 * AllToursCard Component
 *
 * @param {Object} props
 * @param {Object} props.tour - Tour data
 */
const AllToursCard = ({ tour }) => {
  const { basicInfo, images, pricing } = tour;

  return (
    <Link
      href={`/tour-single/${basicInfo.slug}`} // Using slug for single tour view
      className="tourCard -type-1 -rounded bg-white hover-shadow-1 overflow-hidden rounded-20 bg-white -hover-shadow"
    >
      <div className="tourCard__header">
        <div className="tourCard__image ratio ratio-28:20">
          <Image
            width={421}
            height={301}
            src={images[0]?.url || "/images/placeholder.jpg"}
            alt={basicInfo.tourTitle}
            className="img-ratio"
          />

          <div className="tourCard__shape"></div>
        </div>

        <button className="tourCard__favorite">
          <i className="icon-heart"></i>
        </button>
      </div>

      <div className="tourCard__content px-20 py-10">
        <div className="tourCard__location d-flex items-center text-13 text-light-2">
          <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
          {basicInfo.country.label}
        </div>

        <h3 className="tourCard__title text-16 fw-500 mt-5">
          <span>{basicInfo.tourTitle}</span>
        </h3>

        <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
          <div className="d-flex items-center">
            <i className="icon-clock text-16 mr-5"></i>
            {basicInfo.durationValue} {basicInfo.durationUnit}
          </div>

          <div>
            From{" "}
            <span className="text-16 fw-500">${getSeasonalPrice(pricing)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Optionally, set a display name for easier debugging
AllToursCard.displayName = "AllToursCard";

export default AllToursCard;
