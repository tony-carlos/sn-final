// app/(pages)/(tours)/tours/[slug]/page.jsx

import React from "react";
import { notFound } from "next/navigation";
import Header2 from "@/components/layout/header/Header2";
import FooterOne from "@/components/layout/footers/FooterOne";
import PageHeader from "@/components/tourSingle/PageHeader";
import TourPageClient from "./TourPageClient";

/**
 * Generate dynamic metadata for SEO
 */
export const generateMetadata = async ({ params }) => {
  const { slug } = params || {};
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.serengetinexus.com';

  if (!slug) {
    return {
      title: "Tour Not Found | Serengeti Nexus",
      description: "The requested safari tour could not be found.",
      keywords: "serengeti safari, tanzania safari",
      robots: { index: false, follow: true }
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/seo/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error("SEO data not found");
    }

    const seoData = await res.json();
    
    const title = seoData.seoTitle_en || `${slug.replace(/-/g, ' ')} Safari Tour`;
    const description = seoData.seoDescription_en || 
      "Experience an unforgettable safari adventure in the Serengeti. Book your tour today!";
    const keywords = seoData.seoKeywords_en || 
      "serengeti safari, tanzania safari, wildlife tours";

    return {
      title: `${title} | Serengeti Nexus`,
      description,
      keywords,
      openGraph: {
        title: title,
        description,
        url: `${baseUrl}/tours/${slug}`,
        siteName: "Serengeti Nexus",
        images: [{
          url: seoData.ogImage || `${baseUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title
        }],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description,
        images: [seoData.ogImage || `${baseUrl}/default-og-image.jpg`],
        creator: '@serengetinexus',
        site: '@serengetinexus'
      },
      alternates: {
        canonical: `${baseUrl}/tours/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return notFound();
  }
};
/**
 * Page Component to display tour data
 */
const TourPage = ({ params }) => {
  const { slug } = params || {}; // Safely destructure slug

  if (!slug) {
    notFound();
  }

  return (
    <main>
      <Header2 />
      <PageHeader />
      <TourPageClient slug={slug} /> {/* Render the Client Component */}
      <FooterOne />
    </main>
  );
};

export default TourPage;
