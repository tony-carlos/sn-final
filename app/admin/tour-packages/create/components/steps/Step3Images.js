// /app/admin/tour-packages/create/components/steps/Step3Images.js

"use client"; // Ensure this is a client component

import React, { useState, useEffect, useContext } from "react";
import { useFormContext } from "react-hook-form";
import ImageCropper from "../../../components/ImageCropper";
import { storage } from "@/app/lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { FormContext } from "../FormContext"; // Correctly import FormContext as a named export

/**
 * Step3Images Component
 *
 * Handles image uploads, cropping, and management for the tour package.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isEdit - Indicates if the form is in edit mode.
 */
const Step3Images = ({ isEdit }) => {
  const { setValue, watch, formState: { errors, isValid } } = useFormContext();
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({}); // Tracks upload progress for each image

  // Access FormContext to get navigation functions and updateFormData
  const { nextStep, prevStep, updateFormData } = useContext(FormContext);

  // Watch for existing images in form context
  const watchedImages = watch("images");

  /**
   * Initialize images from form context on component mount or when watchedImages change.
   */
  useEffect(() => {
    if (watchedImages && Array.isArray(watchedImages)) {
      setImages(watchedImages);
    }
  }, [watchedImages]);

  /**
   * Handle image selection from computer.
   *
   * @param {Event} e - File input change event.
   */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      setCurrentImageFile(file);
      setCropModalOpen(true);
    }
  };

  /**
   * Handle crop completion and upload the cropped image to Firebase Storage.
   *
   * @param {Blob} croppedBlob - The cropped image blob.
   */
  const handleCropComplete = (croppedBlob) => {
    // Upload the cropped image
    uploadCroppedImage(croppedBlob);
  };

  /**
   * Upload the cropped image to Firebase Storage with progress tracking.
   *
   * @param {Blob} blob - The cropped image blob.
   */
  const uploadCroppedImage = (blob) => {
    try {
      // Determine the file extension based on MIME type
      const extension = blob.type.split("/")[1] || "jpeg"; // Default to 'jpeg' if undefined

      const storagePath = `tours/${uuidv4()}.${extension}`;
      const imageRef = ref(storage, storagePath);

      // Create an upload task
      const uploadTask = uploadBytesResumable(imageRef, blob, {
        contentType: blob.type,
      });

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [storagePath]: progress,
          }));
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image.");
          setCropModalOpen(false);
          setCurrentImageFile(null);
          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[storagePath];
            return updated;
          });
        },
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const newImage = { url: downloadURL, storagePath };
          const updatedImages = [...images, newImage];
          setImages(updatedImages);
          setValue("images", updatedImages, { shouldValidate: true, shouldDirty: true });

          // Remove upload progress for this image
          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[storagePath];
            return updated;
          });

          // Reset cropping modal and current image
          setCropModalOpen(false);
          setCurrentImageFile(null);
          toast.success("Image uploaded successfully.");
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
      setCropModalOpen(false);
      setCurrentImageFile(null);
    }
  };

  /**
   * Cancel image cropping.
   */
  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setCurrentImageFile(null);
  };

  /**
   * Remove an image from the gallery.
   *
   * @param {number} index - The index of the image to remove.
   */
  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    if (!imageToRemove) return;

    try {
      const imageRef = ref(storage, imageToRemove.storagePath);
      await deleteObject(imageRef);

      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      setValue("images", updatedImages, { shouldValidate: true, shouldDirty: true });

      toast.success("Image removed successfully.");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image.");
    }
  };

  /**
   * Handle navigation to the next step.
   * Enables the "Next" button only when at least one image is uploaded.
   */
  const handleNext = () => {
    nextStep();
  };

  /**
   * Handle navigation to the previous step.
   */
  const handleBack = () => {
    prevStep();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Step 3: Package Images</h2>

      {/* Upload from Computer Section */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Upload Images</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="mb-2 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
        />
        <p className="text-sm text-gray-500">
          Upload images with a resolution of 1280 x 720 pixels for optimal quality.
        </p>
      </div>

      {/* Display Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Upload Progress</h3>
          <ul>
            {Object.entries(uploadProgress).map(([storagePath, progress]) => (
              <li key={storagePath} className="mb-2">
                <span className="block text-sm text-gray-700">
                  Uploading {storagePath.split("/").pop()}:
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700">{Math.round(progress)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Images Gallery */}
      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Selected Images</h3>
          <div className="flex flex-wrap">
            {images.map((img, index) => (
              <div key={index} className="relative m-2">
                <Image
                  src={img.url}
                  alt={`Package Image ${index + 1}`}
                  width={200}
                  height={150}
                  className="object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                  title="Remove Image"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropModalOpen && currentImageFile && (
        <ImageCropper
          imgFile={currentImageFile}
          aspectRatio={1280 / 720} // 1280x720 pixels
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={images.length === 0} // Disable if no images are uploaded
          className={`px-4 py-2 rounded-md focus:outline-none ${
            images.length === 0
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Toast Notifications */}
      {/* Ensure that <ToastContainer /> is rendered in your root layout or a higher-level component */}
    </div>
  );
};

export default Step3Images;
