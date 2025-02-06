// /app/admin/safariguide/cropImage.js

export const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
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
            console.error("Canvas is empty");
            reject(new Error("Canvas is empty"));
            return;
          }
          blob.name = "cropped.jpeg";
          resolve(blob);
        }, "image/jpeg");
      };
      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };
  