// app/components/GuideList.jsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * GuideList Component to display Safari Guides with search functionality.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.guides - Array of Safari Guide objects.
 *
 * @returns {JSX.Element} - Rendered list of Safari Guides with search functionality.
 */
export default function GuideList({ guides }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuides, setFilteredGuides] = useState(guides);

  /**
   * Helper function to strip HTML tags from a string.
   *
   * @param {string} html - String containing HTML tags.
   * @returns {string} - Plain text without HTML tags.
   */
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  /**
   * Helper function to truncate text to a specified length and append "..."
   *
   * @param {string} text - The text to truncate.
   * @param {number} maxLength - The maximum number of characters allowed.
   * @returns {string} - Truncated text with "..." if truncated.
   */
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredGuides(guides);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = guides.filter((guide) => {
        const titleMatch = guide.title.toLowerCase().includes(lowercasedTerm);
        const descriptionPlain = stripHtml(guide.description).toLowerCase();
        const descriptionMatch = descriptionPlain.includes(lowercasedTerm);
        return titleMatch || descriptionMatch;
      });
      setFilteredGuides(filtered);
    }
  }, [searchTerm, guides]);

  return (
    <>
      {/* Guides Display */}
      <section className="layout-pt-md">
        <div className="container">
          <div className="row y-gap-30">
            {filteredGuides.length === 0 ? (
              <div className="col-12">
                <p className="text-center">No guides found matching your search.</p>
              </div>
            ) : (
              filteredGuides.map((guide, i) => (
                <div key={i} className="col-lg-4 col-md-6">
                  <div className="px-50 py-45 border-1 rounded-12">
                    {/* Display up to two images */}
                   

                    <h3 className="text-18 fw-500">{guide.title}</h3>

                    {/* Display truncated plain text description */}
                    <div className="mt-10">
                      {truncateText(stripHtml(guide.description), 30)}
                    </div>

                    {/* Read More Button */}
                    <div className="mt-20">
                      <Link
                        href={`/tanzaniasafariguide/${guide.slug}`}
                        className="btn btn-secondary"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
