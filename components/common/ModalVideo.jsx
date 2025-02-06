// components/common/ModalVideo.jsx

"use client"; // Ensure this is a client-side component

import ModalVideo from "react-modal-video";

/**
 * ModalVideoComponent
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.setIsOpen - Function to update the modal's visibility
 * @param {string} props.videoId - YouTube video ID to embed
 * @returns {JSX.Element} - Rendered modal video component
 */
export default function ModalVideoComponent({ isOpen, setIsOpen, videoId }) {
  return (
    <ModalVideo
      channel="youtube"
      isOpen={isOpen}
      videoId={videoId} // Use dynamic videoId
      onClose={() => setIsOpen(false)}
    />
  );
}
