// app/frontend/destinations/page.jsx

import React from "react";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header2 from "@/components/layout/header/Header2";
import PageHeader from "@/components/tours/PageHeader";
import DestinationsPageClient from "./DestinationsPageClient";

// Define each National Park as its own const
const SERENGETI = {
  name: "Serengeti National Park",
  description:
    "Experience the iconic Serengeti with 3, 5, 7, or 9-day safaris, witness the world-famous wildebeest migration, encounter abundant predators, and enjoy scenic hot-air balloon rides.",
  keywords: [
    "Serengeti",
    "wildebeest migration",
    "big cats",
    "hot-air balloon safari",
    "7-day safari",
  ],
};

const NGORONGORO = {
  name: "Ngorongoro Conservation Area",
  description:
    "Explore Ngorongoro crater rim hikes, embark on 4 or 5-day wildlife safaris, and encounter the Big Five in a unique volcanic caldera.",
  keywords: [
    "Ngorongoro",
    "crater rim hike",
    "Big Five",
    "4-day safari",
    "5-day safari",
  ],
};

const LAKE_MANYARA = {
  name: "Lake Manyara National Park",
  description:
    "Discover Lake Manyara’s flamingos, tree-climbing lions, and 3 or 5-day birdwatching safaris perfect for photography.",
  keywords: [
    "Lake Manyara",
    "flamingos",
    "tree-climbing lions",
    "birdwatching",
    "3-day safari",
  ],
};

const TARANGIRE = {
  name: "Tarangire National Park",
  description:
    "Marvel at Tarangire’s massive elephant herds, baobab trees, and 3,4-day walking safaris for a winning 2025 adventure.",
  keywords: [
    "Tarangire",
    "elephants",
    "baobab trees",
    "4-day walking safari",
    "photography",
  ],
};

const ARUSHA = {
  name: "Arusha National Park",
  description:
    "Arusha offers 3,5-day guided hikes, canoeing on Momella Lakes, and scenic views of Mt. Meru’s rainforest trails.",
  keywords: [
    "Arusha",
    "Momella Lakes",
    "Mount Meru",
    "5-day hiking",
    "rainforest trek",
  ],
};

const KILIMANJARO = {
  name: "Kilimanjaro National Park",
  description:
    "Trek Africa’s highest peak with 5,7,9-day climbing packages, alpine meadows, and glaciers for a lifetime achievement.",
  keywords: [
    "Kilimanjaro",
    "mountain climbing",
    "7-day trek",
    "9-day climb",
    "glaciers",
  ],
};

const NYERERE_SELOUS = {
  name: "Nyerere (Selous) National Park",
  description:
    "Nyerere’s boat safaris, 4 or 7-day game drives, and raw wilderness along the Rufiji River define the ultimate safari.",
  keywords: [
    "Nyerere",
    "Selous",
    "Rufiji River",
    "boat safari",
    "7-day package",
  ],
};

const RUAHA = {
  name: "Ruaha National Park",
  description:
    "Ruaha’s largest Tanzanian park offers 5,9-day predator safaris, rugged landscapes, and secluded camps.",
  keywords: [
    "Ruaha",
    "predators",
    "9-day safari",
    "rugged landscapes",
    "secluded camps",
  ],
};

const MIKUMI = {
  name: "Mikumi National Park",
  description:
    "Mikumi provides 3,4-day family-friendly safaris, zebra herds, and easy road access from Dar es Salaam.",
  keywords: [
    "Mikumi",
    "family-friendly",
    "zebra herds",
    "4-day safari",
    "road access",
  ],
};

const KATAVI = {
  name: "Katavi National Park",
  description:
    "Katavi’s remote wilderness, 5 or 7-day camping safaris, hippo pods, and true off-the-beaten-track experience.",
  keywords: [
    "Katavi",
    "remote wilderness",
    "camping safari",
    "hippos",
    "7-day adventure",
  ],
};

const GOMBE = {
  name: "Gombe Stream National Park",
  description:
    "Gombe offers 3,5-day chimpanzee treks, lakeside sunsets, and Jane Goodall’s famous research legacy.",
  keywords: [
    "Gombe",
    "chimpanzee trek",
    "Jane Goodall",
    "5-day trip",
    "lakeside sunsets",
  ],
};

const MAHALE = {
  name: "Mahale Mountains National Park",
  description:
    "Mahale Mountains boast 4 or 7-day chimp safaris, pristine forests, and dhow rides on Lake Tanganyika.",
  keywords: [
    "Mahale",
    "chimp safari",
    "Lake Tanganyika",
    "7-day forest hike",
    "dhow rides",
  ],
};

const SAADANI = {
  name: "Saadani National Park",
  description:
    "Saadani combines beach and bush with 3,5-day coastal safaris, Indian Ocean breeze, and mangrove kayaking.",
  keywords: [
    "Saadani",
    "beach and bush",
    "mangroves",
    "5-day coastal safari",
    "kayaking",
  ],
};

const UDZUNGWA = {
  name: "Udzungwa Mountains National Park",
  description:
    "Udzungwa’s 3 or 4-day rainforest treks, waterfalls, and endemic primates offer an unparalleled hiking escape.",
  keywords: [
    "Udzungwa",
    "rainforest trek",
    "waterfalls",
    "4-day hiking",
    "endemic primates",
  ],
};

