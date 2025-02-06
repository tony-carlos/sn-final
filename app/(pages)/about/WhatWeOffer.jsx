// src/components/WhatWeOffer.js

import React from "react";

export default function WhatWeOffer() {
  return (
    <section className="layout-pt-xl ">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto ">
            <h2 className="text-30 md:text-24">
              What We Offer
            </h2>
          </div>
        </div>

        <div className="row md:x-gap-20 pt-40 sm:pt-20">
          <div className="col-lg-3 col-sm-6">
            <div className="featureIcon -type-1 pr-40 md:pr-0">
              <div className="featureIcon__icon">
                {/* Replace with appropriate icon */}
                <img src="/icons/binoculars-safari-svgrepo-com.svg" alt="Exclusive Safaris" width={60} height={60} />
              </div>

              <h3 className="featureIcon__title text-18 fw-500 mt-30">
                Exclusive Safaris
              </h3>
              <p className="featureIcon__text mt-10">
                Explore the iconic Serengeti National Park, witness the Great Migration, and encounter the Big Five in their natural habitat with our exclusive safaris.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="featureIcon -type-1 pr-40 md:pr-0">
              <div className="featureIcon__icon">
                {/* Replace with appropriate icon */}
                <img src="/icons/hiking-svgrepo-com (2).svg" alt="Hiking Adventures" width={60} height={60} />
              </div>

              <h3 className="featureIcon__title text-18 fw-500 mt-30">
                Hiking Adventures
              </h3>
              <p className="featureIcon__text mt-10">
                Traverse the diverse landscapes of Tanzania, from Mount Kilimanjaro to the Ngorongoro Conservation Area, tailored to your hiking level and interests.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="featureIcon -type-1 pr-40 md:pr-0">
              <div className="featureIcon__icon">
                {/* Replace with appropriate icon */}
                <img src="/icons/tanzania-svgrepo-com (1).svg" alt="Cultural Tours" width={60} height={60} />
              </div>

              <h3 className="featureIcon__title text-18 fw-500 mt-30">
                Cultural Tours
              </h3>
              <p className="featureIcon__text mt-10">
                Immerse yourself in the vibrant cultures of Tanzania’s indigenous communities through traditional ceremonies and local village visits.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="featureIcon -type-1 pr-40 md:pr-0">
              <div className="featureIcon__icon">
                {/* Replace with appropriate icon */}
                <img src="/icons/itinerary-map-route-svgrepo-com.svg" alt="Customized Itineraries" width={60} height={60} />
              </div>

              <h3 className="featureIcon__title text-18 fw-500 mt-30">
                Customized Itineraries
              </h3>
              <p className="featureIcon__text mt-10">
                We design bespoke itineraries tailored to your interests, ensuring a personalized and memorable journey through Tanzania.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
