// components/frontend/destinations/ImageLightBox.jsx

"use client";

import React from "react";
import { Modal, Carousel } from "react-bootstrap";
import Image from "next/image";

export default function ImageLightBox({
  images,
  activeLightBox,
  setActiveLightBox,
  currentSlideIndex,
  setCurrentSlideIndex,
}) {
  const handleSelect = (selectedIndex, e) => {
    setCurrentSlideIndex(selectedIndex);
  };

  return (
    <Modal
      show={activeLightBox}
      onHide={() => setActiveLightBox(false)}
      size="lg"
      centered
    >
      <Modal.Body>
        <Carousel activeIndex={currentSlideIndex} onSelect={handleSelect}>
          {images.map((img, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex justify-content-center">
                <Image
                  src={img.url}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={600}
                  className="d-block"
                  objectFit="contain"
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  );
}
