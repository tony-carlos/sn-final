"use client";
import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/app/lib/getCroppedImg";

const ImageCropper = ({
  imgUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9, // default to 16:9
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  // Save the cropped area in pixels from react-easy-crop
  const onCropCompleteLocal = (croppedArea, croppedAreaPixels) => {
    setCroppedPixels(croppedAreaPixels);
  };

  // When user clicks "Crop," we call getCroppedImg, which returns a 1280×720 Blob/File
  const handleCrop = async () => {
    if (!croppedPixels) {
      alert("Please crop the image first.");
      return;
    }

    try {
      // getCroppedImg returns { file, url, width, height } with a 1280x720 file
      const { file } = await getCroppedImg(imgUrl, croppedPixels, zoom);
      onCropComplete(file);
    } catch (err) {
      console.error("Error cropping image:", err);
      alert("Failed to crop the image. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-lg">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Cropper
            image={imgUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteLocal}
            onZoomChange={setZoom}
            // Optional styling
            cropShape="rect"
            showGrid={true}
          />
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleCrop}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Crop
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
