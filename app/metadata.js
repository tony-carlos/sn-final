// app/metadata.js
export const metadata = {
    title: "Serengeti Nexus - Serengeti Tours & Safaris",
    description: "Join Serengeti Nexus for exclusive Serengeti tours and safaris. Experience top destinations, curated packages, and unforgettable adventures tailored to your preferences.",
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
    alternates: {
      canonical: "https://www.serengetinexus.com/",
    },
    openGraph: {
        title: "Serengeti Nexus - Premier Serengeti Tours & Safaris",
        description:
          "Join Serengeti Nexus for exclusive Serengeti tours and safaris. Experience top destinations, curated packages, and unforgettable adventures tailored to your preferences.",
        url: "https://www.serengetinexus.com/",
        type: "website",
        locale: "en_US",
        images: [
          {
            url: "https://www.serengetinexus.com/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Serengeti Nexus - Premier Serengeti Tours & Safaris",
          },
        ],
      },
      additionalMetaTags: [
        {
          name: "robots",
          content: "index, follow",
        },
        // Structured Data as JSON-LD
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Serengeti Nexus",
            "url": "https://www.serengetinexus.com/",
            "logo": "https://www.serengetinexus.com/images/logo.png",
            "description":
              "Serengeti Nexus offers exclusive tours and safaris in the Serengeti. Experience the wildlife and natural beauty with our curated packages.",
            "telephone": "+1234567890",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Serengeti Drive",
              "addressLocality": "Serengeti Town",
              "addressRegion": "TZ",
              "postalCode": "12345",
              "addressCountry": "TZ",
            },
            "sameAs": [
              "https://www.facebook.com/SerengetiNexus",
              "https://www.twitter.com/SerengetiNexus",
              "https://www.instagram.com/SerengetiNexus",
            ],
          }),
        },
      ],
    };