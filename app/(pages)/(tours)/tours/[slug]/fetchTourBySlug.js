import React from "react";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header2 from "@/components/layout/header/Header2";
import PageHeader from "@/components/tourSingle/PageHeader";
import TourSlider from "@/components/tourSingle/TourSlider";
import SingleThreeClient from "./SingleThreeClient"; // Client component
import { notFound } from "next/navigation";
import { fetchTourBySlug } from "./fetchTourBySlug"; // Import the helper function

/**
 * Define dynamic metadata based on the tour's SEO data
 */
export const metadata = async ({ params }) => {
  const slug = params?.slug;

  if (!slug) {
    console.warn("No slug provided in metadata function.");
    return {
      title: "Tour Not Found",
      description: "The tour you are looking for does not exist.",
      keywords: "tour, not found",
    };
  }

  const { tour, error } = await fetchTourBySlug(slug);

  if (error || !tour) {
    console.warn(`Tour not found for slug: ${slug}`);
    return {
      title: "Tour Not Found",
      description: "The tour you are looking for does not exist.",
      keywords: "tour, not found",
    };
  }

  // Extract SEO data for dynamic meta tags
  const {
    seoTitle_en,
    seoDescription_en,
    seoKeywords_en,
    seoTitle_DE,
    seoDescription_DE,
    seoKeywords_DE,
  } = tour.seo || {};

  return {
    title: seoTitle_en || seoTitle_DE || "Default Tour Title",
    description:
      seoDescription_en ||
      seoDescription_DE ||
      "Default description for the tour.",
    keywords:
      seoKeywords_en ||
      seoKeywords_DE ||
      "default, keywords, tour, kilimanjaro,",
    openGraph: {
      type: "website",
      url: `https://www.serengetinexus.com/tours/${slug}`, // Use the correct URL for Open Graph
      title: seoTitle_en || seoTitle_DE || "Default Tour Title",
      description:
        seoDescription_en ||
        seoDescription_DE ||
        "Default description for the tour.",
      images: tour.images && tour.images.length > 0 ? [tour.images[0].url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle_en || seoTitle_DE || "Default Tour Title",
      description:
        seoDescription_en ||
        seoDescription_DE ||
        "Default description for the tour.",
      images: tour.images && tour.images.length > 0 ? [tour.images[0].url] : [],
    },
  };
};

/**
 * Server Component: Fetches the specific tour and renders the page
 */
const TourSinglePage = async ({ params }) => {
  const slug = params?.slug;

  if (!slug) {
    notFound();
  }

  const { tour, error } = await fetchTourBySlug(slug);

  if (error || !tour) {
    notFound();
  }

  return (
    <main>
      <Header2 />
      <PageHeader />

      <SingleThreeClient tour={tour} />

      <TourSlider tour={tour} />
      <FooterOne />
    </main>
  );
};

export default TourSinglePage;
