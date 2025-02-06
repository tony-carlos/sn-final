// app/tours/[slug]/SingleThreeClient.jsx

"use client";

import React from "react";
import SingleThree from "@/components/tourSingle/pages/SingleThree";
import ErrorMessage from "@/components/common/ErrorMessage";

/**
 * Client Component: Receives tour data via props and renders the SingleThree component.
 */
const SingleThreeClient = ({ tour }) => {
  if (!tour) {
    return <ErrorMessage message="Tour not found." />;
  }

  return <SingleThree tour={tour} />;
};

export default SingleThreeClient;
