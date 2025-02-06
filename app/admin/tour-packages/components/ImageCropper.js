// /tour-packages/create/components/ImageCropper.js

'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { FaTimes } from 'react-icons/fa';

const ImageCropper = ({ imgFile, aspectRatio, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /**
   * Update the cropped area pixels when cropping is complete.
   */
  const handleCropCompleteInternal = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  /**
   * Handle the upload of the cropped image.
   */
  const handleUpload = async () => {
    try {
      const imageSrc = URL.createObjectURL(imgFile);
      const mimeType = imgFile.type || 'image/jpeg';
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, mimeType);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error('Error during cropping:', e);
      onCancel();
    }
  };

  /**
   * Handle the cancellation of cropping.
   */
  const handleCancel = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4">
        {/* Close Button */}
        <button
          type="button" // Prevents form submission
          onClick={handleCancel}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        {/* Cropper */}
        <div className="relative w-full h-96">
          <Cropper
            image={URL.createObjectURL(imgFile)}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropCompleteInternal}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between mt-4">
          <button
            type="button" // Prevents form submission
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button" // Prevents form submission
            onClick={handleUpload}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
