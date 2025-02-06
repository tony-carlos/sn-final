// components/frontend/destinations/Gallery1.jsx

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Ensure correct import
import Image from "next/image";

// Import Swiper styles (Ensure these imports are present in your component or globally)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Gallery1({ images }) {
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
              prevEl: ".js-slider1-prev8",
              nextEl: ".js-slider1-next8",
            }}
            modules={[Navigation, Pagination]}
            slidesPerView={1}
          >
            {images.map((elm, i) => (
              <SwiperSlide key={i}>
                <div className="swiper-slide">
                  <Image
                    width={850}
                    height={310}
                    src={elm.url} // Corrected src attribute
                    alt={`Gallery Image ${i + 1}`} // Descriptive alt text
                    className="img-cover rounded-12"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <div className="navAbsolute -type-2">
              <button
                className="navAbsolute__button  js-slider1-prev8"
                aria-label="Previous Slide"
              >
                <i className="icon-arrow-left  text-14 "></i>
              </button>

              <button
                className="navAbsolute__button  js-slider1-next8"
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
