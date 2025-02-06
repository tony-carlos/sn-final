// /app/tour-packages/create/components/steps/ImageCropper.js

'use client';

import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ imgFile, aspectRatio, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({
    aspect: aspectRatio,
    unit: '%',
    width: 80,
    x: 10,
    y: 10,
  });
  const [imageRef, setImageRef] = useState(null);

  const onImageLoaded = (image) => {
    setImageRef(image);
  };

  const getCroppedImg = () => {
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      1200,
      700
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = imgFile.name;
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCropComplete = async () => {
    const croppedBlob = await getCroppedImg();
    onCropComplete(croppedBlob);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <ReactCrop
          src={URL.createObjectURL(imgFile)}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onImageLoaded={onImageLoaded}
        />
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropComplete}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
