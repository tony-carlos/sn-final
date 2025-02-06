import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Header2 from "@/components/layout/header/Header2";
import Image from "next/image";
import React from "react";

export const metadata = {
  title: "Serengeti Nexus - Serengeti Tours & Safaris",
  description:"Join Serengeti Nexus for exclusive Serengeti tours and safaris. Experience top destinations, curated packages, and unforgettable adventures tailored to your preferences.",
  };

export default function NotFound() {
  return (
    <>
      <main>
        <Header2 />
        <section className="nopage mt-header">
          <div className="container">
            <div className="row y-gap-30 justify-between items-center">
              <div className="col-xl-6 col-lg-6">
                <Image
                  width="629"
                  height="481"
                  src="/img/404/1.svg"
                  alt="image"
                />
              </div>

              <div className="col-xl-5 col-lg-6">
                <div className="nopage__content pr-30 lg:pr-0">
                  <h1>
                    40<span className="text-accent-1">4</span>
                  </h1>
                  <h2 className="text-30 md:text-24 fw-700">
                    Oops! It looks like you're lost.
                  </h2>
                  <p>
                    The page you're looking for isn't available. Try to search
                    again or use the go to.
                  </p>

                  <button className="button -md -dark-1 bg-accent-1 text-white mt-25">
                    Go back to homepage
                    <i className="icon-arrow-top-right ml-10"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterOne />
      </main>
    </>
  );
}
