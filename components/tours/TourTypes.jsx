"use client";

import React from "react";
import { useDestinations } from "@/app/hooks/useDestinations";

export default function TourTypes({ onFilterDestination }) {
  const { destinations, loading, error } = useDestinations();

  if (loading) return <div>Loading destinations...</div>;
  if (error) return <div className="text-red-1">{error}</div>;

  return (
    <div className="pl-tag__grid mobile-css-slider-2">
      {destinations.map((dest, i) => (
        <div key={i} className="">
          <a
            href="#"
            className="pl-tag"
            onClick={(e) => {
              e.preventDefault();
              if (onFilterDestination) {
                onFilterDestination(dest.title);
              }
            }}
          >
            <div className="pl-tag__icon">
              <i className="icon-pin text-24 text-accent-1"></i>
            </div>

            <div className="pl-tag__title text-dark-1">{dest.title}</div>
          </a>
        </div>
      ))}
    </div>
  );
}
