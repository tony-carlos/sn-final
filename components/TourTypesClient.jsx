// TourTypesClient.jsx (Client Component)
"use client";
import React, { useState } from "react";
import TourTypes from "@/components/tours/TourTypes";

export default function TourTypesClient() {
  const [selectedDestination, setSelectedDestination] = useState("");

  const handleFilterDestination = (destinationName) => {
    setSelectedDestination(destinationName);
    // Pass selectedDestination to something else if needed
  };

  return <TourTypes onFilterDestination={handleFilterDestination} />;
}
