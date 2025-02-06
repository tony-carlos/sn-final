// app/frontend/destinations/AllDestinations.jsx

"use client";

import React from "react";
import Spinner from "@/components/common/Spinner";
import Alert from "react-bootstrap/Alert"; // Ensure correct import
import Image from "next/image";
import Link from "next/link";

import useDestinations from "@/app/lib/hooks/useDestinations";

export default function AllDestinations() {
  // Use the custom hook to fetch all destinations
  const { destinations, isLoading, error } = useDestinations(); // No slug means fetch all

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner animation="border" variant="light" />
      </div>
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
              All Destinations
            </h2>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-30 justify-between xl:justify-center sm:justify-start pt-40 sm:pt-20 mobile-css-slider -w-160"
        >
          {destinations.map((elm) => (
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
        </div>
      </div>
    </section>
  );
}
