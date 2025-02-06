// app/frontend/destinations/DestinationsPageClient.jsx

"use client";

import React, { useState } from "react";
import TourList2 from "@/components/tours/TourList2";
import TourTypes from "@/components/tours/TourTypes";

export default function DestinationsPageClient() {
  const [selectedDestination, setSelectedDestination] = useState("");

  const handleFilterDestination = (destinationName) => {
    setSelectedDestination(destinationName);
  };

  const handleResetAll = () => {
    setSelectedDestination("");
  };

  return (
    <>
      <div className="container mb-40">
        <TourTypes onFilterDestination={handleFilterDestination} />
      </div>
      <TourList2
        selectedDestination={selectedDestination}
        onResetAll={handleResetAll}
      />
    </>
  );
}
