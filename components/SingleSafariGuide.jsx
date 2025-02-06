// app/components/SingleSafariGuide.jsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import DOMPurify from "dompurify";
import Header4 from "./layout/header/Header4";
import Header2 from "./layout/header/Header2";
import FooterOne from "./layout/footers/FooterOne";

/**
 * SingleSafariGuide Component to display details of a single Safari Guide.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.guide - Safari Guide object containing title, description, images, etc.
 *
 * @returns {JSX.Element} - Rendered Safari Guide detail with SEO enhancements.
 */
export default function SingleSafariGuide({ guide }) {
  const [sanitizedDescription, setSanitizedDescription] = useState("");

  useEffect(() => {
    // Sanitize the description to safely render HTML content
    if (guide.description) {
      setSanitizedDescription(DOMPurify.sanitize(guide.description));
    }
  }, [guide.description]);

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": guide.title,
    "description": guide.description.replace(/<[^>]*>?/gm, ""), // Plain text description
    "image": guide.images && guide.images.length > 0 ? guide.images[0] : "https://www.serengetinexus.com/img/placeholder.png",
    "url": `https://www.serengetinexus.com/tanzaniasafariguide/${guide.slug}`,
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

  // Optional: Breadcrumb Structured Data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.serengetinexus.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Safari Guides",
        "item": "https://www.serengetinexus.com/tanzaniasafariguide"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": guide.title,
        "item": `https://www.serengetinexus.com/tanzaniasafariguide/${guide.slug}`
      }
    ]
  };

  return (
    <>
      <Head>
        {/* Dynamic SEO Metadata */}
        <title>{guide.seo?.title || `${guide.title} | SerengetiNexus`}</title>
        <meta name="description" content={guide.seo?.description || guide.title} />
        <meta
          name="keywords"
          content={guide.seo?.keywords?.join(", ") || "safari, tanzania, travel"}
        />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={guide.seo?.title || guide.title} />
        <meta property="og:description" content={guide.seo?.description || guide.title} />
        <meta
          property="og:image"
          content={
            guide.seo?.image ||
            (guide.images && guide.images[0]) ||
            "https://www.serengetinexus.com/img/placeholder.png"
          }
        />
        <meta
          property="og:url"
          content={`https://www.serengetinexus.com/tanzaniasafariguide/${guide.slug}`}
        />
        <meta property="profile:firstName" content={guide.firstName || ""} />
        <meta property="profile:lastName" content={guide.lastName || ""} />
        <meta property="profile:username" content={guide.username || ""} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={guide.seo?.title || guide.title} />
        <meta name="twitter:description" content={guide.seo?.description || guide.title} />
        <meta
          name="twitter:image"
          content={
            guide.seo?.image ||
            (guide.images && guide.images[0]) ||
            "https://www.serengetinexus.com/img/placeholder.png"
          }
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      </Head>

      {/* Original UI Starts Here */}
      <Header2 />

      <section className="pageHeader -type-1">
        <div className="container">
          <div className="row y-gap-30 justify-center">
            <div className="col-lg-8">
              <h2 className="text-30 md:text-24">{guide.title}</h2>

              {/* Display the sanitized description with HTML formatting */}
              <div className="mt-20" style={{ textAlign: "justify" }}>
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                ></div>
              </div>

              {/* Display images */}
              {guide.images && guide.images.length > 0 && (
                <div className="row y-gap-30 pt-20">
                  {guide.images.map((imgUrl, index) => (
                    <div key={index} className="col-md-6">
                      <Image
                        src={imgUrl}
                        alt={`${guide.title} Image ${index + 1}`}
                        width={410}
                        height={350}
                        className="rounded-8"
                        priority={index === 0} // Prioritize the first image
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Back to Guides Button */}
              <div className="mt-30">
                <Link href="/tanzaniasafariguide" className="btn btn-secondary">
                  Back to Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterOne />
    </>
  );
}
