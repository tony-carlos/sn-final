// src/components/JoinUs.js

import React from "react";
import Link from "next/link"; // Import Link from Next.js

export default function JoinUs() {
  return (
    <section className="layout-pt-xl layout-pb-xl bg-light">
      <div className="container">
        <div className="row y-gap-20 justify-center text-center">
          <div className="col-lg-8">
            <h2 className="text-30 fw-700">
              Join Us on Your Next Adventure
            </h2>
            <p className="mt-20">
              Discover the magic of Tanzania with <strong>Serengeti Nexus</strong>. Whether you’re embarking on your first safari or seeking a new hiking challenge, we are here to guide you every step of the way. Let us help you create unforgettable memories amidst the awe-inspiring landscapes and vibrant cultures of this extraordinary land.
            </p>
            {/* Flex Container for Centering */}
            <div className="d-flex justify-center">
              {/* Link Component Styled as a Button */}
              <Link href="/contact" className="button -md -dark-1 bg-accent-1 text-white mt-30">
                Contact Us Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
