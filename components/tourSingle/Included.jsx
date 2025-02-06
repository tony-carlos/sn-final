"use client";
import React from "react";
import PropTypes from "prop-types";

export default function Included({ tour }) {
  // Destructure includes and excludes directly from tour
  const { includes, excludes } = tour || {};

  return (
    <div className="row x-gap-130 y-gap-20 pt-20">
      {/* Includes Section */}
      <div className="col-lg-6 col-12">
        <h3 className="text-24 mb-10">Includes</h3>
        <div className="y-gap-15">
          {includes && includes.length > 0 ? (
            includes.map((item, index) => (
              <div key={index} className="d-flex items-center">
                <i
                  className="icon-check flex-center text-10 size-24 rounded-full text-green-2 bg-green-1 mr-15"
                  aria-hidden="true"
                ></i>
                <span className="text-14 text-light-2">{item.label}</span>
              </div>
            ))
          ) : (
            <p className="text-light-2">No inclusions available.</p>
          )}
        </div>
      </div>

      {/* Excludes Section */}
      <div className="col-lg-6 col-12">
        <h3 className="text-24 mb-10">Excludes</h3>
        <div className="y-gap-15">
          {excludes && excludes.length > 0 ? (
            excludes.map((item, index) => (
              <div key={index} className="d-flex items-center">
                <i
                  className="icon-cross flex-center text-10 size-24 rounded-full text-red-3 bg-red-4 mr-15"
                  aria-hidden="true"
                ></i>
                <span className="text-14 text-light-2">{item.label}</span>
              </div>
            ))
          ) : (
            <p className="text-light-2">No exclusions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Optional: Define PropTypes for better type checking
Included.propTypes = {
  tour: PropTypes.shape({
    includes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ),
    excludes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ),
  }).isRequired,
};