const MKOMAZI = {
  name: "Mkomazi National Park",
  description:
    "Mkomazi is home to African wild dogs, black rhinos, and 3,5-day scenic drives under Mt. Kilimanjaro’s shadow.",
  keywords: [
    "Mkomazi",
    "wild dogs",
    "black rhinos",
    "5-day drive",
    "Kilimanjaro views",
  ],
};

const KITULO = {
  name: "Kitulo National Park",
  description:
    "Kitulo’s wildflower meadows, 3 or 4-day botanical hikes, and rare orchids make it the Serengeti of Flowers.",
  keywords: [
    "Kitulo",
    "wildflowers",
    "orchids",
    "4-day botanical hike",
    "Serengeti of Flowers",
  ],
};

const SAANANE = {
  name: "Saanane Island National Park",
  description:
    "Saanane Island’s compact 3-day getaway offers tame antelopes, rich birdlife, and lake excursions.",
  keywords: [
    "Saanane",
    "island safari",
    "birdlife",
    "3-day excursion",
    "lake trips",
  ],
};

const BURIGI_CHATO = {
  name: "Burigi-Chato National Park",
  description:
    "Burigi-Chato’s newly established 5 or 7-day safaris, diverse habitats, and future conservation hotspot.",
  keywords: [
    "Burigi-Chato",
    "new park",
    "diverse habitats",
    "7-day safari",
    "conservation hotspot",
  ],
};

const IBANDA_KYERWA = {
  name: "Ibanda-Kyerwa National Park",
  description:
    "Ibanda-Kyerwa’s remote 3,4-day journeys, unique wildlife, and cultural encounters off the main tourist track.",
  keywords: [
    "Ibanda-Kyerwa",
    "remote journey",
    "cultural encounters",
    "4-day trip",
    "off-track",
  ],
};

const RUMANYIKA_KARAGWE = {
  name: "Rumanyika-Karagwe National Park",
  description:
    "Rumanyika-Karagwe’s lush forests, 5-day birding safaris, and rare species discovery in northwest Tanzania.",
  keywords: [
    "Rumanyika-Karagwe",
    "lush forests",
    "rare species",
    "5-day birding",
    "northwest Tanzania",
  ],
};

const UGALLA_RIVER = {
  name: "Ugalla River National Park",
  description:
    "Ugalla River’s 5 or 9-day wetland safaris, canoeing adventures, and tranquility define a serene wildlife retreat.",
  keywords: [
    "Ugalla River",
    "wetland safari",
    "canoeing",
    "9-day retreat",
    "tranquil wildlife",
  ],
};

// Combine all parks
const ALL_PARKS = [
  SERENGETI,
  NGORONGORO,
  LAKE_MANYARA,
  TARANGIRE,
  ARUSHA,
  KILIMANJARO,
  NYERERE_SELOUS,
  RUAHA,
  MIKUMI,
  KATAVI,
  GOMBE,
  MAHALE,
  SAADANI,
  UDZUNGWA,
  MKOMAZI,
  KITULO,
  SAANANE,
  BURIGI_CHATO,
  IBANDA_KYERWA,
  RUMANYIKA_KARAGWE,
  UGALLA_RIVER,
];

// Create a concise meta description combining all parks
const combinedDescription = `
Embark on an unforgettable 2025 safari through Tanzania's 21 National Parks. 
Experience iconic destinations like Serengeti National Park with its world-famous wildebeest migration, 
Ngorongoro Conservation Area's Big Five, and the pristine beaches of Saadani National Park. 
Enjoy guided hikes, hot-air balloon safaris, and encounters with diverse wildlife in Tanzania's breathtaking landscapes.
`;

// Combine all keywords, ensuring uniqueness
const allKeywordsSet = new Set();
ALL_PARKS.forEach((park) => {
  park.keywords.forEach((kw) => allKeywordsSet.add(kw));
});
const allKeywords = Array.from(allKeywordsSet).join(", ");

// Define the metadata export
export const metadata = {
  title: "Tanzania National Parks Safari 2025 | SerengetiNexus",
  description: combinedDescription.trim(),
  keywords: allKeywords,
  openGraph: {
    title: "Tanzania National Parks Safari 2025 | SerengetiNexus",
    description: combinedDescription.trim(),
    url: "https://www.serengetinexus.com/destinations/tanzania",
    siteName: "SerengetiNexus",
    images: [
      {
        url: "https://www.serengetinexus.com/images/tanzania-og.jpg", // Replace with your actual image URL
        width: 1200, // Recommended size for OG images
        height: 630,
        alt: "Tanzania Safari Adventure",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanzania National Parks Safari 2025 | SerengetiNexus",
    description: combinedDescription.trim(),
    images: ["https://www.serengetinexus.com/images/tanzania-twitter.jpg"], // Replace with your actual image URL
  },
  // Additional metadata properties can be added here
};

export default function Page() {
  return (
    <main>
      <Header2 />
      <PageHeader />
      <DestinationsPageClient />
      <FooterOne />
    </main>
  );
}
