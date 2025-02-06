"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import Stars from "@/components/common/Stars";
import Image from "next/image";
import Link from "next/link";

import { useTours } from "@/app/hooks/useTours"; // Ensure correct import path
import { getSeasonalPrice } from "@/app/utils/priceUtils";

export default function AllTours() {
  const { tours, loading, error } = useTours(); // Fetch tours from Firestore

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section
      className="bg-accent-1-05"
      style={{ paddingTop: "20px", paddingBottom: "20px" }} // Adjusted padding
    >
      <div className="container">
        <div className="tabs -pills-4 js-tabs">
          {/* **Header Section** */}
          <div className="row y-gap-10 justify-between items-end">
            <div className="col-auto">
              <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
                All Tours
              </h2>
            </div>
          </div>

          {/* **Swiper Content** */}
          <div className="tabs__content pt-40 sm:pt-20 js-tabs-content">
            <div className="tabs__pane -tab-item-1 is-tab-el-active">
              <div className="js-section-slider">
                {tours.length > 0 ? (
                  <Swiper
                    spaceBetween={30}
                    navigation={{
                      prevEl: ".js-slider1-prev2",
                      nextEl: ".js-slider1-next2",
                    }}
                    modules={[Navigation, Pagination]}
                    style={{ overflow: "visible", maxWidth: "100%" }}
                    breakpoints={{
                      0: { slidesPerView: 1 }, // **Mobile Devices**
                      600: { slidesPerView: 2 }, // **Small Tablets**
                      900: { slidesPerView: 3 }, // **Large Tablets**
                      1200: { slidesPerView: 4 }, // **Desktops**
                    }}
                  >
                    {tours.map((tour) => (
                      <SwiperSlide key={tour.id}>
                        <Link
                          href={`/tours/${
                            tour.basicInfo.slug || tour.id
                          }`}
                          className="tourCard -type-1 -rounded bg-white hover-shadow-1 overflow-hidden rounded-20 -hover-shadow"
                        >
                          {/* **Tour Card Header** */}
                          <div className="tourCard__header">
                            <div
                              className="tourCard__image"
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "200px", // Adjust the height as needed
                              }}
                            >
                              <Image
                                src={
                                  tour.images[0]?.url ||
                                  "/images/placeholder.jpg"
                                } // Fallback image
                                alt={tour.basicInfo.tourTitle || "Tour Image"}
                                fill
                                style={{ objectFit: "cover" }} // **Ensures image covers container**
                              />

                              <div className="tourCard__shape"></div>
                            </div>

                            {/* **Favorite Button** */}
                            <button
                              className="tourCard__favorite"
                              aria-label="Add to Favorites"
                            >
                              <i className="icon-heart"></i>
                            </button>
                          </div>

                          {/* **Tour Card Content** */}
                          <div className="tourCard__content px-20 py-10">
                            {/* **Location** */}
                            <div className="tourCard__location d-flex items-center text-13 text-light-2">
                              <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
                              {tour.basicInfo.country.label ||
                                "Unknown Location"}
                            </div>

                            {/* **Title** */}
                            <h3 className="tourCard__title text-16 fw-500 mt-5">
                              <span>
                                {tour.basicInfo.tourTitle || "Untitled Tour"}
                              </span>
                            </h3>

                            {/* **Duration and Price** */}
                            <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                              {/* **Duration** */}
                              <div className="d-flex items-center">
                                <i className="icon-clock text-16 mr-5"></i>
                                {tour.basicInfo.durationValue}{" "}
                                {tour.basicInfo.durationUnit}
                              </div>

                              {/* **Price** */}
                              <div>
                                From{" "}
                                <span className="text-16 fw-500">
                                  ${getSeasonalPrice(tour.pricing)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div>No tours available at the moment.</div>
                )}
              </div>

              {/* **Navigation Buttons** */}
              <div className="d-flex mt-40">
                <button
                  className="button -dark-1 rounded-full size-72 flex-center bg-white js-slider1-prev2"
                  aria-label="Previous Slide"
                >
                  <i className="icon-arrow-left text-20"></i>
                </button>

                <button
                  className="button -dark-1 rounded-full size-72 flex-center bg-white ml-10 js-slider1-next2"
                  aria-label="Next Slide"
                >
                  <i className="icon-arrow-right text-20"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
