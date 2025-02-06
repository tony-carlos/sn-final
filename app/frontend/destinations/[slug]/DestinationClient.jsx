"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import ActivitiesZone from "../ActivitiesZone";
import Attractions from "@/components/frontend/destinations/Attractions";
import CommonAnimals from "@/components/frontend/destinations/CommonAnimals";
import VideoBanner from "../VideoBanner";
import DestinationMap from "../DestinationMap";
import { formatText } from "@/app/lib/utils/formatText";
import { Alert } from "react-bootstrap";
import useDestination from "@/app/hooks/useDestination";
import { useRelatedTours } from "@/app/hooks/useRelatedTours"; // New Hook
import TourSliderR from "@/components/tourSingle/TourSliderR";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header2 from "@/components/layout/header/Header2";
import Spinner from "@/components/common/Spinner";
import { getYouTubeVideoId } from "@/app/utils/getYouTubeVideoId";
import Gallery1 from "@/components/frontend/destinations/Gallery1";

export default function DestinationClient({ slug }) {
  // 1. Call all Hooks at the top
  const { destination, seo, isLoading, error } = useDestination(slug);
  // Removed: const [enhancedSeo, setEnhancedSeo] = useState(seo);

  // Extract the label of the destination for filtering related tours
  const destinationLabel = destination?.title || null; // Updated

  // Use the new hook to fetch related tours based on the destination label
  const {
    relatedTours,
    loading: relatedLoading,
    error: relatedError,
  } = useRelatedTours(destinationLabel);

  // 2. Removed the useEffect for enhanceSeoMetadata

  // 3. Conditional Rendering Based on Loading and Error States
  if (isLoading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!destination)
    return <Alert variant="danger">Destination not found.</Alert>;

  // Destructure destination data
  const {
    overview,
    gettingThere,
    climate,
    attractions = [],
    commonAnimals = [],
    activities = [],
    images = [],
    youtubeLink = "",
    title, // Updated
    zone,
    type,
    boundary,
  } = destination;

  // Sanitize HTML content
  const sanitizedOverview = DOMPurify.sanitize(overview);
  const sanitizedGettingThere = DOMPurify.sanitize(gettingThere);
  const sanitizedClimate = DOMPurify.sanitize(climate);

  // Determine hero image and video ID
  const heroImage = images.length > 0 ? images[0].url : "/img/hero/1/shape.svg";
  const videoId = getYouTubeVideoId(youtubeLink);

  // Custom CSS for text justification (optional: can be moved to a CSS module or global stylesheet)
  const textJustifyStyle = {
    textAlign: "justify",
    textJustify: "inter-word",
  };

  // Helper function to determine column size based on presence of data
  const getColumnSize = (hasData) => (hasData ? "col-md-6" : "col-md-12");

  return (
    <>
      <Head>
        <title>{seo?.title || title}</title> {/* Updated */}
        <meta
          name="description"
          content={seo?.description || "Explore this destination"}
        />
        <meta property="og:title" content={seo?.title || title} />{" "}
        {/* Updated */}
        <meta
          property="og:description"
          content={seo?.description || "Explore this destination"}
        />
        <meta property="og:image" content={heroImage} />
      </Head>
      <Header2 />
      <section className="pageHeader -type-1 position-relative">
        <div className="pageHeader__bg">
          <Image
            src={heroImage}
            alt={`${title} Hero Image`} // Updated
            width={1920} // Adjust as needed
            height={1080} // Adjust as needed
            style={{ objectFit: "cover" }} // Inline styles for objectFit
            quality={80}
            priority
            onError={(e) => {
              e.currentTarget.src = "/img/hero/fallback.svg"; // Adjust path as needed
            }}
          />
          {/* Overlay for Title, Zone, and Type */}
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white px-3">
            {/* Destination Title */}
            <h1 className="pageHeader__title display-4 fw-bold fs-3 fs-md-1">
              {title} {/* Updated */}
            </h1>

            {/* Zone and Type Information */}
            <h6 className="fw-bold fst-italic mt-3 fs-6 fs-md-5 text-white">
              {zone ? formatText(zone) : "Zone N/A"} |{" "}
              {type ? formatText(type) : "Type N/A"}
            </h6>
          </div>
        </div>
      </section>

      {/* Updated Section with container to maintain UI integrity */}
      <section className="layout-pt-xl layout-pb-xl text-white">
        <div className="container">
          {/* Overview and Gallery */}
          <div className="row">
            <div className="col-md-6" style={textJustifyStyle}>
              <h2>Overview</h2>
              <div dangerouslySetInnerHTML={{ __html: sanitizedOverview }} />
            </div>
            <div className="col-md-6">
              <h3>Gallery</h3>
              <Gallery1 images={images} />
            </div>
          </div>

          {/* Getting There and Map */}
          <div className="row pt-40">
            {/* Conditional Rendering for Getting There */}
            {gettingThere && (
              <div className={getColumnSize(gettingThere)}>
                <h3>Getting There</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizedGettingThere }}
                />
              </div>
            )}

            {/* Map Section */}
            <div
              className={
                gettingThere ? "col-md-6" : "col-md-12"
              } /* Adjust column size based on Getting There presence */
            >
              <h3>Map</h3>
              <DestinationMap
                destinationName={title}
                boundary={boundary}
              />{" "}
              {/* Updated */}
            </div>
          </div>

          {/* Activities Section */}
          {activities.length > 0 && (
            <div className="row pt-40" style={textJustifyStyle}>
              <div className="col-12">
                <ActivitiesZone activities={activities} />
              </div>
            </div>
          )}

          {/* Climate and Video Banner */}
          <div className="row pt-40">
            {/* Conditional Rendering for Climate */}
            {climate && (
              <div className={getColumnSize(climate)}>
                <h3>Climate</h3>
                <div dangerouslySetInnerHTML={{ __html: sanitizedClimate }} />
              </div>
            )}

            {/* Video Banner Section */}
            <div
              className={
                climate ? "col-md-6" : "col-md-12"
              } /* Adjust column size based on Climate presence */
            >
              {videoId && <VideoBanner videoId={videoId} />}
            </div>
          </div>

          {/* Common Animals and Attractions */}
          <div className="row">
            <div className="col-md-6">
              <Attractions attractions={attractions} />
            </div>
            <div className="col-md-6">
              <CommonAnimals commonAnimals={commonAnimals} />
            </div>
          </div>

          {/* Related Tours Section */}
          <div className="row pt-40">
            <div className="col-12">
              {relatedLoading && <Spinner />}
              {relatedError && <Alert variant="danger">{relatedError}</Alert>}
              {!relatedLoading && !relatedError && relatedTours.length > 0 && (
                <TourSliderR tours={relatedTours} destinationName={title} />
              )}
              {!relatedLoading &&
                !relatedError &&
                relatedTours.length === 0 && <div>No related tours found.</div>}
            </div>
          </div>
        </div>
      </section>

      <FooterOne />
    </>
  );
}
