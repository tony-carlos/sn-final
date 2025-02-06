
// app/frontend/destinations/page.jsx
import React from 'react';
import Header2 from "@/components/layout/header/Header2";
import Hero from "@/components/pages/destinations/Hero";
import FooterOne from "@/components/layout/footers/FooterOne";

// Import client components
import AllDestinations from '@/app/frontend/AllDestinations';
import ArticlesOne from '@/components/homes/articles/ArticlesOne';

export const metadata = {
  title: "Explore Tanzania | Serengeti Nexus - Premier Tanzania Travel & Tour Agency",
  description:
    "Discover the beauty of Tanzania with Serengeti Nexus. Experience unforgettable safaris, stunning beaches in Zanzibar, and majestic Mount Kilimanjaro. Your adventure in Tanzania awaits!",
    keywords: [
      "Tanzania travel",
      "Tanzania tours",
      "Safari Tanzania",
      "Serengeti National Park",
      "Mount Kilimanjaro",
      "Zanzibar beaches",
      "Ngorongoro Crater",
      "Zanzibar resorts",
      "Tanzania wildlife",
      "Safari packages Tanzania",
      "Tanzania adventure",
      "Zanzibar safari",
      "Tanzania vacations",
      "Dar es Salaam tours",
      "Tanzania honeymoon",
      "Zanzibar excursions",
      "Tanzania safari guides",
      "Zanzibar activities",
      "Tanzania national parks",
      "Zanzibar culture",
      "Tanzania luxury safaris",
      "Zanzibar diving",
      "Tanzania family tours",
      "Zanzibar snorkeling",
      "Tanzania eco-tourism",
      "Zanzibar historical sites",
      "Tanzania bird watching",
      "Zanzibar spice tours",
      "Tanzania photography tours",
      "Zanzibar nightlife",
      "Tanzania trekking",
      "Zanzibar marine parks",
      "Tanzania luxury resorts",
      "Zanzibar water sports",
      "Tanzania cultural tours",
      "Zanzibar honeymoon packages",
      "Tanzania camping safaris",
      "Zanzibar culinary tours",
      "Tanzania group tours",
      "Zanzibar romantic getaways",
      "Tanzania private safaris",
      "Zanzibar safari tours",
      "Tanzania adventure activities",
      "Zanzibar beach resorts",
      "Tanzania guided tours",
      "Zanzibar eco-resorts",
      "Tanzania destination",
      "Zanzibar exclusive resorts",
      "Tanzania itinerary",
      "Zanzibar exclusive tours",
      "Tanzania best safaris",
      "Zanzibar luxury villas",
      "Tanzania honeymoon destinations",
      "Zanzibar private islands",
      "Tanzania travel packages",
      "Zanzibar all-inclusive resorts",
      "Tanzania top attractions",
      "Zanzibar cultural experiences",
      "Tanzania nature tours",
      "Zanzibar sightseeing",
      "Tanzania luxury accommodations",
      "Zanzibar exclusive activities",
      "Tanzania travel guide",
      "Zanzibar must-see places",
      "Tanzania safari experiences",
      "Zanzibar travel tips",
      "Tanzania eco-lodges",
      "Zanzibar beach activities",
      "Tanzania tourist spots",
      "Zanzibar adventure tours",
      "Tanzania travel deals",
      "Zanzibar safari adventures",
      "Tanzania wildlife safaris",
      "Zanzibar romantic tours",
      "Tanzania scenic tours",
      "Zanzibar travel packages",
      "Tanzania luxury travel",
      "Zanzibar family resorts",
      "Tanzania wildlife experiences",
      "Zanzibar exclusive packages",
      "Tanzania top destinations",
      "Zanzibar luxury holidays",
      "Tanzania cultural experiences",
      "Zanzibar scenic spots",
      "Tanzania travel agency",
      "Zanzibar safari packages",
      "Tanzania exclusive tours",
      "Zanzibar travel services",
      "Tanzania luxury tours",
      "Zanzibar travel agency",
      "Tanzania honeymoon tours",
      "Zanzibar romantic resorts",
      "Tanzania group safaris",
      "Zanzibar adventure activities",
      "Tanzania luxury vacations",
      "Zanzibar cultural tours",
      "Tanzania safari destinations",
      "Zanzibar luxury getaways",
      "Tanzania travel offers",
      "Zanzibar travel packages",
    ],
  openGraph: {
    title: "Explore Tanzania | Serengeti Nexus - Premier Tanzania Travel & Tour Agency",
    description:
      "Discover the beauty of Tanzania with Serengeti Nexus. Experience unforgettable safaris, stunning beaches in Zanzibar, and majestic Mount Kilimanjaro. Your adventure in Tanzania awaits!",
    url: "https://www.serengetinexus.com/destinations/tanzania",
    siteName: "Serengeti Nexus",
    images: [
      {
        url: "https://www.serengetinexus.com/images/tanzania-og.jpg",
        width: 800,
        height: 600,
        alt: "Tanzania Safari",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Tanzania | Serengeti Nexus - Premier Tanzania Travel & Tour Agency",
    description:
      "Discover the beauty of Tanzania with Serengeti Nexus. Experience unforgettable safaris, stunning beaches in Zanzibar, and majestic Mount Kilimanjaro. Your adventure in Tanzania awaits!",
    images: ["https://www.serengetinexus.com/images/tanzania-twitter.jpg"],
  },
};

export default function Page() {
  return (
    <main>
      <Header2 />
      <Hero />
      <AllDestinations />
      <ArticlesOne />
      <FooterOne />
    </main>
  );
}