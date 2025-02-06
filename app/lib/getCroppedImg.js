export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);

  // 1. Create a canvas at 1280×720 instead of pixelCrop.width/height
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  // 2. Draw the cropped region onto the 1280×720 canvas
  //    (scaling from pixelCrop.width/height to 1280×720)
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    1280,
    720
  );

  // 3. Return a Blob (JPEG) and a file URL just like before
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        blob.name = "cropped_image.jpeg";
        const fileUrl = URL.createObjectURL(blob);
        resolve({ file: blob, url: fileUrl });
      },
      "image/jpeg",
      0.9
    );
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Avoid CORS issues
    image.src = url;
  });
}
