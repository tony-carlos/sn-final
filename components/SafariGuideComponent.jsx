// app/components/SafariGuideComponent.jsx

import Image from "next/image";
import React from "react";
import Link from "next/link"; // Import Link for navigation

/**
 * SafariGuideComponent to display a list of Safari Guides.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.guides - Array of Safari Guide objects.
 *
 * @returns {JSX.Element} - Rendered list of Safari Guides.
 */
export default function SafariGuideComponent({ guides }) {
  return (
    <section className="layout-pt-md">
      <div className="container">
        <div className="row y-gap-30">
          {guides.map((guide, i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="px-50 py-45 border-1 rounded-12">
                <Image
                  width={60}
                  height={60}
                  src={guide.imgSrc || "/img/placeholder.png"} // Use a placeholder if imgSrc is missing
                  alt={guide.title || "Safari Guide Image"}
                  className="mb-20"
                />

                <h3 className="text-18 fw-500">{guide.title}</h3>

                <div className="mt-10">{guide.content}</div>

                {/* Read More Button */}
                <div className="mt-20">
                  <Link href={`/tanzaniasafariguide/${guide.slug}`}>
                    <a className="btn btn-primary">Read More</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
