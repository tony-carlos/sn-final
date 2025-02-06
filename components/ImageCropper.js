// components/ImageCropper.js

"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';

// You might need to install react-toastify if you haven't already
// npm install react-toastify
import 'react-toastify/dist/ReactToastify.css';

const ImageCropper = ({ imgUrl, aspectRatio, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [hasCropped, setHasCropped] = useState(false);

  // Callback when the crop area changes
  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handler for the "Crop Now" button
  const handleCropNow = async () => {
    if (hasCropped) {
      toast.info('This image has already been cropped.');
      return;
    }

    if (!croppedAreaPixels) {
      toast.error('Please select a crop area before cropping.');
      return;
    }

    setIsCropping(true);
    try {
      const croppedImage = await getCroppedImg(imgUrl, croppedAreaPixels);
      onCropComplete(croppedImage);
      setHasCropped(true);
      toast.success('Image cropped successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to crop image.');
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"> {/* Removed black background */}
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl mb-4">Crop Image</h3>
        <div className="relative w-full h-64 bg-gray-200">
          <Cropper
            image={imgUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal} // Updated to internal handler
          />
        </div>
        {/* Slider for Zoom (optional) */}
        <div className="flex justify-center my-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-2/3"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={isCropping}
          >
            Cancel
          </button>
          <button
            onClick={handleCropNow}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={isCropping || hasCropped}
          >
            {isCropping ? 'Cropping...' : hasCropped ? 'Cropped' : 'Crop Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get cropped image using Canvas API
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous'; // Enable CORS if necessary
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      // Draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Remove black background (assuming black is the background color)
      // This step can be customized based on how you define the "black background"
      // For example, making black pixels transparent
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // If the pixel is black, make it transparent
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const croppedFile = new File([blob], 'cropped-image.png', {
          type: 'image/png',
        });
        resolve(croppedFile);
      }, 'image/png');
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

export default ImageCropper;