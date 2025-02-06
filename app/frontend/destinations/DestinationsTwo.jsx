// app/frontend/destinations/DestinationsTwo.jsx

"use client";

import React from "react";
import Alert from "react-bootstrap/Alert"; // Ensure correct import
import Image from "next/image";
import Link from "next/link";

import useDestinations from "@/app/lib/hooks/useDestinations";
import Spinner from "@/app/components/common/Spinner";

export default function DestinationsTwo() {
  // Use the custom hook to fetch all destinations
  const { destinations, isLoading, error } = useDestinations(); // No slug means fetch all

  // Define the desired destination titles (or use slugs if preferred)
  const desiredDestinations = [
    "Serengeti National Park",
    "Mount Kilimanjaro",
    "Ngorongoro Conservation Area",
    "Arusha National Park",
    "Tarangire National Park",
    "Lake Manyara National Park",
  ];

  // Filter the destinations to include only the desired ones
  const topDestinations = destinations.filter((destination) =>
    desiredDestinations.includes(destination.title)
  );

  // Render loading state
  if (isLoading) {
    return (
        <Spinner/>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="layout-pt-xl layout-pb-xl bg-dark-1">
        <div className="container">
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div className="row y-gap-10 justify-between items-end">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              Our Top Destinations
            </h2>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-30 justify-between xl:justify-center sm:justify-start pt-40 sm:pt-20 mobile-css-slider -w-160"
        >
          {topDestinations.map((elm) => (
            <div key={elm.id} className="col-xl-2 col-lg-3 col-md-4 col-6">
              <Link
                href={`/frontend/destinations/${elm.slug}`}
                className="-hover-image-scale"
              >
                <div className="ratio ratio-19:21 rounded-12 -hover-image-scale__image">
                  <Image
                    width={260}
                    height={260}
                    src={
                      elm.images && elm.images[0]
                        ? elm.images[0].url
                        : "/placeholder.jpg"
                    }
                    alt={elm.title || "Destination Image"} // Updated
                    className="img-ratio rounded-12"
                  />
                </div>

                <h3 className="text-16 fw-500 mt-20">
                  {elm.title} {/* Updated */}
                </h3>
              </Link>
            </div>
          ))}

          {/* Optionally, handle the case where some desired destinations are missing */}
          {topDestinations.length === 0 && (
            <div className="col-12">
              <Alert variant="warning" className="text-center">
                No top destinations available at the moment.
              </Alert>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
