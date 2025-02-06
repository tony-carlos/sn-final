// app/tanzaniasafariguide/[slug]/page.jsx

import React from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SingleSafariGuide from "@/components/SingleSafariGuide";
import { notFound } from "next/navigation";

/**
 * Server Component to display details of a single Safari Guide based on slug.
 *
 * @param {Object} props - Contains route parameters.
 * @param {Object} props.params - Route parameters.
 * @param {string} props.params.slug - Slug identifier for the guide.
 *
 * @returns {JSX.Element} - Rendered Safari Guide detail page.
 */
const SafariGuideDetail = async ({ params }) => {
  const { slug } = params;
  let guide = null;

  try {
    const guidesRef = collection(db, "safariguide");
    const q = query(guidesRef, where("slug", "==", slug));
    const guidesSnapshot = await getDocs(q);

    if (guidesSnapshot.empty) {
      notFound(); // Trigger Next.js's 404 page
    } else {
      const guideDoc = guidesSnapshot.docs[0];
      guide = guideDoc.data();
    }
  } catch (error) {
    console.error("Error fetching Safari Guide:", error);
    notFound(); // Optionally, trigger 404 on error
  }

  if (!guide) {
    return null; // Or a fallback UI
  }

  return <SingleSafariGuide guide={guide} />;
};

export default SafariGuideDetail;

/**
 * Generate Metadata for the Safari Guide Detail Page
 *
 * @param {Object} params - Route parameters.
 * @param {string} params.slug - Slug identifier for the guide.
 *
 * @returns {Object} - Metadata object for the page.
 */
export async function generateMetadata({ params }) {
  const { slug } = params;
  let guide = null;

  try {
    const guidesRef = collection(db, "safariguide");
    const q = query(guidesRef, where("slug", "==", slug));
    const guidesSnapshot = await getDocs(q);

    if (!guidesSnapshot.empty) {
      const guideDoc = guidesSnapshot.docs[0];
      guide = guideDoc.data();
    }
  } catch (error) {
    console.error("Error fetching Safari Guide for metadata:", error);
  }

  if (!guide) {
    return {
      title: "Guide Not Found | SerengetiNexus",
      description: "The requested safari guide does not exist.",
    };
  }

  // Structured Data Generation
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": guide.title,
    "description": guide.description.replace(/<[^>]*>?/gm, ""), // Plain text description
    "image": guide.images && guide.images.length > 0 ? guide.images[0] : "https://www.serengetinexus.com/img/placeholder.png",
    "url": `https://www.serengetinexus.com/tanzaniasafariguide/${slug}`,
    "jobTitle": "Safari Guide",
    "affiliation": {
      "@type": "Organization",
      "name": "SerengetiNexus",
      "url": "https://www.serengetinexus.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.serengetinexus.com/img/logo.png", // Ensure this image exists in your public/img directory
        "width": 600,
        "height": 60
      }
    },
    "sameAs": guide.socialProfiles || [] // Array of URLs to social profiles if available
  };

  return {
    title: guide.seo?.title || `${guide.title} | SerengetiNexus`,
    description: guide.seo?.description || guide.title,
    keywords: guide.seo?.keywords?.join(", ") || "safari, tanzania, travel",
    openGraph: {
      title: guide.seo?.title || `${guide.title} | SerengetiNexus`,
      description: guide.seo?.description || guide.title,
      url: `https://www.serengetinexus.com/tanzaniasafariguide/${slug}`,
      siteName: "SerengetiNexus",
      images: [
        {
          url: guide.images && guide.images.length > 0 ? guide.images[0] : "https://www.serengetinexus.com/img/placeholder.png",
          width: 1200,
          height: 630,
          alt: "Tanzania Safari Guides",
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seo?.title || `${guide.title} | SerengetiNexus`,
      description: guide.seo?.description || guide.title,
      images: [guide.images && guide.images.length > 0 ? guide.images[0] : "https://www.serengetinexus.com/img/placeholder.png"],
    },
    // You can add more metadata properties if needed
    additionalMetaTags: [
      {
        name: "robots",
        content: "index, follow",
      },
    ],
    // Embed structured data
    structuredData: JSON.stringify(structuredData),
  };
}
