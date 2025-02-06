// app/components/GuideHero.jsx

"use client";

import Image from "next/image";
import React, { useState } from "react";

/**
 * GuideHero Component with search functionality.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onSearch - Callback to pass the search term.
 *
 * @returns {JSX.Element} - Rendered guide hero section.
 */

export default function GuideHero({ onSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const term = e.target.value;
    setInputValue(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <section className="pageHeader -type-2">
      <div className="pageHeader__bg">
        <Image
          width={1800}
          height={350}
          src="/img/pageHeader/2.jpg"
          alt="Safari Guides Background"
        />
        <Image
          width="1800"
          height="40"
          style={{ height: "auto" }}
          src="/img/hero/1/shape.svg"
          alt="Decorative Shape"
        />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-12">
            <div className="pageHeader__content">
              <h1 className="pageHeader__title">Our Safari Guides</h1>

          

              <div className="pageHeader__search">
                <input
                  type="text"
                  placeholder="Search for a topic"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <button onClick={handleSearchClick}>
                  <i className="icon-search text-15 text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
