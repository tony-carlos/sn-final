// components/blogs/BlogSingle.jsx

"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@mui/material";

export default function BlogSingle({ blog }) {
  if (!blog) {
    return (
      <section className="layout-pt-md layout-pb-xl">
        <div className="container text-center">
          <Typography color="error">Failed to load the blog post.</Typography>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="layout-pt-md layout-pb-xl">
        <div className="container">
          <div className="row y-gap-30 justify-center">
            <div className="col-lg-8">
              <h2 className="text-30 md:text-24">{blog.title}</h2>
              <Typography variant="subtitle1" color="textSecondary">
                By {blog.author || "Serengeti Nexus"} |{" "}
                {blog.createdAt
                  ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString()
                  : "No Date"}
              </Typography>
              <p
                className="mt-20"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              ></p>
              {blog.images && blog.images.length > 0 && (
                <div className="row y-gap-30 pt-20">
                  {blog.images.map((imageUrl, index) => (
                    <div key={index} className="col-md-6">
                      <Image
                        width={410}
                        height={350}
                        src={imageUrl}
                        alt={`Blog Image ${index + 1}`}
                        className="rounded-8"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
