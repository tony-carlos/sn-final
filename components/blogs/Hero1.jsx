// components/blogs/Hero1.jsx

"use client";

import Image from "next/image";
import React from "react";
import { Typography } from "@mui/material";

export default function Hero1({ blog }) {
  if (!blog) {
    return (
      <section className="hero -type-1 -min-2">
        <div className="hero__bg">
          {/* Default Background Images */}
          <Image width={1800} height={500} src="/img/hero/1.png" alt="Default background" />
          <Image
            style={{ height: "auto" }}
            width="1800"
            height="40"
            src="/img/hero/1/shape.svg"
            alt="Decorative shape"
          />
        </div>

        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-12">
              <div className="hero__content text-center">
                <Typography >Our News</Typography>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Use the first image from the blog's images array as the background
  const heroBackgroundImage =
    blog.images && blog.images.length > 0 ? blog.images[0] : "/img/hero/1.png";

  return (
    <section className="hero -type-1 -min-2">
      <div className="hero__bg">
        <Image width={1800} height={500} src={heroBackgroundImage} alt="Blog Background" />
        <Image
          style={{ height: "auto" }}
          width="1800"
          height="40"
          src="/img/hero/1/shape.svg"
          alt="Decorative shape"
        />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-12">
            <div className="hero__content text-center">
              <h1 className="hero__title">{blog.title}</h1>
              <p className="hero__text">{blog.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
