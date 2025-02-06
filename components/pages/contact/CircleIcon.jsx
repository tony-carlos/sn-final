// app/components/CircleIcon.jsx

import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * CircleIcon Component
 *
 * Renders a circular icon with a link.
 *
 * @param {Object} props - Component props.
 * @param {string} props.href - URL to link to.
 * @param {string} props.src - Source of the icon image.
 * @param {string} props.alt - Alt text for the image.
 * @param {number} [props.size=24] - Diameter of the icon image inside the circle.
 * @param {number} [props.circleSize=40] - Diameter of the outer circle.
 *
 * @returns {JSX.Element} - Rendered Circle Icon with Link.
 */
const CircleIcon = ({ href, src, alt, size = 24, circleSize = 40 }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    <div
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: "50%",
        border: `2px solid #4A90E2`, // Replace with your primary color if different
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, border-color 0.2s",
      }}
      className="hover:scale-110 hover:border-primary"
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
    </div>
  </Link>
);

export default CircleIcon;
