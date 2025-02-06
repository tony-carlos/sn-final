// components/Header2.jsx

"use client";

import React, { useState, useEffect } from "react";
import Menu from "../components/Menu";
import MobileMenu from "../components/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header2() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Navigates to the specified page.
   * @param {string} pageName - The path to navigate to.
   */
  const pageNavigate = (pageName) => {
    router.push(pageName);
  };

  return (
    <>
      <header className="header -type-2 js-header">
        <div className="header__container container">
          {/* Mobile Menu Button */}
          <div className="headerMobile__left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="header__menuBtn js-menu-button"
              aria-label="Open Menu"
            >
              <i className="icon-main-menu"></i>
            </button>
          </div>

          {/* Logo and Navigation */}
          <div className="header__logo">
            <Link href="/" className="" aria-label="Home">
              <Image
                width="167"
                height="36"
                src="/logo-light.png"
                alt="Logo"
                priority
              />
            </Link>

            <Menu />
          </div>

          {/* Mobile Right Buttons */}
          <div className="headerMobile__right">
            <button
              onClick={() => pageNavigate("/tour-packages")}
              className="d-flex"
              aria-label="Search"
            >
              <i className="icon-search text-18"></i>
            </button>

    
          </div>

          {/* Desktop Right Section */}
          <div className="header__right xl:d-none">
            {/* Language Switcher */}
            <div className="ml-30">
            </div>

            {/* Contact Button */}
            <a
              href="/contact"
              className="button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30"
            >
              Contact
            </a>
            <Link
              href="/customizesafari"
              className="button -sm -dark-1 bg-accent-1 rounded-200 text-white ml-30"
            >
              Make A Request
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />
    </>
  );
}
