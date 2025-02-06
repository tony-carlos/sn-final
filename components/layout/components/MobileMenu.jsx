"use client";

import { menuData } from "@/data/mobileMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
const socialMediaLinks = [
  { id: 1, class: "icon-facebook", href: "#" },
  { id: 2, class: "icon-twitter", href: "#" },
  { id: 3, class: "icon-instagram", href: "#" },
  { id: 4, class: "icon-tripadvisor", href: "#" },
];
export default function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }) {
  const [activeSub, setActiveSub] = useState("");
  const pathname = usePathname();
  return (
    <div
      data-aos="fade"
      data-aos-delay=""
      className={`menu js-menu ${mobileMenuOpen ? "-is-active" : ""} `}
      style={
        mobileMenuOpen
          ? { opacity: "1", visibility: "visible" }
          : { pointerEvents: "none", visibility: "hidden" }
      }
    >
      <div
        onClick={() => setMobileMenuOpen(false)}
        className="menu__overlay js-menu-button"
      ></div>

      <div className="menu__container">
        <div className="menu__header">
          <h4> Menu</h4>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="js-menu-button"
          >
            <i className="icon-cross text-10"></i>
          </button>
        </div>

        <div className="menu__content">
          <ul
            className="menuNav js-navList -is-active"
            style={{ maxHeight: "calc(100vh - 262px)", overflowY: "auto" }}
          >
            <li className="menuNav__item">
              <Link href="/">Home</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/tour-packages">All Trips</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/destinations">Destinations</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/about">About Us</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/contact">Contact</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/tanzaniasafariguide">Safari Guides</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/travelarticles">Blog</Link>
            </li>
            <li className="menuNav__item">
              <Link href="/customizesafari">Make A Request</Link>
            </li>
          </ul>
        </div>

        <div className="menu__footer">
          <i className="icon-headphone text-50"></i>

          <div className="text-20 lh-12 fw-500 mt-20">
            <div>Speak to our expert at</div>
            <div className="text-accent-1">255 759 964985</div>
          </div>
        </div>
      </div>
    </div>
  );
}
