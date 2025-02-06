// components/homes/destinations/TrendingDestinationsTwo.jsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner, Alert } from "react-bootstrap";

export default function TrendingDestinationsTwo() {
  // State variables for destinations, loading, and error
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/frontend/destinations/all");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setDestinations(data);
        } else {
          throw new Error("Unexpected data structure received from API.");
        }
      } catch (err) {
        console.error("Error fetching all destinations:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <section className="layout-pt-xl layout-pb-xl bg-dark-1">
        <div className="container text-center">
          <Spinner animation="border" variant="light" />
        </div>
      </section>
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

  // Render destinations
  return (
    <section className="layout-pt-xl layout-pb-xl bg-dark-1">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2
              data-aos="fade-up"
              data-aos-delay=""
              className="text-30 md:text-24 text-white"
            >
              Trending Destinations
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href={"/tour-list-1"}
              data-aos="fade-left"
              data-aos-delay=""
              className="buttonArrow d-flex items-center text-white"
            >
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </Link>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-30 justify-between pt-40 sm:pt-20"
        >
          {destinations.map((elm) => (
            <div key={elm.id} className="col-lg-3 col-md-6">
              <Link
                href={`/frontend/destinations/${elm.slug}`} // Updated Link
                className="featureCard -type-4 -hover-image-scale"
              >
                <div className="featureCard__image ratio ratio-3:4 -hover-image-scale__image rounded-12">
                  <Image
                    width={450}
                    height={600}
                    src={
                      elm.images && elm.images[0]
                        ? elm.images[0].url
                        : "/placeholder.jpg"
                    }
                    alt={elm.title || "Destination Image"}
                    className="img-ratio"
                  />
                </div>

                <div className="featureCard__content text-center">
                  <h4 className="text-20 fw-500 text-white">{elm.title}</h4>
                  <div className="text-14 lh-14 text-white">
                    {elm.tourCount}+ Tours
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
