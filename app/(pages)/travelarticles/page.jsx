"use client";

import useBlogs from "@/app/hooks/useBlogs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import Header2 from "@/components/layout/header/Header2";
import FooterOne from "@/components/layout/footers/FooterOne";

export default function ArticlesOne() {
  const { blogs, loading, error } = useBlogs();

  if (loading) {
    return (
      <section className="layout-pt-xl layout-pb-xl">
        <div className="container text-center">
          <CircularProgress />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="layout-pt-xl layout-pb-xl">
        <div className="container text-center">
          <Typography color="error">Failed to load blogs.</Typography>
        </div>
      </section>
    );
  }

  return (
    <>
    <Header2 />
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2
              data-aos="fade-up"
              data-aos-delay=""
              className="text-30 md:text-24"
            >
              Travel Articles
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href="/blog-list-2"
              data-aos="fade-right"
              data-aos-delay=""
              className="buttonArrow d-flex items-center"
            >
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </Link>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-30 pt-40 sm:pt-20"
        >
          {blogs.slice(0, 3).map((elm) => (
            <div key={elm.id} className="col-lg-4 col-md-6">
              <Link
                href={`/blog-single/${elm.slug}`} // Use slug instead of ID
                className=" -type-1"
              >
                <div className="blogCard__image ratio ratio-41:30">
                  <Image
                    width={616}
                    height={451}
                    src={elm.images && elm.images.length > 0 ? elm.images[0] : "/images/default.jpg"}
                    alt={elm.title}
                    className="img-ratio rounded-12"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="blogCard__badge">{elm.category}</div>
                </div>

                <div className="blogCard__content mt-30">
                  <div className="blogCard__info text-14">
                    <div className="lh-13">
                      {elm.createdAt
                        ? new Date(elm.createdAt.seconds * 1000).toLocaleDateString()
                        : "No Date"}
                    </div>
                    <div className="blogCard__line"></div>
                    <div className="lh-13">By {elm.author || "Serengeti Nexus"}</div>
                  </div>

                  <h3 className="blogCard__title text-18 fw-500 mt-10">
                    {elm.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
    <FooterOne />
    </>
  );
}
