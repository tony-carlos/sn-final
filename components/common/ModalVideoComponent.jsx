// components/common/ModalVideoComponent.jsx

"use client";

import React from "react";
import ModalVideo from "react-modal-video";
import PropTypes from "prop-types";

// Import react-modal-video CSS
import "react-modal-video/css/modal-video.min.css";

const ModalVideoComponent = ({ isOpen, setIsOpen, videoId }) => {
  return (
    <ModalVideo
      channel="youtube"
      isOpen={isOpen}
      videoId={videoId} // Use the dynamic videoId prop
      onClose={() => setIsOpen(false)}
    />
  );
};

ModalVideoComponent.propTypes = {
  videoId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ModalVideoComponent;
