// /app/admin/safariguide/ImageCropper.js

"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Slider,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getCroppedImg } from "./cropImage"; // Import the utility function

const ImageCropper = ({ imageSrc, aspect = 1200 / 630, onCropped, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropped(croppedImage);
    } catch (e) {
      console.error(e);
      onCancel(); // Optionally handle errors by cancelling
    }
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent>
        <Box sx={{ position: "relative", width: "100%", height: 400, background: "#333" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCrop} variant="contained" color="primary">
          Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
