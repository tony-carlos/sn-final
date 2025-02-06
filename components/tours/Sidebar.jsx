"use client";

import React, { useState } from "react";
import Calender from "../common/dropdownSearch/Calender";
import RangeSlider from "../common/RangeSlider";
import Image from "next/image";

// Updated arrays
const groupTypes = [
  "Private",
  "Family",
  "Couple",
  "Shared Group Tour",
  "Solo",
  "Group",
];

const features = [
  { value: "isFeatured", label: "Featured" },
  { value: "isRecommended", label: "Recommended" },
  { value: "isOffer", label: "Offer" },
  { value: "isDayTrip", label: "Day Trip" },
  { value: "isSpecialPackage", label: "Special Package" },
];

const tags = [
  { value: "Adventure", label: "Adventure" },
  { value: "Wildlife", label: "Wildlife" },
  { value: "Cultural", label: "Cultural" },
  { value: "Beach", label: "Beach" },
  { value: "Mountain", label: "Mountain" },
  { value: "Hiking", label: "Hiking" },
  { value: "Safari", label: "Safari" },
  { value: "Nature", label: "Nature" },
  { value: "Family", label: "Family" },
  { value: "Romantic", label: "Romantic" },
  { value: "Historical", label: "Historical" },
  { value: "Budget", label: "Budget" },
  { value: "Luxury", label: "Luxury" },
  { value: "Group", label: "Group" },
  { value: "Solo", label: "Solo" },
];

const mainFocusOptions = [
  { value: "Game drive safari", label: "Game drive safari" },
  { value: "Beach holiday", label: "Beach holiday" },
  { value: "Mountain climbing", label: "Mountain climbing" },
  { value: "Cultural experience", label: "Cultural experience" },
  { value: "Bird watching", label: "Bird watching" },
  { value: "Photography", label: "Photography" },
  { value: "Hiking", label: "Hiking" },
  { value: "Wildlife", label: "Wildlife" },
  { value: "Adventure", label: "Adventure" },
  { value: "Family", label: "Family" },
];

const durations = [
  "1-3 days",
  "4-7 days",
  "8-14 days",
  "15-21 days",
  "22+ days",
];

export default function Sidebar({ onFilterChange }) {
  const [ddActives, setDdActives] = useState(["grouptype"]);

  // Local states for filters if needed, or handle them inline
  // Let's just handle changes inline and call onFilterChange

  const handleCheckboxChange = (category, value) => {
    onFilterChange(category, value);
  };

  const handleRangeChange = (min, max) => {
    // Assuming RangeSlider returns min and max
    onFilterChange("priceRange", { min, max });
  };

  return (
    <div className="sidebar -type-1 rounded-12">
      <div className="sidebar__header bg-accent-1">
        <div className="text-15 text-white fw-500">When are you traveling?</div>
        <div className="mt-10">
          <div className="searchForm -type-1 -col-1 -narrow">
            <div className="searchForm__form">
              <div className="searchFormItem js-select-control js-form-dd js-calendar">
                <div className="searchFormItem__button" data-x-click="calendar">
                  <div className="pl-calendar d-flex items-center">
                    <i className="icon-calendar text-20 mr-15"></i>
                    <div>
                      <span className="js-first-date">
                        <Calender />
                      </span>
                      <span className="js-last-date"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* You can add more date-filter logic as needed */}
        </div>
      </div>

      <div className="sidebar__content">
        {/* Group Type */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item ${
                ddActives.includes("grouptype") ? "is-active" : ""
              }`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("grouptype")
                      ? pre.filter((elm) => elm !== "grouptype")
                      : [...pre, "grouptype"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Group Type</h5>
                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives.includes("grouptype") ? { maxHeight: "300px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {groupTypes.map((elm, i) => (
                      <div key={i}>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input
                              type="checkbox"
                              name="groupType"
                              value={elm}
                              onChange={(e) =>
                                handleCheckboxChange("groupTypes", e.target.value)
                              }
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <Image
                                  width="10"
                                  height="8"
                                  src="/img/icons/check.svg"
                                  alt="icon"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="lh-11 ml-10">{elm}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#"
                    className="d-flex text-15 fw-500 text-accent-2 mt-15"
                  >
                    See More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item ${
                ddActives.includes("duration") ? "is-active" : ""
              }`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("duration")
                      ? pre.filter((elm) => elm !== "duration")
                      : [...pre, "duration"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Duration</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives.includes("duration") ? { maxHeight: "300px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {durations.map((elm, i) => (
                      <div key={i}>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input
                              type="checkbox"
                              name="duration"
                              value={elm}
                              onChange={(e) =>
                                handleCheckboxChange("durations", e.target.value)
                              }
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <Image
                                  width="10"
                                  height="8"
                                  src="/img/icons/check.svg"
                                  alt="icon"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="lh-11 ml-10">{elm}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item ${ddActives.includes("tags") ? "is-active" : ""}`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("tags")
                      ? pre.filter((elm) => elm !== "tags")
                      : [...pre, "tags"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Tags</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={ddActives.includes("tags") ? { maxHeight: "300px" } : {}}
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {tags.map((tag, i) => (
                      <div key={i}>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input
                              type="checkbox"
                              name="tags"
                              value={tag.value}
                              onChange={(e) =>
                                handleCheckboxChange("tags", e.target.value)
                              }
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <Image
                                  width="10"
                                  height="8"
                                  src="/img/icons/check.svg"
                                  alt="icon"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="lh-11 ml-10">{tag.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Add "See More" if needed */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Focus */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item ${ddActives.includes("mainFocus") ? "is-active" : ""}`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("mainFocus")
                      ? pre.filter((elm) => elm !== "mainFocus")
                      : [...pre, "mainFocus"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Main Focus</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={ddActives.includes("mainFocus") ? { maxHeight: "300px" } : {}}
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {mainFocusOptions.map((mf, i) => (
                      <div key={i}>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input
                              type="checkbox"
                              name="mainFocus"
                              value={mf.value}
                              onChange={(e) =>
                                handleCheckboxChange("mainFocus", e.target.value)
                              }
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <Image
                                  width="10"
                                  height="8"
                                  src="/img/icons/check.svg"
                                  alt="icon"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="lh-11 ml-10">{mf.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Add "See More" if needed */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specials */}
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item ${ddActives.includes("features") ? "is-active" : ""}`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("features")
                      ? pre.filter((elm) => elm !== "features")
                      : [...pre, "features"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Specials</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={ddActives.includes("features") ? { maxHeight: "300px" } : {}}
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {features.map((elm, i) => (
                      <div key={i}>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input
                              type="checkbox"
                              name="specials"
                              value={elm.value}
                              onChange={(e) =>
                                handleCheckboxChange("specials", e.target.value)
                              }
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <Image
                                  width="10"
                                  height="8"
                                  src="/img/icons/check.svg"
                                  alt="icon"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="lh-11 ml-10">{elm.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
