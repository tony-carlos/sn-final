"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useState, useRef } from "react";
import "./Gallery3.css"; // Import the CSS file

export default function Gallery3({ tour }) {
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index
  const swiperRef = useRef(null); // Ref for Swiper instance

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex); // Update active index on slide change
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    swiperRef.current.slideToLoop(index); // Change the swiper to the corresponding image
  };

  return (
    <div className="row pt-30">
      {/* Thumbnails Section on the left, visible on tablets and larger */}
      <div className="col-md-3 d-md-block thumbnails-container">
        {/* Visible on tablets and larger screens */}
        <div className="d-flex flex-column">
          {tour?.images &&
            tour.images.slice(0, 4).map((elm, i) => (
              <div
                key={i}
                className={`thumbnail-container ${
                  activeIndex === i ? "active" : ""
                }`}
                onClick={() => handleThumbnailClick(i)}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100px", // Adjust height as needed
                  marginBottom: "10px", // Adjust spacing as needed
                }}
              >
                <Image
                  src={elm.url}
                  alt={`Thumbnail ${i + 1}`}
                  layout="fill" // Changed from "responsive" to "fill"
                  objectFit="cover" // Ensures the image covers the container
                  className="img-thumbnail rounded-8 cursor-pointer"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Swiper Section on the right */}
      <div className="col-md-9 col-12">
        {" "}
        {/* Full width on mobile, 9 columns on tablet and larger screens */}
        <div className="relative overflow-hidden js-section-slider">
          <div className="swiper-wrapper" style={{ height: "438px" }}>
            {" "}
            {/* Maintain original Swiper height */}
            <Swiper
              spaceBetween={10}
              className="w-100 overflow-visible"
              style={{ maxWidth: "100%", height: "100%" }}
              loop={true}
              navigation={{
                prevEl: ".js-slider1-prev8",
                nextEl: ".js-slider1-next8",
              }}
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }} // Capture the Swiper instance
            >
              {tour?.images &&
                tour.images.map((elm, i) => (
                  <SwiperSlide key={i}>
                    <div className="swiper-slide">
                      <Image
                        width={850}
                        height={510}
                        src={elm.url}
                        alt="image"
                        className="img-cover rounded-12"
                      />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          <div className="navAbsolute -type-2">
            <button className="navAbsolute__button bg-white js-sliderMain-prev js-slider1-prev8">
              <i className="icon-arrow-left text-14"></i>
            </button>

            <button className="navAbsolute__button bg-white js-sliderMain-next js-slider1-next8">
              <i className="icon-arrow-right text-14"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
