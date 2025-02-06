// components/frontend/destinations/GallerySlider.jsx

"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Ensure correct import
import Image from "next/image";
import PropTypes from "prop-types";

// Import Swiper styles (Ensure these imports are present in your component or globally)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * GallerySlider Component
 *
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects with 'url' and 'name' properties
 * @returns {JSX.Element} - Rendered Swiper slider with images and names
 */
export default function GallerySlider({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="row justify-center ">
      <div className="col-12">
        <div className="relative overflow-hidden js-section-slider">
          <Swiper
            spaceBetween={10}
            className="w-100 overflow-visible"
            style={{ maxWidth: "100%" }}
            loop={images.length > 1} // Enable loop only if multiple images
            navigation={{
              prevEl: ".js-slider-prev",
              nextEl: ".js-slider-next",
            }}
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
          >
            {images.map((elm) => (
              <SwiperSlide key={elm.id}>
                <div className="swiper-slide relative">
                  <Image
                    width={850}
                    height={310}
                    src={elm.url} // Corrected src attribute
                    alt={elm.name || "Gallery Image"} // Descriptive alt text
                    className="img-cover rounded-12"
                  />
                  {/* Overlay for Image name */}
                  {elm.name && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-accent-1 bg-opacity-50 text-white py-2 px-4 rounded-8">
                    <h3 className="text-base font-medium">{elm.name}</h3>
                  </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <div className="navAbsolute -type-2">
              <button
                className="navAbsolute__button js-slider-prev"
                aria-label="Previous Slide"
              >
                <i className="icon-arrow-left text-14"></i>
              </button>

              <button
                className="navAbsolute__button js-slider-next"
                aria-label="Next Slide"
              >
                <i className="icon-arrow-right accent-1 text-14"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

GallerySlider.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier
      url: PropTypes.string.isRequired, // Image URL
      name: PropTypes.string, // name for the image
    })
  ).isRequired,
};