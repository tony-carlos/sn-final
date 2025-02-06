// app/components/BlogList2.jsx

"use client";

import React from "react";
import useBlogs from "@/app/hooks/useBlogs";
import Image from "next/image";
import Link from "next/link";
import { CircularProgress, Typography, Box, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BlogList2() {
  const { blogs, loading, error } = useBlogs();

  if (loading) {
    return (
      <section className="layout-pt-md layout-pb-xl">
        <div className="container text-center">
          <CircularProgress />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="layout-pt-md layout-pb-xl">
        <div className="container text-center">
          <Typography color="error">Failed to load blogs.</Typography>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-pt-md layout-pb-xl">
      <div className="container">
        <div className="row y-gap-30 justify-between">
          <div className="col-lg-8">
            <div className="row y-gap-60">
              {blogs.map((elm) => (
                <div key={elm.id} className="col-12">
                  <Link
                    href={`/blog-single/${elm.slug}`} // Use slug instead of ID
                    className="blogCard -type-1"
                  >
                    <div className="blogCard__image ratio ratio-41:30">
                      {elm.images && elm.images.length > 0 ? (
                        <Image
                          width={616}
                          height={451}
                          src={elm.images[0]} // Assuming images is an array
                          alt={elm.title}
                          className="img-ratio rounded-12"
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ccc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "12px",
                          }}
                        >
                          <Typography variant="subtitle1">No Image</Typography>
                        </Box>
                      )}
                    </div>

                    <div className="blogCard__content mt-30">
                      <div className="d-flex x-gap-10 text-14">
                        <div className="lh-13">
                          {elm.createdAt
                            ? new Date(elm.createdAt.seconds * 1000).toLocaleDateString()
                            : "No Date"}
                        </div>
                        <div className="lh-13">By {elm.author || "Author Name"}</div>
                      </div>

                      <h3 className="blogCard__title text-30 lh-15 mt-10">
                        {elm.title}
                      </h3>

                      <p className="mt-10">
                        {elm.description.replace(/<[^>]+>/g, "").substring(0, 150)}...
                      </p>

                      <button className="fw-500 mt-10">
                        <span className="mr-10">Read More</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_142_28418)">
                            <path
                              d="M15.5553 0H5.77756C5.53189 0 5.3331 0.198792 5.3331 0.444458C5.3331 0.690125 5.53189 0.888917 5.77756 0.888917H14.4824L0.129975 15.2413C-0.0436504 15.415 -0.0436504 15.6962 0.129975 15.8698C0.216766 15.9566 0.330516 16 0.444225 16C0.557933 16 0.671641 15.9566 0.758475 15.8698L15.1109 1.51738V10.2223C15.1109 10.4679 15.3097 10.6667 15.5553 10.6667C15.801 10.6667 15.9998 10.4679 15.9998 10.2223V0.444458C15.9998 0.198792 15.801 0 15.5553 0Z"
                              fill="#05073C"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_142_28418">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="d-flex justify-center flex-column mt-60">

              <div className="text-14 text-center mt-20">
                Showing results 1-{blogs.length} of {blogs.length}
              </div>
            </div>
          </div>

          <div className="col-lg-auto">
            {/* Sidebar can remain as is or be enhanced to use dynamic data */}
            {/* Assuming categories, recentBlogs, and tags are static */}
          </div>
        </div>
      </div>
    </section>
  );
}
