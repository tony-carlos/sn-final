"use client";

import React from "react";
import DOMPurify from "dompurify";

export default function Overview({ tour }) {
  const { description } = tour.basicInfo || {};

  // Sanitize the description
  const sanitizedDescription = description
    ? DOMPurify.sanitize(description)
    : "";

  return (
    <>
      <h2 className="text-30">Overview</h2>
      <div className="mt-20">
        {sanitizedDescription ? (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        ) : (
          <p className="text-light-2">No overview available for this tour.</p>
        )}
      </div>
    </>
  );
}
