"use client";

import React, { useEffect } from "react";

// Minimal test to confirm Google Translate widget can load
export default function GoogleTranslateTest() {
  useEffect(() => {
    // 1. Define the callback function on window
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,de,zh-CN,fr,es,nl", // The languages you want
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // 2. Add the Google Translate script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // 3. Cleanup on unmount
    return () => {
      const scripts = document.querySelectorAll(
        'script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      );
      scripts.forEach((scr) => scr.parentNode.removeChild(scr));
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Google Translate Widget Test</h1>
      
      {/* This is the default Google Translate widget container (visible) */}
      <div id="google_translate_element" style={{ border: "1px solid #ccc", padding: "1rem" }}></div>

      <ul>
        <li>English</li>
        <li>German</li>
        <li>Chinese</li>
        <li>French</li>
        <li>Spanish</li>
        <li>Dutch</li>
      </ul>

   
    </div>
  );
}
