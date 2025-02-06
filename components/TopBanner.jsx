"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/serengetinexus/",
    icon: "/icons/instagram-2016-5.svg"
  },
  {
    platform: "YouTube",
    url: "https://youtube.com/@serengetinexus?si=gawYphoGckQHGHHg",
    icon: "/icons/youtube-icon-5.svg"
  },
  {
    platform: "TikTok",
    url: "https://www.tiktok.com/@serengetinexus?_t=ZM-8sPCvfLDpwb&_r=1",
    icon: "/icons/tiktok-icon-2.svg"
  },
  {
    platform: "Pinterest",
    url: "https://www.pinterest.com/serengetinexus",
    icon: "/icons/pinterest-3.svg"
  }
];

export default function TopBanner() {
  useEffect(() => {
    const scriptId = "gtranslate-script";

    if (typeof window !== "undefined" && !document.getElementById(scriptId)) {
      // Configure translate settings before loading the script
      window.gtranslateSettings = {
        default_language: "en",
        detect_browser_language: true,
        languages: ["en", "fr", "it", "es", "nl", "de", "cs", "zh-CN"],
        wrapper_selector: ".gtranslate_wrapper",
        switcher_horizontal_position: "right",
        switcher_vertical_position: "top",
        flag_style: "3d"
      };

      const script = document.createElement("script");
      script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
      script.id = scriptId;
      script.defer = true;

      script.onload = () => {
        console.log("Google Translate script loaded successfully");
      };

      script.onerror = (error) => {
        console.error("Error loading Google Translate script:", error);
      };

      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-red-600 px-5 py-3 md:flex-row flex-col">
      <div className="flex gap-5 mb-3 md:mb-0">
        {SOCIAL_LINKS.map(({ platform, url, icon }) => (
          <Link
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className="inline-block w-6 h-6 transition-transform hover:scale-110"
          >
            <Image
              src={icon}
              alt={platform}
              width={24}
              height={24}
              className="w-full h-full"
            />
          </Link>
        ))}
      </div>
      
      <div className="gtranslate_wrapper" />
    </div>
  );
}