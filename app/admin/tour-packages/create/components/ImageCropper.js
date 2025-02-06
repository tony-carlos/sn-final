// /app/admin/tour-packages/create/components/ImageCropper.js

"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import Slider from "@material-ui/core/Slider";
import { getCroppedImg } from "./cropImage"; // Utility function to get cropped image
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

// Set the app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement("#__next"); // Adjust if your app's root element has a different ID
}

/**
 * ImageCropper Component
 *
 * Provides a modal interface for cropping images.
 *
 * @param {object} props - Component props.
 * @param {File} props.imgFile - The image file to be cropped.
 * @param {number} props.aspectRatio - The aspect ratio for cropping.
 * @param {function} props.onCropComplete - Callback when cropping is complete.
 * @param {function} props.onCancel - Callback to cancel cropping.
 */
const ImageCropper = ({ imgFile, aspectRatio, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imgFile, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image.");
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onCancel}
      contentLabel="Image Cropper"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 "
    >
      <div className="bg-white p-4 rounded-lg relative w-11/12 md:w-2/3 lg:w-1/2">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close Cropper"
        >
          <FaTimes size={20} />
        </button>

        {/* Cropper */}
        <div className="relative w-full h-64">
          <Cropper
            image={URL.createObjectURL(imgFile)}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteInternal}
          />
        </div>

        {/* Zoom Slider */}
        <div className="mt-4">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => onZoomChange(zoom)}
            aria-labelledby="Zoom Slider"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </Modal>
  );
};

ImageCropper.propTypes = {
  imgFile: PropTypes.instanceOf(File).isRequired,
  aspectRatio: PropTypes.number.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImageCropper;
