"use client";

import React, { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Check if the Google Translate script is already loaded
    if (typeof window !== "undefined" && !document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
      script.id = "google-translate-script";
      script.defer = true;

      // Setup the script settings
      script.onload = () => {
        console.log("Google Translate script loaded!");
        window.gtranslateSettings = {
          default_language: "en",
          detect_browser_language: true,
          languages: ["en", "fr", "it", "es", "nl", "de", "cs", "zh-CN"],
          wrapper_selector: ".gtranslate_wrapper",
          flag_style: "3d",
          switcher_horizontal_position: "right",
          switcher_vertical_position: "top",
        };
      };

      document.body.appendChild(script);
    } else {
      console.log("Google Translate script already loaded.");
    }
  }, []);

  return (
    <div className="gtranslate_wrapper">
      <div id="google_translate_element2">
        <div className="skiptranslate goog-te-gadget" dir="ltr">
          <div id=":0.targetLanguage">
            <select className="goog-te-combo" aria-label="Language Selector">
              <option value="">Select Language</option>
              <option value="sw">Swahili</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
            </select>
          </div>
          Powered by{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            <a
              className="VIpgJd-ZVi9od-l4eHX-hSRGPd"
              href="https://translate.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_42x16dp.png"
                width="37px"
                height="14px"
                style={{ paddingRight: "3px" }}
                alt="Google Translate"
              />
              Google Translate
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}