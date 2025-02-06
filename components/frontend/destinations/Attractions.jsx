"use client";

import React from "react";
import PropTypes from "prop-types"; // For prop type validation
import GallerySlider from "./GallerySlider";

/**
 * Attractions Component
 *
 * @param {Object} props - Component props
 * @param {Array} props.attractions - Array of attraction objects
 * @returns {JSX.Element|null} - Rendered Attractions slider or null if no data
 */
export default function Attractions({ attractions }) {
  if (!attractions || attractions.length === 0) return null;

  // Prepare images for GallerySlider
  const attractionImages = attractions.map((att) => ({
    id: att.id, // Ensure each attraction has a unique 'id'
    url: att.image || "/images/attractions/fallback.jpg",
    name: att.name || "Attraction Image",
  }));

  return (
    <section className="w-full p-0">
      {/* Remove horizontal padding on mobile, but you can add it back at larger breakpoints if desired */}
      <div className="w-full px-0 mx-0">
        <div className="flex items-center justify-between">
          <h2 data-aos="fade-up" className="text-30">
            Attractions
          </h2>
          <a
            href="#"
            data-aos="fade-right"
            className="buttonArrow d-flex items-center"
          >
            <span>See all</span>
            <i className="icon-arrow-top-right text-16 ml-10"></i>
          </a>
        </div>

        {/* Slider Section */}
        <div data-aos="fade-up" className="mt-4">
          <GallerySlider images={attractionImages} />
        </div>
      </div>
    </section>
  );
}

Attractions.propTypes = {
  attractions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier
      image: PropTypes.string.isRequired, // Image URL
      name: PropTypes.string.isRequired, // Attraction name
      tours: PropTypes.number, // Number of tours (optional)
    })
  ).isRequired,
};