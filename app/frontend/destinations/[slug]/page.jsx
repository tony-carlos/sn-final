// app/frontend/destinations/[slug]/page.jsx

import React from "react";
import { notFound } from "next/navigation";
import DestinationClient from "./DestinationClient"; // Import the client component

import { fetchDestinationBySlug } from "@/app/lib/services/destinations";
/**
 * Generates metadata for the destination page based on the slug.
 * This runs on the server side.
 *
 * @param {Object} param0 - Contains params with slug.
 * @returns {Object} - Metadata object with title and description.
 */
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const destination = await fetchDestinationBySlug(slug);

    return {
      title: destination.seo?.title || destination.title,
      description: destination.seo?.description || destination.overview,
    };
  } catch (error) {
    console.error(`Error generating metadata for slug (${slug}):`, error);
    return {
      title: "Destination Not Found",
      description: "The destination you are looking for does not exist.",
    };
  }
}

/**
 * Server-side component to verify destination existence and render the client component.
 *
 * @param {Object} param0 - Contains params with slug.
 * @returns {JSX.Element} - The DestinationClient component.
 */
export default async function DestinationPage({ params }) {
  const { slug } = params;

  try {
    const destination = await fetchDestinationBySlug(slug);
    if (!destination) {
      notFound();
    }

    // Render the client component which will fetch data client-side
    return <DestinationClient slug={slug} />;
  } catch (error) {
    console.error("Error rendering single destination page:", error);
    notFound(); // Render 404 page on error
  }
}
