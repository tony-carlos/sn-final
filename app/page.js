// app/page.js

import React from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

// 1. Define the Loading Component first
const Loading = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// 2. Dynamically import Client Components with SSR disabled
const Header2 = dynamic(() => import("@/components/layout/header/Header2"), {
  ssr: false,
  loading: () => <Loading />,
});
const Hero4 = dynamic(() => import("@/components/homes/heros/Hero4"), {
  ssr: false,
  loading: () => <Loading />,
});
const DestinationsTwo = dynamic(
  () => import("./frontend/destinations/DestinationsTwo"),
  { ssr: false, loading: () => <Loading /> }
);
const FeaturedTours = dynamic(
  () => import("./components/tours/FeaturedTours"),
  { ssr: false, loading: () => <Loading /> }
);
const DayTripsTours = dynamic(
  () => import("./components/tours/DayTripsTours"),
  { ssr: false, loading: () => <Loading /> }
);
const RecommendedTours = dynamic(
  () => import("./components/tours/RecommendedTours"),
  { ssr: false, loading: () => <Loading /> }
);
const SpecialPackagesTours = dynamic(
  () => import("./components/tours/SpecialPackagesTours"),
  { ssr: false, loading: () => <Loading /> }
);
const AllTours = dynamic(() => import("@/components/homes/tours/AllTours"), {
  ssr: false,
  loading: () => <Loading />,
});
const WhyChooseUs = dynamic(() => import("./(pages)/about/WhyChooseUs"), {
  ssr: false,
  loading: () => <Loading />,
});
const ArticlesOne = dynamic(
  () => import("@/components/homes/articles/ArticlesOne"),
  { ssr: false, loading: () => <Loading /> }
);
const InteractiveHomePage = dynamic(
  () => import("@/components/InteractiveHomePage"),
  { ssr: false, loading: () => <Loading /> }
);
const FooterOne = dynamic(
  () => import("@/components/layout/footers/FooterOne"),
  { ssr: false, loading: () => <Loading /> }
);

// 3. Define Metadata outside of any component or object
export const metadata = {
  title: "Serengeti Nexus - Serengeti Tours & Safaris",
  description:
    "Join Serengeti Nexus for exclusive Serengeti tours and safaris. Experience top destinations, curated packages, and unforgettable adventures tailored to your preferences.",
  keywords: [
    "Serengeti Nexus",
    "Serengeti Tours",
    "Travel Tanzania",
    "Serengeti Safari",
    "Best Tours",
    "Travel Packages",
    "Adventure Travel",
    "Kilimanjaro",
    "Arusha Day Trips",
    "Most Serengeti",
    "Tanzania Travel",
    "Kilimanjaro Tours",
    "Arusha Excursions",
    "Serengeti National Park",
    "Tanzania Safaris",
    "Wildlife Tours",
    "Nature Trips",
    "Day Trips in Arusha",
    "Tanzania Adventure",
    "Mount Kilimanjaro",
    "Arusha Travel Guide",
    "Serengeti Wildlife",
    "Tanzania Vacation",
    "Arusha Day Tours",
    "Kilimanjaro Climbing",
    "Serengeti Experiences",
    "Explore Tanzania",
    "Tanzania Tour Packages",
    "Arusha Safari",
  ],
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best time to climb Mount Kilimanjaro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best time to climb Kilimanjaro is during the dry seasons: January to March and June to October. These periods offer the most stable weather conditions and clearest views. The warmest months are January and February, while the clearest skies are usually found from June to August."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to climb Kilimanjaro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The cost to climb Kilimanjaro typically ranges from $2,000 to $6,000 USD, depending on the route, duration, and tour operator. This usually includes permits, guides, porters, accommodation, and meals during the climb. Additional costs include flights, equipment rental, and pre/post climb accommodation."
      }
    },
    {
      "@type": "Question",
      "name": "What are the best things to do in Arusha, Tanzania?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Popular activities in Arusha include visiting Arusha National Park, exploring the Maasai Market, touring the Cultural Heritage Centre, taking a coffee plantation tour, hiking Mount Meru, and using the city as a gateway for safari trips to the Serengeti and Ngorongoro Crater."
      }
    },
  ]
};

// 4. Define the Main Page Component without Suspense
export default function HomePage() {
  return (
    <>
     <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
   
    <main>
      <Header2 />
      <Hero4 />
      <DestinationsTwo />
      <FeaturedTours />
      <DayTripsTours />
      <RecommendedTours />
      <SpecialPackagesTours />
      <AllTours />
      <WhyChooseUs />
      <ArticlesOne />
      <InteractiveHomePage />
      <FooterOne />
    </main>

    </>
  );
}
