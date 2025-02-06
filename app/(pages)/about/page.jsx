import BannerOne from "@/components/homes/banners/BannerOne";
import BrandsOne from "@/components/homes/brands/BrandsOne";
import FeaturesOne from "@/components/homes/features/FeaturesOne";
import FeturesTwo from "@/components/homes/features/FeturesTwo";
import TestimonialOne from "@/components/homes/testimonials/TestimonialOne";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Banner from "@/components/pages/about/Banner";
import Hero from "@/components/pages/about/Hero";
import Information from "@/components/pages/about/Information";
import Team from "@/components/pages/about/Team";
import React from "react";
import WhatWeOffer from "./WhatWeOffer";
import OurVision from "./OurVision";
import JoinUs from "./JoinUs";
import OurMission from "./OurMission";
import Meta from "./Meta";
import Header2 from "@/components/layout/header/Header2";
import WhyChooseUs from "./WhyChooseUs";

export const metadata = {
  title:
    "About Us | Serengeti Nexus | Premier Safari and Hiking Adventures in Tanzania",
  description:
    "Learn more about Serengeti Nexus, your trusted local tour operator in Tanzania. Discover our mission, offerings, and why travelers choose us for unforgettable safari and hiking experiences.",
  keywords:
    "Tanzania Safari, Serengeti Tours, Hiking in Tanzania, African Safaris, Great Migration, Wildlife Conservation, Custom Safari Packages, Kilimanjaro Hiking, Ngorongoro Conservation, Cultural Tours Tanzania",
  authors: [{ name: "Serengeti Nexus", url: "https://www.serengetinexus.com" }],
  creator: "Serengeti Nexus",
  openGraph: {
    title:
      "About Us | Serengeti Nexus | Premier Safari and Hiking Adventures in Tanzania",
    description:
      "Learn more about Serengeti Nexus, your trusted local tour operator in Tanzania. Discover our mission, offerings, and why travelers choose us for unforgettable safari and hiking experiences.",
    url: "https://www.serengetinexus.com/about-us",
    type: "website",
    siteName: "Serengeti Nexus",
    images: [
      {
        url: "https://www.serengetinexus.com/images/about-us-og.jpg",
        width: 1200,
        height: 630,
        alt: "Serengeti Nexus - Premier Safari and Hiking Adventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "About Us | Serengeti Nexus | Premier Safari and Hiking Adventures in Tanzania",
    description:
      "Learn more about Serengeti Nexus, your trusted local tour operator in Tanzania. Discover our mission, offerings, and why travelers choose us for unforgettable safari and hiking experiences.",
    images: ["https://www.serengetinexus.com/images/about-us-twitter.jpg"],
    creator: "@SerengetiNexus",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function page() {
  return (
    <>
      <main>
        <Header2 />
        <Hero />
        <Information />
        <OurMission />
        <OurVision />
        <WhatWeOffer />
        <WhyChooseUs />
        <Banner />
        <FeaturesOne />
        <JoinUs />
        <FooterOne />
      </main>
      
    </>
  );
}
