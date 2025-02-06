"use client";

import React from "react";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import { useTours } from "@/app/hooks/useTours";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TourCard from "./TourCard";

export default function DayTripsTours() {
  const { tours, loading, error } = useTours();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Filter and sort tours
  const dayTripsTours = tours
    .filter(
      (tour) =>
        tour.basicInfo.isDayTrip === true || tour.basicInfo.isDayTrip === "true"
    )
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

  if (dayTripsTours.length === 0) {
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
    <section className="day-trips-tours-section py-8 bg-gray-100">
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Day Trips</h2>
          <a href="/tour-packages" className="text-blue-500 hover:underline">
            See all
          </a>
        </div>

        {/* Swiper Slider */}
        <div className="relative pt-40 sm:pt-20">
          <div className="overflow-hidden js-section-slider">
            <div
              data-aos="fade-up"
              data-aos-delay=""
              className="swiper-wrapper"
            >
              <Swiper
                spaceBetween={30}
                className="w-100"
                navigation={{
                  prevEl: ".js-slider1-prev",
                  nextEl: ".js-slider1-next",
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
                {dayTripsTours.map((tour, i) => (
                  <SwiperSlide key={tour.id}>
                    <TourCard tour={tour} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navAbsolute">
            <button className="navAbsolute__button bg-white js-slider1-prev">
              <i className="icon-arrow-left text-14"></i>
            </button>

            <button className="navAbsolute__button bg-white js-slider1-next">
              <i className="icon-arrow-right text-14"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
