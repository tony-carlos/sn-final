// components/LanguageSwitcher.jsx

"use client";

import React from "react";

// Define the available languages with their ISO 639-1 codes
const languages = [
  { name: "English", code: "en" },
  { name: "German", code: "de" },
  { name: "Chinese", code: "zh-CN" },
  { name: "French", code: "fr" },
  { name: "Spanish", code: "es" },
  { name: "Dutch", code: "nl" },
];

/**
 * LanguageSwitcher Component
 * Renders a set of clickable links for language selection.
 * On click, it sets the language in the Google Translate widget.
 *
 * @param {object} props - Component props
 * @param {string} props.parentClass - Optional additional CSS classes for the container
 */
export default function LanguageSwitcher({ parentClass }) {
  /**
   * Changes the language by setting the value of the hidden Google Translate select element.
   *
   * @param {string} languageCode - The ISO 639-1 code of the target language
   */
  const changeLanguage = (languageCode) => {
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      console.log(`Changing language to: ${languageCode}`);
      selectField.value = languageCode;
      // Trigger the change event to initiate translation
      const event = new Event("change", { bubbles: true });
      selectField.dispatchEvent(event);
    } else {
      console.error("Google Translate select (.goog-te-combo) not found.");
    }
  };

  return (
    <div className={parentClass ? parentClass : ""}>
      {/* Language Switcher Links */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {languages.map((lang) => (
          <a
            key={lang.code}
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              changeLanguage(lang.code);
            }}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "#000", // Adjust color as needed to match your UI
            }}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.name}
          </a>
        ))}
      </div>
    </div>
  );
}
