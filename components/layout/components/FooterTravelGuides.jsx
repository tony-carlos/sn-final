// app/components/FooterTravelGuides.jsx

"use client";

import React from "react";
import Link from "next/link";
import useTravelGuides from "@/app/hooks/useTravelGuides";
import { CircularProgress, Alert, Typography } from "@mui/material";

const FooterTravelGuides = () => {
  const { travelGuides, loading, error } = useTravelGuides();

  return (
    <div className="col-lg-3 col-md-6">
      <h4 className="text-20 fw-500">Travel Guides</h4>

      {/* Handle Loading State */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
          <CircularProgress size={24} />
        </div>
      )}

      {/* Handle Error State */}
      {error && (
        <Alert severity="error">
          Failed to load Travel Guides.
        </Alert>
      )}

      {/* Display Travel Guides */}
      {!loading && !error && travelGuides.length > 0 && (
        <ul className="footer__travelGuidesList">
          {travelGuides.map((guide) => (
            <li key={guide.id} className="footer__travelGuidesItem">
              <Link href={`/tanzaniasafariguide/${guide.slug}`}>
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Handle Empty State */}
      {!loading && !error && travelGuides.length === 0 && (
        <div className="footer__noGuides">No Travel Guides Available.</div>
      )}
    </div>
  );
};

export default FooterTravelGuides;
