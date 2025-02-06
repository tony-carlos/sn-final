import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <section className="pageHeader -type-1">
      <div className="pageHeader__bg">
        <Image
          width={1800}
          height={500}
          src="/Serengeti_western_corridor-1001.jpg"
          alt="image"
        />
        <Image
          width="1800"
          height="40"
          style={{ height: "auto" }}
          src="/img/hero/1/shape.svg"
          alt="image"
        />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-12">
            <div className="pageHeader__content">
              <h1 className="pageHeader__title">About Us</h1>

              <p className="pageHeader__text">
              Your Gateway to Unforgettable Adventures in Tanzania
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
