// app/components/GuidesSection.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import GuideHero from "./GuideHero";
import GuideList from "./GuideList";
import debounce from "lodash.debounce";
import Header4 from "./layout/header/Header4";
import Header2 from "./layout/header/Header2";
import FooterOne from "./layout/footers/FooterOne";
export const metadata = {
  title: "Practical information | Tanzania Specialist",
  description:
    "Serengeti Nexus, Whether you plan to explore Tanzania, immerse yourself in its rich culture, or experience its breathtaking natural beauty, we are here to help. In this guide you’ll find practical advice for a safe and memorable trip to Tanzania, including important information about yellow fever requirements, local weather, the ideal time to visit, our website and some keywords for tanzania tourism.",
  keywords: "tanzania tourism, practical information, safari guide, tanzania travel, Serengeti Nexus",
  openGraph: {
    title: "Practical information | Tanzania Specialist",
    description:
      "Serengeti Nexus, Whether you plan to explore Tanzania, immerse yourself in its rich culture, or experience its breathtaking natural beauty, we are here to help. In this guide you’ll find practical advice for a safe and memorable trip to Tanzania, including important information about yellow fever requirements, local weather, the ideal time to visit, our website and some keywords for tanzania tourism.",
    url: "https://www.serengetinexus.com/tanzaniasafariguide",
    siteName: "SerengetiNexus",
    images: [
      {
        url: "https://www.serengetinexus.com/img/placeholder.png",
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
    title: "Practical information | Tanzania Specialist",
    description:
      "Serengeti Nexus, Whether you plan to explore Tanzania, immerse yourself in its rich culture, or experience its breathtaking natural beauty, we are here to help. In this guide you’ll find practical advice for a safe and memorable trip to Tanzania, including important information about yellow fever requirements, local weather, the ideal time to visit, our website and some keywords for tanzania tourism.",
    images: ["https://www.serengetinexus.com/img/placeholder.png"],
  },
  additionalMetaTags: [
    {
      name: "robots",
      content: "index, follow",
    },
  ],
};

export default function GuidesSection({ guides }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuides, setFilteredGuides] = useState(guides);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  const performSearch = (term) => {
    if (!term) {
      setFilteredGuides(guides);
    } else {
      const lowercasedTerm = term.toLowerCase();
      const filtered = guides.filter((guide) => {
        const titleMatch = guide.title.toLowerCase().includes(lowercasedTerm);
        const descriptionPlain = stripHtml(guide.description).toLowerCase();
        const descriptionMatch = descriptionPlain.includes(lowercasedTerm);
        return titleMatch || descriptionMatch;
      });
      setFilteredGuides(filtered);
    }
  };

  // Debounce the search function to delay execution
  const debouncedSearch = useCallback(debounce(performSearch, 300), [guides]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    // Cancel the debounce on unmount
    return debouncedSearch.cancel;
  }, [searchTerm, debouncedSearch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      {/* Integrate GuideHero with search callback */}
      <Header2 />
      <GuideHero onSearch={handleSearch} />

      {/* Display filtered guides */}
      <GuideList guides={filteredGuides} />
      <FooterOne />
    </>
  );
}
