// app/tanzaniasafariguide/page.jsx
import React from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import GuidesSection from "@/components/GuidesSection";

// Metadata configuration
export const metadata = {
  title: "Tanzania Safari Guides 2025 | SerengetiNexus",
  description:
    "Discover expert Tanzania safari guides with SerengetiNexus. Our experienced guides lead unforgettable 2025 safaris across Serengeti, Ngorongoro, and more, ensuring you witness the Big Five and the incredible wildebeest migration.",
  keywords:
    "Tanzania safari guides, SerengetiNexus, Serengeti National Park guides, Ngorongoro Conservation guides, Tanzania wildlife guides, expert safari guides, Big Five Tanzania, wildebeest migration guides, 2025 Tanzania safaris, Serengeti tours, Ngorongoro safaris, Tanzania adventure guides, professional safari guides, guided safaris Tanzania, best Tanzania guides, Tanzania safari experiences, Serengeti migration guides, Tanzania travel experts, wildlife safari guides, Tanzania tour guides",
  openGraph: {
    title: "Tanzania Safari Guides 2025 | SerengetiNexus",
    description:
      "Discover expert Tanzania safari guides with SerengetiNexus. Our experienced guides lead unforgettable 2025 safaris across Serengeti, Ngorongoro, and more, ensuring you witness the Big Five and the incredible wildebeest migration.",
    url: "https://www.serengetinexus.com/tanzaniasafariguide",
    siteName: "SerengetiNexus",
    images: [
      {
        url: "https://www.serengetinexus.com/images/tanzania-safari-guides-og.jpg",
        width: 1200,
        height: 630,
        alt: "Tanzania Safari Guides",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanzania Safari Guides 2025 | SerengetiNexus",
    description:
      "Discover expert Tanzania safari guides with SerengetiNexus. Our experienced guides lead unforgettable 2025 safaris across Serengeti, Ngorongoro, and more, ensuring you witness the Big Five and the incredible wildebeest migration.",
    images: [
      "https://www.serengetinexus.com/images/tanzania-safari-guides-twitter.jpg",
    ],
  },
  alternates: {
    canonical: "https://www.serengetinexus.com/tanzaniasafariguide",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Helper function to generate structured data
function generateStructuredData(guides) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: metadata.title,
    description: metadata.description,
    url: metadata.openGraph.url,
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${metadata.openGraph.url}/${guide.slug}`,
      name: guide.title,
      description: guide.description.replace(/<[^>]*>?/gm, ""),
      image:
        guide.images?.[0] ??
        "https://www.serengetinexus.com/img/placeholder.png",
      person: {
        "@type": "Person",
        name: guide.title,
      },
    })),
  };
}

// Helper function to transform guide data
function transformGuideData(guide) {
  return {
    imgSrc1: guide.images?.[0] ?? "/img/placeholder.png",
    imgSrc2: guide.images?.[1] ?? null,
    title: guide.title,
    description: guide.description,
    content: guide.description
      ? `${guide.description.replace(/<[^>]*>?/gm, "").substring(0, 100)}...`
      : "No description available.",
    slug: guide.slug,
  };
}

async function SafariGuidesList() {
  let travelGuides = [];

  try {
    const guidesCollection = collection(db, "safariguide");
    const guidesSnapshot = await getDocs(guidesCollection);
    travelGuides = guidesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching Travel Guides:", error);
    // Consider adding error boundary or fallback UI
  }

  const guidesForComponent = travelGuides.map(transformGuideData);
  const structuredData = generateStructuredData(travelGuides);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuidesSection guides={guidesForComponent} />
    </>
  );
}

export default SafariGuidesList;
