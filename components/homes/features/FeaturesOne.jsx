// src/components/FeaturesOne.js

import React from "react";
import Head from 'next/head';
import { features } from "@/data/features";
import Image from "next/image";

export default function FeaturesOne() {
  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Why Travel with Serengeti Nexus | Serengeti Nexus</title>
        <meta
          name="description"
          content="Discover the exceptional services offered by Serengeti Nexus, including exclusive safaris, hiking adventures, cultural tours, and customized itineraries tailored to your Tanzanian journey."
        />
        <meta
          name="keywords"
          content="Serengeti Nexus, Tanzania safaris, hiking in Tanzania, cultural tours Tanzania, customized itineraries Tanzania, Serengeti National Park, Great Migration, Big Five Tanzania"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Why Travel with Serengeti Nexus | Serengeti Nexus" />
        <meta
          property="og:description"
          content="Discover the exceptional services offered by Serengeti Nexus, including exclusive safaris, hiking adventures, cultural tours, and customized itineraries tailored to your Tanzanian journey."
        />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Why Travel with Serengeti Nexus | Serengeti Nexus" />
        <meta
          name="twitter:description"
          content="Discover the exceptional services offered by Serengeti Nexus, including exclusive safaris, hiking adventures, cultural tours, and customized itineraries tailored to your Tanzanian journey."
        />
      </Head>

      {/* Existing UI */}
      <section className="layout-pt-xl">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <h2 data-aos="fade-up" className="text-30 md:text-24">
                Why Travel with Serengeti Nexus
              </h2>
            </div>
          </div>

          <div
            data-aos="fade-up"
            className="row md:x-gap-20 pt-40 sm:pt-20 mobile-css-slider -w-280"
          >
            {features.map((elm, i) => (
              <div key={i} className="col-lg-3 col-sm-6">
                <div className="featureIcon -type-1 pr-40 md:pr-0">
                  <div className="featureIcon__icon">
                    <Image
                      width={60}
                      height={60}
                      src={elm.iconSrc}
                      alt="icon"
                    />
                  </div>

                  <h3 className="featureIcon__title text-18 fw-500 mt-30">
                    {elm.title}
                  </h3>
                  <p className="featureIcon__text mt-10">{elm.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
