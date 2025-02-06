// /tour-packages/components/cropImage.js

export default function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
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
            // Reject if blob creation failed
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, 'image/jpeg');
      };
  
      image.onerror = () => {
        reject(new Error('Image load error'));
      };
    });
  }
  