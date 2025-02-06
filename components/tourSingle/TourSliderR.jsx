"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Stars from "../common/Stars";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * Determines the current season based on the current date.
 *
 * @returns {string} - "highSeason", "lowSeason", or "midSeason"
 */
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth(); // 0-based index for month
  const day = now.getDate();

  // High Season: July, August, Dec 20-31, Jan 1-10
  if (
    month === 6 ||
    month === 7 ||
    (month === 11 && day >= 20) ||
    (month === 0 && day <= 10)
  ) {
    return "highSeason";
  }

  // Low Season: April 1-30, May 1-19
  if ((month === 3 && day >= 1) || (month === 4 && day <= 19)) {
    return "lowSeason";
  }

  // Mid Season
  return "midSeason";
}

/**
 * TourSliderR component to display a slider of related tours.
 *
 * @param {Object} props
 * @param {Array} props.tours - Array of tour objects to display.
 * @param {string} props.destinationName - Name of the destination.
 */
export default function TourSliderR({ tours, destinationName }) {
  console.log("TourSliderR received tours:", tours); // Debugging line

  if (!tours || tours.length === 0) {
    return <div>No related tours found.</div>; // Temporary message for debugging
  }

  const currentSeason = getCurrentSeason();

  const transformedTours = tours.slice(0, 8).map((tour) => {
    const {
      id,
      basicInfo: {
        tourTitle = "Untitled Tour",
        slug,
        country: { label: location = "Unknown Location" } = {},
        rating = 0,
        ratingCount = 0,
        durationValue = 0,
        durationUnit = "",
      } = {},
      images = [],
      pricing: {
        manual: { highSeason = {}, lowSeason = {}, midSeason = {} } = {},
      } = {},
    } = tour;

    const duration = `${durationValue} ${durationUnit}`.trim();
    const mainImage = images[0]?.url || "/placeholder.jpg";

    let price = "N/A";
    if (currentSeason === "highSeason" && highSeason.costs?.length > 0) {
      price = highSeason.costs[0].cost || "N/A";
    } else if (currentSeason === "lowSeason" && lowSeason.costs?.length > 0) {
      price = lowSeason.costs[0].cost || "N/A";
    } else if (currentSeason === "midSeason" && midSeason.costs?.length > 0) {
      price = midSeason.costs[0].cost || "N/A";
    }

    return {
      id,
      slug,
      imageSrc: mainImage,
      title: tourTitle,
      location,
      rating,
      ratingCount,
      duration,
      price,
    };
  });

  console.log("Transformed Tours:", transformedTours); // Debugging line

  if (transformedTours.length === 0) {
    return <div>No transformed tours available.</div>; // Temporary message for debugging
  }

  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-auto">
            <h2 className="text-30">
              Safari Tours {destinationName ? `to ${destinationName}` : ""}
            </h2>
          </div>
        </div>

        <div className="relative pt-40 sm:pt-20">
          <div
            className="overflow-hidden pb-5 js-section-slider"
            data-gap="30"
            data-slider-cols="xl-4 lg-3 md-2 sm-1 base-1"
            data-nav-prev="js-slider10-prev"
            data-nav-next="js-slider10-next"
          >
            {" "}
            <div className="swiper-wrapper">
              <Swiper
                spaceBetween={30}
                className="w-100"
                pagination={{
                  el: ".pbutton1",
                  clickable: true,
                }}
                navigation={{
                  prevEl: ".js-slider10-prev",
                  nextEl: ".js-slider10-next",
                }}
                modules={[Navigation, Pagination]}
                breakpoints={{
                  500: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 4,
                  },
                }}
              >
                {transformedTours.map((tour) => (
                  <SwiperSlide key={tour.id}>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow"
                    >
                      <div className="tourCard__header">
                        <div className="tourCard__image ratio ratio-28:20">
                          <Image
                            width={421}
                            height={301}
                            src={tour.imageSrc}
                            alt={tour.title}
                            className="img-ratio rounded-12"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        <button className="tourCard__favorite">
                          <i className="icon-heart"></i>
                        </button>
                      </div>

                      <div className="tourCard__content px-10 pt-10">
                        <div className="tourCard__location d-flex items-center text-13 text-light-2">
                          <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
                          {tour.location}
                        </div>

                        <h3 className="tourCard__title text-16 fw-500 mt-5">
                          <span>{tour.title}</span>
                        </h3>

                        <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                          <div className="d-flex items-center">
                            <i className="icon-clock text-16 mr-5"></i>
                            {tour.duration}
                          </div>

                          <div>
                            From{" "}
                            <span className="text-16 fw-500">
                              {tour.price !== "N/A" ? `$${tour.price}` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="navAbsolute">
            <button className="navAbsolute__button bg-white js-slider10-prev">
              <i className="icon-arrow-left text-14"></i>
            </button>

            <button className="navAbsolute__button bg-white js-slider10-next">
              <i className="icon-arrow-right text-14"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
