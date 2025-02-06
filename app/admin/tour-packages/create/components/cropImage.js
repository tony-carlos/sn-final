// /app/admin/tour-packages/create/components/cropImage.js

/**
 * Utility function to create a cropped image blob.
 *
 * @param {File} imageSrc - The source image file.
 * @param {object} pixelCrop - The cropped area in pixels.
 * @returns {Promise<Blob>} - The cropped image blob.
 */
export const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageSrc);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

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

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};
