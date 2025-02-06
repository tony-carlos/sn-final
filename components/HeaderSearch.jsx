// app/components/HeaderSearch.jsx

"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

/**
 * HeaderSearch Component for searching destinations or activities.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.white - Determines styling.
 * @param {Function} props.onSearch - Callback to pass the search term.
 *
 * @returns {JSX.Element} - Rendered search component.
 */
export default function HeaderSearch({ white, onSearch }) {
  const [selected, setSelected] = useState("");
  const [ddActive, setDdActive] = useState(false);
  const inputRef = useRef();
  const dropDownContainer = useRef();

  useEffect(() => {
    inputRef.current.value = selected;
    onSearch(selected); // Pass the search term to the parent
  }, [selected, onSearch]);

  const searchData = [
    {
      id: 1, // Unique ID
      iconClass: "icon-pin text-20",
      title: "Phuket",
      location: "Thailand, Asia",
    },
    {
      id: 2,
      iconClass: "icon-price-tag text-20",
      title: "London Day Trips",
      location: "England",
    },
    {
      id: 3,
      iconClass: "icon-flag text-20",
      title: "Europe",
      location: "Country",
    },
    {
      id: 7,
      img: `/img/misc/icon.png`,
      title: "Centipede Tour - Guided Arizona Desert Tour by ATV",
      location: "Country",
    },
    {
      id: 4,
      iconClass: "icon-pin text-20",
      title: "Istanbul",
      location: "Turkey",
    },
    {
      id: 5,
      iconClass: "icon-pin text-20",
      title: "Berlin",
      location: "Germany, Europe",
    },
    {
      id: 6,
      iconClass: "icon-pin text-20",
      title: "London",
      location: "England, Europe",
    },
  ];

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

  return (
    <>
      <div
        ref={dropDownContainer}
        className="header__search js-liverSearch js-form-dd"
      >
        <i className="icon-search text-18"></i>
        <input
          onChange={(e) => setSelected(e.target.value)}
          ref={inputRef}
          onClick={() => setDdActive((pre) => !pre)}
          type="text"
          placeholder="Search destinations or activities"
          className={`js-search ${white ? "text-white" : ""}`}
        />

        <div
          className={
            ddActive ? "headerSearchRecent is-active" : "headerSearchRecent"
          }
          data-x="headerSearch"
        >
          <div className="headerSearchRecent__container">
            <div className="headerSearchRecent__title">
              <h4 className="text-18 fw-500">Recent Searches</h4>
            </div>

            <div className="headerSearchRecent__list js-results">
              {searchData
                .filter((elm) =>
                  elm.title.toLowerCase().includes(selected.toLowerCase())
                )
                .map((elm, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelected(elm.title);
                      setDdActive(false);
                    }}
                    className="headerSearchRecent__item js-search-option"
                    data-x-click="headerSearch"
                  >
                    <div className="size-50 bg-white rounded-12 border-1 flex-center">
                      {elm.iconClass && <i className={elm.iconClass}></i>}
                      {elm.img && (
                        <Image
                          width={50}
                          height={50}
                          src={elm.img}
                          alt="image"
                          className="rounded-12"
                        />
                      )}
                    </div>
                    <div className="ml-10">
                      <div className="fw-500 js-search-option-target">
                        {elm.title}
                      </div>
                      <div className="lh-14 text-14 text-light-2">
                        {elm.location}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
