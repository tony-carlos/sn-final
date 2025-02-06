import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Header2 from "@/components/layout/header/Header2";
import ContactForm from "@/components/pages/contact/ContactForm";
import Locations from "@/components/pages/contact/Locations";
import Map from "@/components/pages/contact/Map";
import React from "react";
import CustomizeItinerary from "./CustomizeItinerary";

export const metadata = {
  title: "Contact Serengeti Nexus | Get in Touch",
  description:
    "Contact Serengeti Nexus for inquiries, support, and more. Reach us via phone, email, or visit our office in Arusha, Tanzania.",
  openGraph: {
    title: "Contact Serengeti Nexus | Get in Touch",
    description:
      "Contact Serengeti Nexus for inquiries, support, and more. Reach us via phone, email, or visit our office in Arusha, Tanzania.",
    url: "https://www.serengetinexus.com/contact",
    siteName: "Serengeti Nexus",
    images: [
      {
        url: "https://www.serengetinexus.com/images/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Serengeti Nexus | Get in Touch",
    description:
      "Contact Serengeti Nexus for inquiries, support, and more. Reach us via phone, email, or visit our office in Arusha, Tanzania.",
    images: ["https://www.serengetinexus.com/images/twitter-image.jpg"],
  },
};

export default function page() {
  return (
    <>
      <main>
        <Header2 />
        
        <CustomizeItinerary /> 
        
        <FooterOne />
      </main>
    </>
  );
}
