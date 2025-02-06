// app/components/Menu.jsx

"use client";

import React from "react";
import { homes, pages, tours } from "@/data/menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTravelGuides from "@/app/hooks/useTravelGuides";
import { CircularProgress, Alert } from "@mui/material";

export default function Menu() {
  const pathname = usePathname();

  // Using the custom hook to fetch Travel Guides
  const { travelGuides, loading, error } = useTravelGuides();

  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          {/* Home Menu Item */}
          <div className="desktopNav__item">
            <a
              className={
                pathname?.split("/")[1].split("-")[0] === "home"
                  ? "activeMenu"
                  : ""
              }
              href="/"
            >
              Home
            </a>
          </div>
          {/* Our Packages Menu Item */}
          <div className="desktopNav__item">
            <Link href="/tour-packages">All Trips </Link>
          </div>

          {/* Destination Menu Item */}
          <div className="desktopNav__item">
            <Link href="/destinations">Destinations</Link>
          </div>

          {/* Destination Menu Item */}
          <div className="desktopNav__item">
            <Link href="/about">About</Link>
          </div>
          <div className="desktopNav__item">
            <Link href="/customizesafari">Make Request</Link>
          </div>
          {/* === New Travel Guides Menu Item === */}
          <div className="desktopNav__item">
            <Link href="/tanzaniasafariguide">Safari Guides</Link> 
          </div>
          {/* === End of Travel Guides Menu Item === */}

          {/* === New Travel Guides Menu Item === */}
          <div className="desktopNav__item">
            <Link href="/travelarticles">Blog</Link>
          </div>
          {/* === End of Travel Guides Menu Item === */}
        </div>
      </div>
    </>
  );
}
