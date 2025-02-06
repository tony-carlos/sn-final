// /app/components/ImageCropper.js

"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { getCroppedImg } from "../utils/cropImage"; // We'll implement this utility function next

/**
 * ImageCropper Component
 *
 * Allows users to crop an image before uploading.
 *
 * @param {object} props - Component props.
 * @param {File} props.imgFile - The image file to crop.
 * @param {number} props.aspectRatio - The desired aspect ratio for cropping.
 * @param {function} props.onCropComplete - Callback when cropping is complete.
 * @param {function} props.onCancel - Callback to handle cancellation.
 */
const ImageCropper = ({ imgFile, aspectRatio, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /**
   * Callback when the cropping area changes.
   *
   * @param {object} croppedArea - The cropped area in percentages.
   * @param {object} croppedAreaPixels - The cropped area in pixels.
   */
  const onCropChange = (crop) => {
    setCrop(crop);
  };

  /**
   * Callback when the zoom level changes.
   *
   * @param {number} zoom - The new zoom level.
   */
  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  /**
   * Callback when cropping is complete.
   *
   * @param {object} croppedArea - The cropped area in percentages.
   * @param {object} croppedAreaPixels - The cropped area in pixels.
   */
  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * Handle the confirmation of cropping.
   */
  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(imgFile, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error("Error cropping image:", error);
      onCancel();
    }
  };

  /**
   * Handle cancellation of cropping.
   */
  const handleCropCancel = () => {
    onCancel();
  };

  // Convert the File object to a data URL for cropping
  const [imageSrc, setImageSrc] = useState(null);
  React.useEffect(() => {
    if (imgFile) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result.toString());
      });
      reader.readAsDataURL(imgFile);
    }
  }, [imgFile]);

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCropCancel}
      contentLabel="Crop Image"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="relative w-11/12 max-w-3xl bg-white rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4">Crop Image</h2>
        {imageSrc && (
          <div className="relative w-full h-96">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteInternal}
            />
          </div>
        )}
        <div className="flex justify-between p-4">
          <button
            onClick={handleCropCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-32"
            />
            <button
              onClick={handleCropConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Crop & Upload
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropper;
