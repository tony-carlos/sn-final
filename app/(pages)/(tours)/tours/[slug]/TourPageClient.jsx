// components/tours/TourPageClient.jsx

"use client";

import React from "react";
import { useTours } from "@/app/hooks/useTours"; // Ensure correct path
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import SingleThree from "@/components/tourSingle/pages/SingleThree";
import TourSlider from "@/components/tourSingle/TourSlider";

const TourPageClient = ({ slug }) => {
  const { tours, loading, error } = useTours();
  if (loading) {
    console.log("Loading tours...");
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const tour = tours.find((t) => t.basicInfo.slug === slug);
  console.log("Found tour:", tour);

  if (!tour) {
    return <ErrorMessage message="Tour not found." />;
  }

  return (
    <>
      <SingleThree tour={tour} />
      <TourSlider tour={tour} />
    </>
  );
};

export default TourPageClient;
