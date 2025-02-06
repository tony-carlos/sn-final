"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTours } from "@/app/hooks/useTours";
import Sidebar from "./Sidebar";
import Stars from "../common/Stars";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";

const sortOptions = [
  { label: "Cheap", value: "cheap" },
  { label: "Expensive", value: "expensive" },
  { label: "Ascending", value: "ascending" },
  { label: "Descending", value: "descending" },
];

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  if (
    month === 6 || // July
    month === 7 || // August
    (month === 11 && day >= 20) || // Dec 20-31
    (month === 0 && day <= 10) // Jan 1-10
  ) {
    return "highSeason";
  }

  if ((month === 3 && day >= 1) || (month === 4 && day <= 19)) {
    return "lowSeason";
  }

  return "midSeason";
}

export default function TourList2({ selectedDestination = "", onResetAll }) {
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef();

  const { tours, loading, error } = useTours();

  // Pagination state
  const [perPage, setPerPage] = useState(18);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    groupTypes: [],
    durations: [],
    tags: [],
    mainFocus: [],
    specials: [],
  });

  const handleFilterChange = (category, value) => {
    setCurrentPage(1);
    setFilters((prev) => {
      const currentValues = prev[category] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentValues, value],
        };
      }
    });
  };

  const handleResetFilters = () => {
    // Reset all filters and sorting
    setFilters({
      groupTypes: [],
      durations: [],
      tags: [],
      mainFocus: [],
      specials: [],
    });
    setSortOption("");
    setCurrentPage(1);

    // Call onResetAll to reset destination in parent if needed
    if (onResetAll) {
      onResetAll();
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    function updatePerPage() {
      if (window.innerWidth >= 992) {
        setPerPage(18);
      } else {
        setPerPage(15);
      }
    }

    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const getDisplayValues = (tour) => {
    const title = tour.basicInfo?.tourTitle || "Untitled Tour";
    const location = tour.basicInfo?.country?.label || "Unknown Location";
    const rating = tour.basicInfo?.rating || 0;
    const ratingCount = tour.basicInfo?.ratingCount || 0;
    const durationValue = tour.basicInfo?.durationValue || 0;
    const durationUnit = tour.basicInfo?.durationUnit || "";
    const duration = `${durationValue} ${durationUnit}`.trim();
    const mainImage = tour.images?.[0]?.url || "/placeholder.jpg";

    const highSeason = tour.pricing?.manual?.highSeason || {};
    const lowSeason = tour.pricing?.manual?.lowSeason || {};
    const midSeason = tour.pricing?.manual?.midSeason || {};
    const currentSeason = getCurrentSeason();

    let price = "N/A";
    if (
      currentSeason === "highSeason" &&
      Array.isArray(highSeason.costs) &&
      highSeason.costs.length > 0
    ) {
      price = highSeason.costs[0].cost || "N/A";
    } else if (
      currentSeason === "lowSeason" &&
      Array.isArray(lowSeason.costs) &&
      lowSeason.costs.length > 0
    ) {
      price = lowSeason.costs[0].cost || "N/A";
    } else if (
      currentSeason === "midSeason" &&
      Array.isArray(midSeason.costs) &&
      midSeason.costs.length > 0
    ) {
      price = midSeason.costs[0].cost || "N/A";
    }

    return { title, location, rating, ratingCount, duration, price, mainImage };
  };

  const getPriceNumber = (price) => {
    if (typeof price === "number") return price;
    if (price === "N/A") return Infinity;
    return Infinity;
  };

  let filteredTours = tours.filter((tour) => {
    const { groupTypes, durations, tags, mainFocus, specials } = filters;

    if (selectedDestination) {
      const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
      const hasMatchingDestination = itinerary.some((item) => {
        return item.destination && item.destination.label === selectedDestination;
      });
      if (!hasMatchingDestination) return false;
    }

    if (
      groupTypes.length === 0 &&
      durations.length === 0 &&
      tags.length === 0 &&
      mainFocus.length === 0 &&
      specials.length === 0
    ) {
      return true;
    }

    // Group Types
    if (groupTypes.length > 0) {
      const tourGroupType = tour.basicInfo?.groupType;
      if (!tourGroupType || !groupTypes.includes(tourGroupType)) {
        return false;
      }
    }

    // Durations
    if (durations.length > 0) {
      const tourDuration = tour.basicInfo?.durationValue || 0;
      const durationCheck = durations.some((d) => {
        if (d === "1-3 days") return tourDuration >= 1 && tourDuration <= 3;
        if (d === "4-7 days") return tourDuration >= 4 && tourDuration <= 7;
        if (d === "8-14 days") return tourDuration >= 8 && tourDuration <= 14;
        if (d === "15-21 days") return tourDuration >= 15 && tourDuration <= 21;
        if (d === "22+ days") return tourDuration >= 22;
        return false;
      });
      if (!durationCheck) return false;
    }

    // Tags
    const tourTags = Array.isArray(tour.basicInfo?.tags) ? tour.basicInfo.tags : [];
    if (tags.length > 0) {
      const hasMatchingTag = tags.some((selectedTag) =>
        tourTags.some((tourTag) => tourTag.value === selectedTag)
      );
      if (!hasMatchingTag) return false;
    }

    // Main Focus
    const tourFocus = Array.isArray(tour.basicInfo?.mainFocus) ? tour.basicInfo.mainFocus : [];
    if (mainFocus.length > 0) {
      const hasMatchingFocus = mainFocus.some((selectedFocus) =>
        tourFocus.some((f) => f.value === selectedFocus)
      );
      if (!hasMatchingFocus) return false;
    }

    // Specials
    if (specials.length > 0) {
      const specialChecks = specials.every((special) => {
        return tour.basicInfo && tour.basicInfo[special] === true;
      });
      if (!specialChecks) return false;
    }

    return true;
  });

  if (sortOption) {
    filteredTours = [...filteredTours].sort((a, b) => {
      const { title: titleA, price: priceA } = getDisplayValues(a);
      const { title: titleB, price: priceB } = getDisplayValues(b);

      const priceNumA = getPriceNumber(priceA);
      const priceNumB = getPriceNumber(priceB);

      if (sortOption === "cheap") {
        return priceNumA - priceNumB;
      } else if (sortOption === "expensive") {
        return priceNumB - priceNumA;
      } else if (sortOption === "ascending") {
        return titleA.localeCompare(titleB);
      } else if (sortOption === "descending") {
        return titleB.localeCompare(titleA);
      }
      return 0;
    });
  }

  const totalTours = filteredTours.length;
  const totalPages = Math.ceil(totalTours / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const displayedTours = filteredTours.slice(startIndex, endIndex);

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
              <Sidebar onFilterChange={handleFilterChange} />
            </div>
            <div className="accordion d-none mb-30 lg:d-flex js-accordion">
              <div
                className={`accordion__item col-12 ${sidebarActive ? "is-active" : ""}`}
              >
                <button
                  className="accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1 rounded-12"
                  onClick={() => setSidebarActive((pre) => !pre)}
                >
                  <i className="icon-sort-down mr-10 text-16"></i>
                  Filter
                </button>

                <div
                  className="accordion__content"
                  style={sidebarActive ? { maxHeight: "2000px" } : {}}
                >
                  <div className="pt-20">
                    <Sidebar onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-xl-9 col-lg-8">
            <div className="row y-gap-5 justify-between items-center">
              <div className="col-auto d-flex items-center">
                {loading && <div>Loading tours...</div>}
                {error && <div className="text-red-1">{error}</div>}
                {!loading && !error && <div>{totalTours} results</div>}

                {/* Reset Filters Button */}
                <button
                  className="button -sm px-20 py-5 border-1 ml-20"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              </div>

              <div ref={dropDownContainer} className="col-auto d-flex items-center">
                <span className="mr-10 text-14 fw-500">Sort by:</span>
                <div
                  className={`dropdown -type-2 js-dropdown js-form-dd ${
                    ddActives ? "is-active" : ""
                  }`}
                  data-main-value=""
                >
                  <div
                    className="dropdown__button js-button"
                    onClick={() => setDdActives((pre) => !pre)}
                  >
                    <span className="js-title">
                      {sortOption
                        ? sortOptions.find((o) => o.value === sortOption)?.label || "Featured"
                        : "Featured"}
                    </span>
                    <i className="icon-chevron-down"></i>
                  </div>

                  <div className="dropdown__menu js-menu-items">
                    {sortOptions.map((opt, i) => (
                      <div
                        onClick={() => {
                          setSortOption(opt.value);
                          setDdActives(false);
                        }}
                        key={i}
                        className="dropdown__item"
                        data-value={opt.value}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tours Listing */}
            <div className="row y-gap-30 pt-30">
              {!loading &&
                !error &&
                displayedTours.map((tour, i) => {
                  const { title, location, rating, ratingCount, duration, price, mainImage } =
                    getDisplayValues(tour);

                  const slug = tour.basicInfo?.slug || tour.id;

                  return (
                    <div key={i} className="col-lg-4 col-sm-6">
                      <Link
                        href={`/tours/${slug}`}
                        className="tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow"
                      >
                        <div className="tourCard__header">
                          <div className="tourCard__image ratio ratio-28:20">
                            <Image
                              width={421}
                              height={301}
                              src={mainImage}
                              alt={title}
                              className="img-ratio rounded-12"
                            />
                          </div>
                          <button className="tourCard__favorite">
                            <i className="icon-heart"></i>
                          </button>
                        </div>

                        <div className="tourCard__content px-10 pt-10">
                          <div className="tourCard__location d-flex items-center text-13 text-light-2">
                            <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
                            {location}
                          </div>

                          <h3 className="tourCard__title text-16 fw-500 mt-5">
                            <span>{title}</span>
                          </h3>

                        

                          <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                            <div className="d-flex items-center">
                              <i className="icon-clock text-16 mr-5"></i>
                              {duration}
                            </div>
                            <div>
                              From{" "}
                              <span className="text-16 fw-500">
                                {price !== "N/A" ? `$${price}` : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>

            {!loading && !error && totalTours > 0 && (
              <div className="d-flex justify-center flex-column mt-60">
                <div className="mx-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
                <div className="text-14 text-center mt-20">
                  Showing results {startIndex + 1}-{Math.min(endIndex, totalTours)} of {totalTours}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
