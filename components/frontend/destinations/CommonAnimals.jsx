// components/frontend/destinations/CommonAnimals.jsx

"use client";

import React from "react";
import PropTypes from "prop-types"; // For prop type validation
import GallerySlider from "./GallerySlider";

/**
 * CommonAnimals Component
 *
 * @param {Object} props - Component props
 * @param {Array} props.commonAnimals - Array of animal objects
 * @returns {JSX.Element|null} - Rendered Common Animals slider or null if no data
 */
export default function CommonAnimals({ commonAnimals }) {
  if (!commonAnimals || commonAnimals.length === 0) return null;

  // Prepare images for GallerySlider
  const animalImages = commonAnimals.map((animal) => ({
    id: animal.id, // Ensure each animal has a unique 'id'
    url: animal.image || "/images/animals/fallback.jpg",
    name: animal.name || "Animal Image",
  }));

  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div className="row y-gap-10 justify-between items-end">
          <div className="col-auto">
            <h2 data-aos="fade-up" className="text-30">
              Common Animals
            </h2>
          </div>

          <div className="col-auto">
            <a
              href="/tour-packages"
              data-aos="fade-right"
              className="buttonArrow d-flex items-center"
            >
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </a>
          </div>
        </div>

        <div
          data-aos="fade-up"
          className="row y-gap-30 justify-between xl:justify-center sm:justify-start pt-40 sm:pt-20 mobile-css-slider -w-160"
        >
          <GallerySlider images={animalImages} />
        </div>
      </div>
    </section>
  );
}

CommonAnimals.propTypes = {
  commonAnimals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier
      image: PropTypes.string.isRequired, // Image URL
      name: PropTypes.string.isRequired, // Animal name
      tours: PropTypes.number, // Number of tours (optional)
    })
  ).isRequired,
};