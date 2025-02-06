// components/tourSingle/pages/SingleThree.jsx

"use client";

import React from "react";
import TourSingleSidebar from "../TourSingleSidebar";
import CommentBox from "../CommentBox";
import Reviews from "../Reviews";
import Rating from "../Rating";
import Faq from "../Faq";
import OthersInformation from "../OthersInformation";
import Overview from "../Overview";
import Included from "../Included";
import MainInformation2 from "./MainInformation2";
import Gallery3 from "../Galleries/Gallery3";
import DateCalender from "../DateCalender";
import Map from "@/components/tours/Map";
import Itinerary from "./Itinerary";
import PriceDisplay from "@/components/tours/PriceDisplay";
import RatesAndAvailability from "@/components/tours/RatesAndAvailability";

export default function SingleThree({ tour }) {
  return (
    <section className="pt-30 js-pin-container">
      <div className="container">
        <div className="row y-gap-30 justify-between">
          <div className="col-lg-8">
            <MainInformation2 tour={tour} />

            <Gallery3 tour={tour} />

            <div className="row y-gap-20 justify-between items-center layout-pb-md pt-60 md:pt-30">
              <OthersInformation tour={tour} />
            </div>

            <Overview tour={tour} />

            <div className="line mt-60 mb-60"></div>

            <h2 className="text-30">Whats Included</h2>

            <Included tour={tour} />

            <div className="line mt-60 mb-60"></div>

            <h2 className="text-30">Itinerary</h2>

            <Itinerary tour={tour} />
            <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
            <div className="mapTourSingle">
              <Map tour={tour} />
            </div>

            <div className="line mt-60 mb-60"></div>

            <h2 className="text-30">Season Prices</h2>
            <div className="">
              <PriceDisplay pricing={tour.pricing.manual} />
            </div>

            <div className="line mt-60 mb-60"></div>

            <h2 className="text-30">Rates & Availability</h2>
            <div className="mt-8">
              <RatesAndAvailability tour={tour} />
            </div>
            <div className="line mt-60 mb-60"></div>

      
          </div>
          <div className="col-lg-4">
            <div className="d-flex justify-end js-pin-content">
              <TourSingleSidebar tour={tour} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
