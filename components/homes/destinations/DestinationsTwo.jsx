// app/frontend/destinations/DestinationsTwo.jsx

import Spinner from "@/components/common/Spinner";
import { Alert } from "react-bootstrap"; // Updated import to use react-bootstrap's Alert
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDestinations } from "@/app/hooks/useDestinations";
export default function DestinationsTwo() {
  // Use the custom hook to fetch all destinations
  const { destinations, isLoading, error } = useDestinations(); // No slug means fetch all

  // Render loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-10">
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
        {/* Header Section */}
        <div className="row y-gap-10 justify-between align-items-end">
          <div className="col-auto">
            <h2 data-aos="fade-up" className="text-30">
              Top Destinations
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href="/destinations"
              data-aos="fade-right"
              className="buttonArrow d-flex align-items-center"
            >
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ms-2"></i>
            </Link>
          </div>
        </div>

        {/* Destinations Grid */}
        <div
          data-aos="fade-up"
          className="row y-gap-30 justify-between xl:justify-center sm:justify-start pt-40 sm:pt-20"
        >
          {destinations.map((elm) => (
            <div key={elm.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
              <Link
                href={`/frontend/destinations/${elm.slug}`}
                className="-hover-image-scale text-decoration-none text-dark"
              >
                <div className="ratio ratio-19x21 rounded-12 overflow-hidden">
                  <Image
                    src={
                      elm.images && elm.images[0]
                        ? elm.images[0].url
                        : "/placeholder.jpg"
                    }
                    alt={elm.title || "Destination Image"}
                    width={260}
                    height={260}
                    className="img-fluid rounded-12"
                  />
                </div>

                <h3 className="text-18 fw-500 mt-20">{elm.title}</h3>
                <p className="text-14">{elm.tours}+ Tours</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
