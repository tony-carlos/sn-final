"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Stars from "../common/Stars";
import Link from "next/link";
import { useTours } from "@/app/hooks/useTours";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Function to determine the current season
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth(); // 0-based index for month
  const day = now.getDate();

  // High Season
  if (
    month === 6 || // July
    month === 7 || // August
    (month === 11 && day >= 20) || // Dec 20th - 31st
    (month === 0 && day <= 10) // Jan 1st - 10th
  ) {
    return "highSeason";
  }

  // Low Season
  if (
    (month === 3 && day >= 1) || // April 1-30
    (month === 4 && day <= 19)   // May 1-19
  ) {
    return "lowSeason";
  }

  // Mid Season
  return "midSeason";
}

export default function TourSliders() {
  const { tours, loading, error } = useTours();

  if (loading) return null;
  if (error) return null;

  if (!tours || tours.length === 0) {
    return null; 
  }

  const currentSeason = getCurrentSeason();

  const transformedTours = tours.slice(0, 8).map((t) => {
    const title = t.basicInfo?.tourTitle || "Untitled Tour";
    const location = t.basicInfo?.country?.label || "Unknown Location";
    const rating = t.basicInfo?.rating || 0;
    const ratingCount = t.basicInfo?.ratingCount || 0;
    const durationValue = t.basicInfo?.durationValue || 0;
    const durationUnit = t.basicInfo?.durationUnit || "";
    const duration = `${durationValue} ${durationUnit}`.trim();
    const mainImage = t.images?.[0]?.url || "/placeholder.jpg";

    const highSeason = t.pricing?.manual?.highSeason || {};
    const lowSeason = t.pricing?.manual?.lowSeason || {};
    const midSeason = t.pricing?.manual?.midSeason || {};

    let price = "N/A";
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

    return {
      id: t.id,
      slug: t.basicInfo.slug,
      imageSrc: mainImage,
      title: title,
      location: location,
      rating: rating,
      ratingCount: ratingCount,
      duration: duration,
      price: price,
    };
  });

  if (transformedTours.length === 0) {
    return null;
  }

  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-auto">
            <h2 className="text-30">You might also like...</h2>
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
                    href={`/tour-packages/${tour.slug}`}
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

                      <div className="tourCard__rating d-flex items-center text-13 mt-5">
                        <div className="d-flex x-gap-5">
                          <Stars star={tour.rating} />
                        </div>

                        <span className="text-dark-1 ml-10">
                          {tour.rating} ({tour.ratingCount})
                        </span>
                      </div>

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
