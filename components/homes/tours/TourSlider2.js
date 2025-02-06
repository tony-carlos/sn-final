// /app/components/tours/TourSlider2.js

'use client';

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useTours } from '@/app/hooks/useTours'; // Ensure correct import path
import { getSeasonalPrice } from '@/app/utils/priceUtils'; // Import utility functions

/**
 * TourSlider2 Component
 *
 * @param {Object} props
 * @param {React.Component} props.CardComponent - Custom card component to render each tour
 * @param {Function} props.filterFunction - Function to filter tours based on specific criteria
 */
export default function TourSlider2({ CardComponent, filterFunction }) {
  const { tours, loading, error } = useTours(); // Fetch tours from Firestore
  const [filtered, setFiltered] = useState([]);
  const [ddActive, setDdActive] = useState(false);
  const [travelStyle, setTravelStyle] = useState("");
  const dropDownContainer = useRef();

  // Filter tours based on the provided filter function
  useEffect(() => {
    if (filterFunction) {
      setFiltered(filterFunction(tours, travelStyle));
    } else {
      setFiltered(tours);
    }
  }, [filterFunction, tours, travelStyle]);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActive(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Define filter options based on usage
  // This can be customized or passed as a prop if needed
  const filterOptions = getFilterOptions(filterFunction);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div className="row y-gap-10 justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              {CardComponent.displayName || "Tours"}
            </h2>
          </div>

          <div ref={dropDownContainer} className="col-auto">
            <div
              className={`dropdown -type-1 js-dropdown js-form-dd ${ddActive ? "is-active" : ""
                }`}
              data-main-value=""
            >
              <div
                className="dropdown__button  js-button"
                onClick={() => setDdActive((pre) => !pre)}
              >
                <span className="js-title">
                  {travelStyle ? travelStyle : "Filter"}
                </span>
                <i className="icon-chevron-down ml-10"></i>
              </div>

              <div className="dropdown__menu js-menu-items">
                {filterOptions.map((elm, i) => (
                  <div
                    key={i}
                    className="dropdown__item"
                    onClick={() => {
                      setTravelStyle((pre) => (pre === elm ? "" : elm));
                      setDdActive(false);
                    }}
                  >
                    {elm}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative pt-40 sm:pt-20">
          <div className="overflow-hidden js-section-slider">
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
              {filtered.map((elm) => (
                <SwiperSlide key={elm.id}>
                  <CardComponent tour={elm} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

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

/**
 * Helper function to determine filter options based on filterFunction
 * Customize this as per your filtering logic
 *
 * @param {Function} filterFunction
 * @returns {Array} - Array of filter option strings
 */
const getFilterOptions = (filterFunction) => {
  // Example: If filterFunction filters by tags, return unique tags
  if (filterFunction.name === 'filterByTags') {
    // Assuming you have access to all possible tags
    return ["Adventure", "Wildlife", "Cultural", "Beach", "Mountain", "Hiking", "Fast", "Steady", "Furious", "Grind"];
  }

  // Default filter options
  return ["Option1", "Option2", "Option3"];
};
