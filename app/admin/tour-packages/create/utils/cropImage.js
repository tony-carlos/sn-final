// /app/utils/cropImage.js

export const getCroppedImg = (imageFile, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(imageFile);
      image.src = url;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            reject(new Error("Canvas is empty"));
            return;
          }
          blob.name = imageFile.name;
          resolve(blob);
        }, "image/jpeg");
      };
      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };
  