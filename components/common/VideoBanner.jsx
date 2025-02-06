// components/common/VideoBanner.jsx

"use client";

import React, { useState } from "react";
import ModalVideoComponent from "@/components/common/ModalVideoComponent"; // Correct absolute path
import Image from "next/image";
import { BiPlay } from "react-icons/bi";
import PropTypes from "prop-types";

const VideoBanner = ({ videoId, backgroundImage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="layout-pt-xl">
        <div className="video relative container">
          <div className="video__bg">
            <Image
              width={1290}
              height={550}
              src={backgroundImage}
              alt="Video Background"
              className="rounded-12 object-cover"
              priority
            />
          </div>

          <div className="row justify-center pb-50 md:pb-0">
            <div className="col-auto">
              <div
                onClick={() => setIsOpen(true)}
                style={{ cursor: "pointer" }}
                className="d-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg"
              >
                <BiPlay size={24} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ModalVideoComponent
        videoId={videoId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

VideoBanner.propTypes = {
  videoId: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
};

export default VideoBanner;
